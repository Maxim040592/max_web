import React from "react";
export default function Sidebar({ activeChat, setActiveChat, handleLogout }) {
  return (
    <div className="w-1/3 bg-white border-r border-gray-300 flex flex-col h-full">
      {/* Шапка с логотипом и кнопкой */}
      <div className="p-4 bg-[#f0f2f5] border-b border-gray-300 flex justify-between items-center">
        <span className="font-bold text-lg text-emerald-700">Web Chat</span>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-3 py-1.5 text-sm rounded hover:bg-red-600 transition font-medium"
        >
          Выйти
        </button>
      </div>

      {/* Форма создания нового чата */}
      <div className="p-4 border-b border-gray-200">
        <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
          Новый чат
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Формат: 79991112233"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-emerald-500"
            onChange={(e) => setActiveChat(e.target.value)}
          />
        </div>
      </div>

      {/* Список активных чатов */}
      <div className="flex-1 overflow-y-auto">
        {activeChat && (
          <div className="p-4 bg-emerald-50 border-l-4 border-emerald-500 cursor-pointer">
            <p className="font-semibold">+{activeChat}</p>
            <p className="text-xs text-gray-500 truncate">Активный диалог</p>
          </div>
        )}
      </div>
    </div>
  );
}
