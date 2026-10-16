import { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom"; // или "react-router"
import Auth from "./pages/Auth";
import Chat from "./pages/Chat";

// 1. Создаем общую оболочку приложения
function AppLayout() {
  // 1. Инициализируем стейт данными из localStorage (если они там есть)
  const [credentials, setCredentials] = useState(() => {
    const saved = localStorage.getItem("max_chat_credentials");
    return saved ? JSON.parse(saved) : null;
  });

  // 2. Следим за изменением credentials: если они изменились, обновляем localStorage
  useEffect(() => {
    if (credentials) {
      localStorage.setItem("max_chat_credentials", JSON.stringify(credentials));
    } else {
      localStorage.removeItem("max_chat_credentials"); // Для логаута
    }
  }, [credentials]);

  return <Outlet context={{ credentials, setCredentials }} />;
}

// 2. Настраиваем роутер с учетом дочерних маршрутов
const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />, // Главная оболочка
    children: [
      {
        index: true,
        element: <Chat />,
      },
      {
        path: "/login",
        element: <Auth />,
      },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
