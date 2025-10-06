import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Login from "../pages/Auth/Login";
import DashboardFuncionario from "../pages/Funcionario/DashboardFuncionario";
import DashboardAdmin from "../pages/Admin/DashboardAdmin";
import RelatoriosAdmin from "../pages/Admin/RelatoriosAdmin";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/funcionario",
    children: [
      {
        index: true,
        element: <DashboardFuncionario />,
      },
    ],
  },
  {
    path: "/admin",
    children: [
      {
        index: true,
        element: <DashboardAdmin />,
      },
      {
        path: "/admin/relatorios",
        element: <RelatoriosAdmin />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
