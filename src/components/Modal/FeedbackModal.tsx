import React, { useEffect, useState } from "react";
import { XCircle, CheckCircle } from "lucide-react";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  type?: "success" | "error";
  message: string;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  type = "success",
  message,
}) => {
  const [show, setShow] = useState(false);

  // Controla a animação de entrada/saída
  useEffect(() => {
    if (isOpen) setShow(true);
    else setTimeout(() => setShow(false), 200); // tempo da transição
  }, [isOpen]);

  if (!isOpen && !show) return null;

  const icon =
    type === "success" ? (
      <CheckCircle className="w-16 h-16 text-green-500" />
    ) : (
      <XCircle className="w-16 h-16 text-red-500" />
    );

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/30 transition-opacity duration-200 ${
        isOpen ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`bg-white rounded-xl shadow-xl max-w-sm w-full p-8 text-center transform transition-all duration-200 ${
          isOpen ? "scale-100 opacity-100" : "scale-90 opacity-0"
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        <div className="flex flex-col items-center gap-4">
          {icon}
          <p className="text-gray-700 text-base">{message}</p>
          <button
            onClick={onClose}
            className="mt-2 py-2 px-6 w-full bg-[var(--color-azul-primario)] text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
