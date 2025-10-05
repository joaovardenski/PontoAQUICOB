import { createBrowserRouter, RouterProvider } from "react-router-dom";

// 🔐 Autenticação
import Login from "../pages/Auth/Login";
// import RecoverPassword from "../pages/Auth/RecoverPassword"; // COMENTADO

// 🧍 Funcionário
// import DashboardFuncionario from "../pages/Funcionario/DashboardFuncionario"; // COMENTADO
// import HistoricoFuncionario from "../pages/Funcionario/HistoricoFuncionario"; // COMENTADO
// import PerfilFuncionario from "../pages/Funcionario/PerfilFuncionario"; // COMENTADO

// 👨‍💼 Administrador
// import DashboardAdmin from "../pages/Admin/DashboardAdmin"; // COMENTADO
// import FuncionariosAdmin from "../pages/Admin/FuncionariosAdmin"; // COMENTADO
// import RelatoriosAdmin from "../pages/Admin/RelatoriosAdmin"; // COMENTADO

// ⚙️ Rotas de segurança
// import PrivateRoute from "../routes/PrivateRoute"; // COMENTADO
// import AdminRoute from "../routes/AdminRoute"; // COMENTADO

// 🚫 Páginas de erro
// import Unauthorized from "../pages/Error/Unauthorized"; // COMENTADO
// import NotAuthenticated from "../pages/Error/NotAuthenticated"; // COMENTADO
// import NotFound from "../pages/Error/NotFound"; // COMENTADO

const router = createBrowserRouter([
  // Página inicial → Login
  {
    path: "/",
    element: <Login />, // Esta é a rota que funciona!
  },

  /*
  // Recuperação de senha (COMENTADO PARA EVITAR ERRO DE REFERÊNCIA)
  {
    path: "/recuperar-senha",
    element: <RecoverPassword />, 
  },
  // ===========================
  // ÁREA DO FUNCIONÁRIO (COMENTADO)
  // ===========================
  {
    path: "/funcionario",
    children: [
      {
        index: true,
        element: (
          <PrivateRoute>
            <DashboardFuncionario />
          </PrivateRoute>
        ),
      },
      {
        path: "/funcionario/historico",
        element: (
          <PrivateRoute>
            <HistoricoFuncionario />
          </PrivateRoute>
        ),
      },
      {
        path: "/funcionario/perfil",
        element: (
          <PrivateRoute>
            <PerfilFuncionario />
          </PrivateRoute>
        ),
      },
    ],
  },
  // ===========================
  // ÁREA ADMINISTRATIVA (COMENTADO)
  // ===========================
  {
    path: "/admin",
    children: [
      {
        index: true,
        element: (
          <AdminRoute>
            <DashboardAdmin />
          </AdminRoute>
        ),
      },
      {
        path: "/admin/funcionarios",
        element: (
          <AdminRoute>
            <FuncionariosAdmin />
          </AdminRoute>
        ),
      },
      {
        path: "/admin/relatorios",
        element: (
          <AdminRoute>
            <RelatoriosAdmin />
          </AdminRoute>
        ),
      },
    ],
  },
  // ===========================
  // PÁGINAS DE ERRO (COMENTADO)
  // ===========================
  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },
  {
    path: "/not-authenticated",
    element: <NotAuthenticated />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
  */
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
