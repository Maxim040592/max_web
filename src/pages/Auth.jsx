import { useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom"; // или "react-router"
import axios from "axios";

function Auth() {
  // Достаем функцию установки стейта из контекста роутера
  const { setCredentials } = useOutletContext();
  const navigate = useNavigate();

  const [idInstance, setIdInstance] = useState("");
  const [apiToken, setApiToken] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.get(
        `https://api.green-api.com/waInstance${idInstance}/getStateInstance/${apiToken}`,
      );

      if (response.data.stateInstance === "authorized") {
        // Сохраняем ключи в глобальный стейт
        setCredentials({ idInstance, apiToken });
        // Перенаправляем пользователя на главную страницу (в чат)
        navigate("/");
      } else {
        setError("Инстанс не авторизован в Max/Watsap/Telegram");
      }
    } catch (err) {
      setError("Ошибка авторизации. Проверьте введенные данные.");
    }
  };
  return (
    <div
      className="flex flex-col h-full bg-[#efeae2] relative"
      data-block="background-fon"
    >
      <div
        className="flex justify-center items-center min-h-screen"
        data-block="main block-content"
      >
        <div
          className="w-1/4 h-100 p-12 flex flex-col justify-center bg-[#efeae8] shadow-md"
          data-block="block-content"
        >
          <span className="font-bold text-lg text-emerald-700  mb-8 text-center">
            Авторизация
          </span>
          <form onSubmit={handleLogin}>
            <div
              className="flex flex-col pb-5"
              data-block="input block-idInstance"
            >
              <input
                type="text"
                placeholder="idInstance..."
                value={idInstance}
                onChange={(e) => setIdInstance(e.target.value)}
                className="flex-1 border border-transparent rounded-lg px-4 py-2.5 bg-white text-sm focus:outline-none shadow-sm"
              />
            </div>
            <div
              className="pb-5 flex flex-col"
              data-block="input block-apiTokenInstance"
            >
              <input
                type="password"
                placeholder="apiTokenInstance..."
                value={apiToken}
                onChange={(e) => setApiToken(e.target.value)}
                className="flex-1 border border-transparent rounded-lg px-4 py-2.5 bg-white text-sm focus:outline-none shadow-sm"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-5 py-2.5 text-sm font-medium shadow-sm transition-colors"
            >
              Войти
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Auth;
