import { useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom"; // или "react-router"

function Auth() {
  // Достаем функцию установки стейта из контекста роутера
  const { setCredentials } = useOutletContext();
  //const navigate = useNavigate();

  const [idInstance, setIdInstance] = useState("");
  const [apiToken, setApiToken] = useState("");
  const [error, setError] = useState("");

  return (
    <div
      class="bg-linear-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% w-full h-full"
      data-block="background-fon"
    >
      <div
        class="flex justify-center items-center min-h-screen"
        data-block="main block-content"
      >
        <div
          class="w-1/4 h-140 border p-12 flex flex-col justify-center"
          data-block="block-content"
        >
          <h1 class=" pb-10">Авторизация</h1>
          <form onSubmit={() => {}}>
            <div class="flex flex-col pb-5" data-block="input block-idInstance">
              <label from="idInstance">idInstance</label>
              <input
                type="text"
                class="w-1/2  border"
                id="idInstance"
                name="idInstance"
                value={idInstance}
                onChange={(e) => setIdInstance(e.target.value)}
              ></input>
            </div>
            <div
              class="pb-5 flex flex-col"
              data-block="input block-apiTokenInstance"
            >
              <label from="apiTokenInstance">apiTokenInstance</label>
              <input
                type="password"
                name="apiTokenInstance"
                class="w-1/2  border"
                id="apiTokenInstance"
                value={apiToken}
                onChange={(e) => setApiToken(e.target.value)}
              ></input>
            </div>
            {error && <p class="text-red-500 text-sm">{error}</p>}
            <button type="submit" class="border w-25">
              Войти
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Auth;
