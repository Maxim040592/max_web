import React from "react";

export default function ChatWindow({
  activeChat,
  messages,
  inputText,
  setInputText,
  handleSendMessage,
}) {
  return (
    <div className="w-2/3 flex flex-col h-full bg-[#efeae2] relative">
      {activeChat ? (
        <>
          {/* Шапка текущего чата */}
          <div className="p-4 bg-[#f0f2f5] border-b border-gray-300 flex items-center justify-between shadow-sm">
            <span className="font-semibold text-gray-700">
              Чат с: {activeChat}
            </span>
          </div>

          {/* 📜 ОБЛАСТЬ СООБЩЕНИЙ */}
          <div className="flex-1 overflow-y-auto p-6 space-y-3 flex flex-col">
            {messages.map((msg) => {
              const isOutgoing = msg.type === "outgoing";
              return (
                <div
                  key={msg.id}
                  className={`max-w-md p-3 rounded-lg shadow-sm text-sm break-words ${
                    isOutgoing
                      ? "bg-[#d9fdd3] self-end rounded-tr-none text-gray-900"
                      : "bg-white self-start rounded-tl-none text-gray-900"
                  }`}
                >
                  <p>{msg.text}</p>
                  <span className="block text-[10px] text-gray-400 text-right mt-1">
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
            className="p-4 bg-[#f0f2f5] flex gap-3 items-center border-t border-gray-300"
          >
            <input
              type="text"
              placeholder="Введите сообщение..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 border border-transparent rounded-lg px-4 py-2.5 bg-white text-sm focus:outline-none shadow-sm"
            />
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-5 py-2.5 text-sm font-medium shadow-sm transition-colors"
            >
              Отправить
            </button>
          </form>
        </>
      ) : (
        <>
          {/*если чат еще не создан */}
          <div className="m-auto text-center text-gray-500">
            <p className="text-lg font-medium">
              Выберите или создайте чат слева
            </p>
            <p className="text-sm">
              Чтобы начать переписку, введите номер телефона получателя
            </p>
          </div>
        </>
      )}
    </div>
  );
}
