import { Navigate, useOutletContext } from "react-router-dom";

function Chat() {
  const { credentials } = useOutletContext();

  // 🛡️ ЗАЩИТА: Если ключей нет, принудительно отправляем на /login
  if (!credentials) {
    return <Navigate to="/login" replace />;
  }
  return <h1></h1>;
}

export default Chat;
