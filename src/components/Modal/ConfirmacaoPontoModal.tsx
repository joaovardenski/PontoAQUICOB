import React from "react";
import { CheckCircle, XCircle, Coffee } from "lucide-react";

interface ModalConfirmacaoPontoProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
  tipo?: "Entrada" | "Saida" | "Pausa" | null;
}

const ModalConfirmacaoPonto: React.FC<ModalConfirmacaoPontoProps> = ({
  isOpen,
  onClose,
  onConfirm,
  message,
  tipo,
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (tipo) {
      case "Entrada":
        return <CheckCircle className="w-14 h-14 text-green-600 mb-3" />;
      case "Pausa":
        return <Coffee className="w-14 h-14 text-yellow-500 mb-3" />;
      case "Saida":
        return <XCircle className="w-14 h-14 text-red-600 mb-3" />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 w-[90%] max-w-sm text-center animate-fade-in">
        <div className="flex justify-center">{getIcon()}</div>

        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-6">
          {message}
        </h2>

        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-800 font-medium transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className={`px-5 py-2 rounded-lg font-medium text-white transition-all ${
              tipo === "Entrada"
                ? "bg-green-600 hover:bg-green-700"
                : tipo === "Pausa"
                ? "bg-yellow-500 hover:bg-yellow-600"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmacaoPonto;
