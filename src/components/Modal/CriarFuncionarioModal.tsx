import React from "react";
import { XCircle } from "lucide-react";
import { formatarCPF } from "../../utils/MaskUtils";

interface CriarFuncionarioModalProps {
  aberto: boolean;
  onFechar: () => void;
  onSalvar: () => void;
  editando: boolean;
  form: { nome: string; cpf: string; cargo: string; carga_horaria: number };
  setForm: React.Dispatch<
    React.SetStateAction<{
      nome: string;
      cpf: string;
      cargo: string;
      carga_horaria: number;
    }>
  >;
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
        <button
          onClick={onFechar}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <XCircle className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          {editando ? "Editar Funcionário" : "Cadastrar Funcionário"}
        </h2>

        {erros.length > 0 && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 shadow-sm">
            <ul className="list-disc list-inside text-sm">
              {erros.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-1">
              Nome do Funcionário
            </label>
            <input
              type="text"
              placeholder="Ex: João Silva"
              value={form.nome}
              maxLength={50}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-1">
              CPF
            </label>
            <input
              type="text"
              placeholder="000.000.000-00"
              value={form.cpf}
              maxLength={14}
              onChange={(e) =>
                setForm({ ...form, cpf: formatarCPF(e.target.value) })
              }
              className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-1">
              Cargo / Função
            </label>
            <input
              type="text"
              placeholder="Ex: Operador de Máquina"
              value={form.cargo}
              maxLength={30}
              onChange={(e) => setForm({ ...form, cargo: e.target.value })}
              className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-1">
              Carga Horária Diária (em horas)
            </label>
            <input
              type="number"
              value={form.carga_horaria}
              min={1}
              max={12}
              onChange={(e) =>
                setForm({
                  ...form,
                  carga_horaria: Number(e.target.value),
                })
              }
              className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <button
            onClick={onSalvar}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 mt-2"
          >
            {editando ? "Salvar Alterações" : "Cadastrar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CriarFuncionarioModal;
