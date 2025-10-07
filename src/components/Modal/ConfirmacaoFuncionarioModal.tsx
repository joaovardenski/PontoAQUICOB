import React from "react";

interface FuncionarioInfo {
  nome: string;
  cpf: string;
  cargo: string;
  carga_horaria: number;
}

interface ConfirmacaoFuncionarioModalProps {
  aberto: boolean;
  mensagem: string;
  funcionario?: FuncionarioInfo; // info do funcionário afetado
  onFechar: () => void;
  onConfirmar?: () => void;
  mostrarConfirmar?: boolean; // se true mostra botão confirmar
}

const ConfirmacaoFuncionarioModal: React.FC<
  ConfirmacaoFuncionarioModalProps
> = ({
  aberto,
  mensagem,
  funcionario,
  onFechar,
  onConfirmar,
  mostrarConfirmar = false,
}) => {
  if (!aberto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full flex flex-col items-center">
        {/* Mensagem principal */}
        <p className="text-gray-800 text-center mb-4 font-medium">{mensagem}</p>

        {/* Informações do funcionário, se fornecidas */}
        {funcionario && (
          <div className="w-full bg-gray-100 rounded-lg p-4 mb-4 text-gray-700 text-sm">
            <p>
              <strong>Nome:</strong> {funcionario.nome}
            </p>
            <p>
              <strong>CPF:</strong> {funcionario.cpf}
            </p>
            <p>
              <strong>Cargo:</strong> {funcionario.cargo}
            </p>
            <p>
              <strong>Carga Horária:</strong> {funcionario.carga_horaria}h/dia
            </p>
          </div>
        )}

        {/* Botões */}
        <div className="flex gap-4 w-full justify-center">
          {mostrarConfirmar && (
            <button
              onClick={onConfirmar}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition"
            >
              Confirmar
            </button>
          )}
          <button
            onClick={onFechar}
            className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-lg font-semibold transition"
          >
            {mostrarConfirmar ? "Cancelar" : "Fechar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmacaoFuncionarioModal;
