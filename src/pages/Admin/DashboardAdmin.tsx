import React, { useState } from "react";
import { Pencil, Trash, PlusCircle, XCircle } from "lucide-react";

interface Funcionario {
  id: number;
  nome: string;
  cpf: string;
  cargo: string;
}

const DashboardAdmin: React.FC = () => {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [editandoFuncionario, setEditandoFuncionario] = useState<Funcionario | null>(null);
  const [form, setForm] = useState({ nome: "", cpf: "", cargo: "" });

  const abrirModalCadastro = (func?: Funcionario) => {
    if (func) {
      setEditandoFuncionario(func);
      setForm({ nome: func.nome, cpf: func.cpf, cargo: func.cargo });
    } else {
      setEditandoFuncionario(null);
      setForm({ nome: "", cpf: "", cargo: "" });
    }
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setEditandoFuncionario(null);
  };

  const salvarFuncionario = () => {
    if (!form.nome || !form.cpf || !form.cargo) return;

    if (editandoFuncionario) {
      setFuncionarios((prev) =>
        prev.map((f) =>
          f.id === editandoFuncionario.id ? { ...f, ...form } : f
        )
      );
    } else {
      setFuncionarios((prev) => [
        ...prev,
        { id: Date.now(), ...form },
      ]);
    }
    fecharModal();
  };

  const excluirFuncionario = (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir este funcionário?")) {
      setFuncionarios((prev) => prev.filter((f) => f.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-fundo-claro)] p-6 sm:p-10">
      <h1 className="text-3xl font-bold mb-6">Dashboard do Admin</h1>

      {/* Botão de adicionar funcionário */}
      <button
        onClick={() => abrirModalCadastro()}
        className="flex items-center gap-2 mb-6 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md"
      >
        <PlusCircle className="w-5 h-5" />
        Adicionar Funcionário
      </button>

      {/* Lista de funcionários */}
      <div className="bg-white rounded-xl shadow-md p-6">
        {funcionarios.length === 0 ? (
          <p className="text-gray-500 text-center py-6">
            Nenhum funcionário cadastrado.
          </p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-2 px-4">Nome</th>
                <th className="py-2 px-4">CPF</th>
                <th className="py-2 px-4">Cargo</th>
                <th className="py-2 px-4">Ações</th>
              </tr>
            </thead>
            <tbody>
              {funcionarios.map((f) => (
                <tr key={f.id} className="border-b hover:bg-gray-50 transition">
                  <td className="py-2 px-4">{f.nome}</td>
                  <td className="py-2 px-4">{f.cpf}</td>
                  <td className="py-2 px-4">{f.cargo}</td>
                  <td className="py-2 px-4 flex gap-2">
                    <button
                      onClick={() => abrirModalCadastro(f)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => excluirFuncionario(f.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal de cadastro */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full relative">
            <button
              onClick={fecharModal}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <XCircle className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-semibold mb-4">
              {editandoFuncionario ? "Editar Funcionário" : "Cadastrar Funcionário"}
            </h2>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Nome"
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                className="border rounded-md px-3 py-2 w-full"
              />
              <input
                type="text"
                placeholder="CPF"
                value={form.cpf}
                onChange={(e) => setForm({ ...form, cpf: e.target.value })}
                className="border rounded-md px-3 py-2 w-full"
              />
              <input
                type="text"
                placeholder="Cargo/Função"
                value={form.cargo}
                onChange={(e) => setForm({ ...form, cargo: e.target.value })}
                className="border rounded-md px-3 py-2 w-full"
              />
              <button
                onClick={salvarFuncionario}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
              >
                {editandoFuncionario ? "Salvar Alterações" : "Cadastrar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardAdmin;
