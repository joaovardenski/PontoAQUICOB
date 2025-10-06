import React from 'react';
import { UserCog, Library, LogOut} from 'lucide-react';
import AquicobLogo from '../assets/AquicobLogo.png';
import { useNavigate } from 'react-router-dom';

interface AdminSidebarProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
  currentPage: 'funcionarios' | 'relatorios';
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  currentPage,
}) => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false); // Fecha o menu no mobile após navegar
  };

  return (
    <>
      {/* Fundo escuro para o menu mobile (Overlay) */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 md:hidden z-20"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar (Desktop e Mobile Drawer) */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-[var(--color-azul-primario)] text-white flex-col justify-between transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:relative md:flex`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center p-6">
            <img
              src={AquicobLogo}
              alt="AQUICOB"
              className="h-20 w-auto rounded-lg bg-white p-2"
            />
          </div>
          <nav className="flex flex-col mt-6 flex-grow">
            {/* Funcionários */}
            <button
              onClick={() => handleNavigation('/admin')}
              className={`flex items-center gap-3 px-6 py-3 text-md font-semibold rounded-lg mb-2 hover:bg-blue-800 transition ${
                currentPage === 'funcionarios' ? 'bg-blue-900' : ''
              }`}
            >
              <UserCog className="w-6 h-6" />
              Funcionários
            </button>

            {/* Relatórios */}
            <button
              onClick={() => handleNavigation('/admin/relatorios')}
              className={`flex items-center gap-3 px-6 py-3 text-md font-semibold rounded-lg mb-2 hover:bg-blue-800 transition ${
                currentPage === 'relatorios' ? 'bg-blue-900' : ''
              }`}
            >
              <Library className="w-6 h-6" />
              Relatórios
            </button>
          </nav>

          <div className="p-6 mt-auto">
            <button
              onClick={() => navigate('/')}
              className="flex items-center justify-center w-full gap-3 px-6 py-3 text-md font-semibold rounded-lg bg-red-600 hover:bg-red-700 transition"
            >
              <LogOut className="w-6 h-6 rotate-180" /> Sair
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;