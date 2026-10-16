// import { createBrowserRouter, RouterProvider } from "react-router";
// import Auth from "./pages/Auth";
// import Chat from "./pages/Chat";

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <Chat />,
//   },

//   // ❗ Открытые маршруты
//   {
//     path: "/login",
//     element: <Auth onAuthSuccess={(keys) => setCredentials(keys)} />,
//   },
// ]);

// function Router() {
//   return <RouterProvider router={router} />;
// }

// export default Router;
import { useState } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from "react-router-dom"; // или "react-router"
import Auth from "./pages/Auth";
import Chat from "./pages/Chat";

// 1. Создаем общую оболочку приложения
function AppLayout() {
  const [credentials, setCredentials] = useState(null);

  // Передаем состояние вниз во все дочерние страницы (Auth и Chat) через context
  return <Outlet context={{ credentials, setCredentials }} />;
}

// 2. Настраиваем роутер с учетом дочерних маршрутов
const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />, // Главная оболочка
    children: [
      {
        path: "",
        element: <Chat />,
      },
      {
        path: "login",
        element: <Auth />,
      },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
