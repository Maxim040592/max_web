import { Navigate, useOutletContext } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import { useWhatsApp } from "../hooks/useWebChatApp";
function Chat() {
  const { credentials, setCredentials } = useOutletContext();

  // Вызываем наш кастомный хук и забираем из него все переменные и функции
  const chatProps = useWhatsApp(credentials);

  // Если не авторизован —  редирект
  if (!credentials) {
    return <Navigate to="/login" replace />;
  }

  //Функция logout
  const handleLogout = () => {
    setCredentials(null); // Сбросит стейт и очистит localStorage
  };

  return (
    <div className="flex h-screen bg-[#f0f2f5] text-gray-800 font-sans">
      {/* ЛЕВАЯ ПАНЕЛЬ: SIDEBAR */}
      <Sidebar
        activeChat={chatProps.activeChat}
        setActiveChat={chatProps.setActiveChat}
        handleLogout={handleLogout}
      ></Sidebar>

      {/* ПРАВАЯ ПАНЕЛЬ: Окно переписки */}
      <ChatWindow {...chatProps} />
    </div>
  );
}

export default Chat;
