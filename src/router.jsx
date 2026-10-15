import { createBrowserRouter, RouterProvider } from "react-router";
import Auth from "./pages/Auth";
import Chat from "./pages/Chat";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Chat />,
  },

  // ❗ Открытые маршруты
  { path: "/login", element: <Auth /> },
]);

function Router() {
  return <RouterProvider router={router} />;
}

export default Router;
