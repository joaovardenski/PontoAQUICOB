import React from "react";
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
  if (!isOpen) return null;

  const icon =
    type === "success" ? (
      <CheckCircle className="w-12 h-12 text-green-500" />
    ) : (
      <XCircle className="w-12 h-12 text-red-500" />
    );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-lg shadow-xl p-10 max-w-sm w-full text-center relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
        <div className="flex flex-col items-center gap-4">
          {icon}
          <p className="text-gray-700">{message}</p>
          <button
            onClick={onClose}
            className="mt-2 py-1 px-4 w-full bg-[var(--color-azul-primario)] text-white rounded-md hover:bg-blue-700"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
