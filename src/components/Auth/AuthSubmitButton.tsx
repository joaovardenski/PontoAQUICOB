import React from "react";
import { Loader2 } from "lucide-react"; // ícone de loading

interface AuthSubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

const AuthSubmitButton: React.FC<AuthSubmitButtonProps> = ({ children, loading = false, ...props }) => {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className="w-full flex justify-center items-center py-2 px-4 border border-transparent 
                 rounded-md shadow-sm text-sm font-medium text-white 
                 bg-[var(--color-azul-primario)] hover:bg-blue-900
                 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-azul-primario)]
                 transition duration-150 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {loading ? (
        <>
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          Entrando...
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default AuthSubmitButton;
