import React from "react";
import { XCircle } from "lucide-react";
import { formatarCPF } from "../../utils/MaskUtils";

interface CriarFuncionarioModalProps {
  aberto: boolean;
  onFechar: () => void;
  onSalvar: () => void;
  editando: boolean;
  form: { nome: string; cpf: string; cargo: string };
  setForm: React.Dispatch<React.SetStateAction<{ nome: string; cpf: string; cargo: string }>>;
  erros: string[];
}

const CriarFuncionarioModal: React.FC<CriarFuncionarioModalProps> = ({
  aberto,
  onFechar,
  onSalvar,
  editando,
  form,
  setForm,
  erros,
}) => {
  if (!aberto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 ">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full relative animate-fadeIn">
        {/* Botão fechar */}
        <button
          onClick={onFechar}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <XCircle className="w-6 h-6" />
        </button>

        <div>
          
        </div>

        {/* Título */}
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          {editando ? "Editar Funcionário" : "Cadastrar Funcionário"}
        </h2>

        {/* Mensagens de erro */}
        {erros.length > 0 && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 shadow-sm">
            <ul className="list-disc list-inside text-sm">
              {erros.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Formulário */}
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Nome"
            value={form.nome}
            maxLength={50}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <input
            type="text"
            placeholder="CPF"
            value={form.cpf}
            maxLength={14}
            onChange={(e) => setForm({ ...form, cpf: formatarCPF(e.target.value)})}
            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <input
            type="text"
            placeholder="Cargo/Função"
            value={form.cargo}
            maxLength={30}
            onChange={(e) => setForm({ ...form, cargo: e.target.value })}
            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />

          {/* Botão salvar */}
          <button
            onClick={onSalvar}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
          >
            {editando ? "Salvar Alterações" : "Cadastrar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CriarFuncionarioModal;
