import { Navigate, useOutletContext } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
function Chat() {
  //Сначала объявляем ВСЕ хуки подряд
  const { credentials, setCredentials } = useOutletContext();

  const [activeChat, setActiveChat] = useState("");
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");

  const { idInstance, apiToken } = credentials || {};

  // Эффект Long Polling
  useEffect(() => {
    // Если ключей нет, вообще ничего не делаем внутри эффекта
    if (!idInstance || !apiToken) return;

    let isMounted = true;

    const checkNotifications = async () => {
      const receiveUrl = `https://api.green-api.com/waInstance${idInstance}/receiveNotification/${apiToken}`;
      try {
        const response = await axios.get(receiveUrl);
        if (response.data && isMounted) {
          const { receiptId, body } = response.data;
          if (!receiptId) return;

          const isIncoming = body.typeWebhook === "incomingMessageReceived";
          const isOutgoing =
            body.typeWebhook === "outgoingMessageReceived" ||
            body.typeWebhook === "outgoingAPIMessageReceived";

          if (isIncoming || isOutgoing) {
            const senderChatId = body.senderData?.chatId;
            const messageId = body.idMessage;
            const timestamp = body.timestamp;
            const text =
              body.messageData?.textMessageData?.textMessage ||
              body.messageData?.extendedTextMessageData?.text;

            if (senderChatId && text) {
              const senderPhone = senderChatId.replace("@c.us", "");
              if (senderPhone === activeChat) {
                setMessages((prev) => {
                  if (prev.some((msg) => msg.id === messageId)) return prev;
                  return [
                    ...prev,
                    {
                      id: messageId,
                      text,
                      type: isIncoming ? "incoming" : "outgoing",
                      timestamp,
                    },
                  ];
                });
              }
            }
          }

          const deleteUrl = `https://api.green-api.com/waInstance${idInstance}/deleteNotification/${apiToken}/${receiptId}`;
          await axios.delete(deleteUrl);
        }
      } catch (error) {
        if (error.response && error.response.status === 408) {
          console.log("Таймаут длинный опрос, ожидаем...");
        } else {
          console.error("Ошибка уведомлений:", error);
        }
      } finally {
        if (isMounted) {
          setTimeout(checkNotifications, 1000);
        }
      }
    };

    checkNotifications();
    return () => {
      isMounted = false;
    };
  }, [idInstance, apiToken, activeChat]); // Хук всегда на месте

  //после всех хуков, делаем безопасную проверку для редиректа!
  if (!credentials) {
    return <Navigate to="/login" replace />;
  }

  // 3. Функция отправки сообщения
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !activeChat) return;

    try {
      const response = await axios.post(
        `https://api.green-api.com/waInstance${idInstance}/sendMessage/${apiToken}`,
        { chatId: `${activeChat}@c.us`, message: inputText },
      );

      if (response.data?.idMessage) {
        setMessages((prev) => [
          ...prev,
          {
            id: response.data.idMessage,
            text: inputText,
            type: "outgoing",
            timestamp: Math.floor(Date.now() / 1000),
          },
        ]);
        setInputText("");
      }
    } catch (error) {
      console.error("Ошибка отправки:", error);
    }
  };

  //Функция logout
  const handleLogout = () => {
    setCredentials(null); // Сбросит стейт и очистит localStorage
  };

  return (
    <div className="flex h-screen bg-[#f0f2f5] text-gray-800 font-sans">
      <Sidebar
        activeChat={activeChat}
        setActiveChat={setActiveChat}
        handleLogout={handleLogout}
      ></Sidebar>

      {/* ПРАВАЯ ПАНЕЛЬ: Окно переписки */}
      <div class="w-2/3 flex flex-col h-full bg-[#efeae2] relative">
        {activeChat ? (
          <>
            {/* Шапка текущего чата */}
            <div class="p-4 bg-[#f0f2f5] border-b border-gray-300 flex items-center justify-between shadow-sm">
              <span class="font-semibold text-gray-700">
                Чат с: {activeChat}
              </span>
            </div>

            {/* 📜 ОБЛАСТЬ СООБЩЕНИЙ */}
            <div class="flex-1 overflow-y-auto p-6 space-y-3 flex flex-col">
              {messages.map((msg) => {
                const isOutgoing = msg.type === "outgoing";
                return (
                  <div
                    key={msg.id}
                    class={`max-w-md p-3 rounded-lg shadow-sm text-sm break-words ${
                      isOutgoing
                        ? "bg-[#d9fdd3] self-end rounded-tr-none text-gray-900" // Стили для моих сообщений
                        : "bg-white self-start rounded-tl-none text-gray-900" // Стили для входящих сообщений
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span class="block text-[10px] text-gray-400 text-right mt-1">
                      {new Date(msg.timestamp * 1000).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* ⌨️ НИЖНЯЯ ПАНЕЛЬ: Ввод текста */}
            <form
              onSubmit={handleSendMessage}
              class="p-4 bg-[#f0f2f5] flex gap-3 items-center border-t border-gray-300"
            >
              <input
                type="text"
                placeholder="Введите сообщение..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                class="flex-1 border border-transparent rounded-lg px-4 py-2.5 bg-white text-sm focus:outline-none shadow-sm"
              />
              <button
                type="submit"
                class="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-5 py-2.5 text-sm font-medium shadow-sm transition-colors"
              >
                Отправить
              </button>
            </form>
          </>
        ) : (
          // если чат еще не выбран/не создан
          <div class="m-auto text-center text-gray-500">
            <p class="text-lg font-medium">Выберите или создайте чат слева</p>
            <p class="text-sm">
              Чтобы начать переписку, введите номер телефона получателя
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;
