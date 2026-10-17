import { useState, useEffect } from "react";
import axios from "axios";

export function useWhatsApp(credentials) {
  const [activeChat, setActiveChat] = useState("");
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");

  const { idInstance, apiToken } = credentials || {};

  // Логика получения уведомлений
  useEffect(() => {
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
          console.log("Таймаут ...");
        } else {
          console.error("Ошибка уведомлений:", error);
        }
      } finally {
        if (isMounted) setTimeout(checkNotifications, 1000);
      }
    };

    checkNotifications();
    return () => {
      isMounted = false;
    };
  }, [idInstance, apiToken, activeChat]);

  // Логика отправки сообщения
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

  // Возвращаем то, что нужно компонентам для рендеринга
  return {
    activeChat,
    setActiveChat,
    messages,
    inputText,
    setInputText,
    handleSendMessage,
  };
}
