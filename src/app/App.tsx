import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Login from "../pages/Auth/Login";
import DashboardFuncionario from "../pages/Funcionario/DashboardFuncionario";
import DashboardAdmin from "../pages/Admin/DashboardAdmin";
import RelatoriosAdmin from "../pages/Admin/RelatoriosAdmin";
// import PrivateRoute from "../routes/PrivateRoute";
// import AdminRoute from "../routes/AdminRoute";


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
        element: (
          //<PrivateRoute>
          <DashboardFuncionario />
          //</PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "/admin",
    children: [
      {
        index: true,
        element: (
          //<AdminRoute>
            <DashboardAdmin />
          //</AdminRoute>
        
      ),
    },
    {
        path: "/admin/relatorios",
        element: (
          //<AdminRoute>
            <RelatoriosAdmin />
          //</AdminRoute>
        ),
      },
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
