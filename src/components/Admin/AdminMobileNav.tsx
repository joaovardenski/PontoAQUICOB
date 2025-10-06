import React from 'react';
import { UserCog, Library, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AdminMobileNavProps {
  currentPage: 'funcionarios' | 'relatorios';
}

const AdminMobileNav: React.FC<AdminMobileNavProps> = ({ currentPage }) => {
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[var(--color-azul-primario)] text-white flex justify-around py-2 md:hidden shadow-lg z-20">
      <button
        onClick={() => navigate('/admin')}
        className={`flex flex-col items-center text-xs p-1 ${
          currentPage === 'funcionarios' ? 'text-blue-200' : 'opacity-70'
        }`}
      >
        <UserCog className="w-5 h-5 mb-1" /> Funcionários
      </button>
      <button
        onClick={() => navigate('/admin/relatorios')}
        className={`flex flex-col items-center text-xs p-1 ${
          currentPage === 'relatorios' ? 'text-blue-200' : 'opacity-70'
        }`}
      >
        <Library className="w-5 h-5 mb-1" /> Relatórios
      </button>
      <button
        onClick={() => navigate('/')}
        className="flex flex-col items-center text-xs text-red-300 p-1"
      >
        <LogOut className="w-5 h-5 mb-1 rotate-180" /> Sair
      </button>
    </nav>
  );
};

export default AdminMobileNav;