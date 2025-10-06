import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Pencil,
  Trash,
  PlusCircle,
  UserCog,
  Search,
  Library,
  LogOut,
} from "lucide-react";
import AquicobLogo from "../../assets/AquicobLogo.png";
import CriarFuncionarioModal from "../../components/Modal/CriarFuncionarioModal";
import ConfirmacaoFuncionarioModal from "../../components/Modal/ConfirmacaoFuncionarioModal";
import { validarFuncionario } from "../../utils/FuncionariosValidators";

interface Funcionario {
  id: number;
  nome: string;
  cpf: string;
  cargo: string;
}

type AcaoConfirmacao = "salvar" | "excluir" | null;

const CadastroFuncionarios: React.FC = () => {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [confirmacaoAberta, setConfirmacaoAberta] = useState(false);
  const [mensagemConfirmacao, setMensagemConfirmacao] = useState("");
  const [editandoFuncionario, setEditandoFuncionario] =
    useState<Funcionario | null>(null);
  const [form, setForm] = useState({ nome: "", cpf: "", cargo: "" });
  const [erros, setErros] = useState<string[]>([]);
  const [acaoConfirmacao, setAcaoConfirmacao] = useState<AcaoConfirmacao>(null);
  const [funcionarioIdAlvo, setFuncionarioIdAlvo] = useState<number | null>(
    null
  );
  const [funcionarioAlvo, setFuncionarioAlvo] = useState<Funcionario | null>(
    null
  );
  const [termoBusca, setTermoBusca] = useState("");
  const navigate = useNavigate();

  /** MODAIS */
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
    setErros([]);
  };

  const abrirConfirmacao = (
    mensagem: string,
    acao: AcaoConfirmacao,
    idAlvo?: number
  ) => {
    setMensagemConfirmacao(mensagem);
    setAcaoConfirmacao(acao);
    if (idAlvo !== undefined) setFuncionarioIdAlvo(idAlvo);
    setConfirmacaoAberta(true);
  };

  const fecharConfirmacao = () => {
    setConfirmacaoAberta(false);
    setMensagemConfirmacao("");
    setAcaoConfirmacao(null);
    setFuncionarioIdAlvo(null);
  };

  /** AÇÕES */
  const pedirConfirmacaoSalvar = () => {
    const novosErros = validarFuncionario(form);

    const cpfFormatado = form.cpf.replace(/\D/g, "");
    const cpfJaExiste = funcionarios.some(
      (f) =>
        f.cpf.replace(/\D/g, "") === cpfFormatado &&
        f.id !== editandoFuncionario?.id
    );
    if (cpfJaExiste) novosErros.push("Já existe um funcionário com este CPF.");

    if (novosErros.length > 0) {
      setErros(novosErros);
      return;
    }

    setFuncionarioAlvo(
      editandoFuncionario ? editandoFuncionario : { id: 0, ...form }
    );
    abrirConfirmacao(
      editandoFuncionario
        ? "Deseja realmente alterar este funcionário?"
        : "Deseja realmente cadastrar este funcionário?",
      "salvar"
    );
  };

  const salvarFuncionario = () => {
    if (editandoFuncionario) {
      setFuncionarios((prev) =>
        prev.map((f) =>
          f.id === editandoFuncionario.id ? { ...f, ...form } : f
        )
      );
      fecharModal();
      abrirConfirmacao("Funcionário alterado com sucesso!", null);
    } else {
      setFuncionarios((prev) => [...prev, { id: Date.now(), ...form }]);
      fecharModal();
      abrirConfirmacao("Funcionário cadastrado com sucesso!", null);
    }
    setErros([]);
  };

  const pedirConfirmacaoExclusao = (id: number) => {
    const func = funcionarios.find((f) => f.id === id);
    if (!func) return;
    setFuncionarioAlvo(func);
    abrirConfirmacao(
      "Tem certeza que deseja excluir este funcionário?",
      "excluir",
      id
    );
  };

  const confirmarAcao = () => {
    if (acaoConfirmacao === "salvar") {
      salvarFuncionario();
    } else if (acaoConfirmacao === "excluir" && funcionarioIdAlvo !== null) {
      setFuncionarios((prev) => prev.filter((f) => f.id !== funcionarioIdAlvo));
      abrirConfirmacao("Funcionário excluído com sucesso!", null);
    }
    fecharConfirmacao();
  };

  /** FILTRAGEM DE FUNCIONÁRIOS */
  const funcionariosFiltrados = funcionarios.filter((f) =>
    f.nome.toLowerCase().includes(termoBusca.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[var(--color-fundo-claro)]">
      {/* Menu lateral */}
      {/* Menu lateral */}
      <aside className="w-64 bg-[var(--color-azul-primario)] text-white flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-center p-6">
            <img
              src={AquicobLogo}
              alt="AQUICOB"
              className="h-20 w-auto rounded-lg bg-white p-2"
            />
          </div>
          <nav className="flex flex-col mt-6">
            {/* Funcionários */}
            <button
            onClick={() => navigate("/admin")}
            className="flex items-center gap-3 px-6 py-3 text-md font-semibold bg-blue-900 rounded-lg mb-2 hover:bg-blue-800 transition">
              <UserCog className="w-6 h-6" />
              Funcionários
            </button>

            {/* Relatórios */}
            <button
              onClick={() => navigate("/admin/relatorios")} // ou use router se estiver usando Next.js/React Router
              className="flex items-center gap-3 px-6 py-3 text-md font-semibold rounded-lg mb-2 hover:bg-blue-800 transition"
            >
              <Library className="w-6 h-6" />
              Relatórios
            </button>
          </nav>
        </div>

        <div className="p-6">
          <button
            onClick={() => {
              navigate("/");
            }}
            className="flex items-center justify-center w-full gap-3 px-6 py-3 text-md font-semibold rounded-lg bg-red-600 hover:bg-red-700 transition"
          >
            <LogOut className="w-6 h-6 rotate-180" /> Sair
          </button>
        </div>
      </aside>

      {/* Conteúdo principal */}
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">Funcionários</h1>

        <button
          onClick={() => abrirModalCadastro()}
          className="flex items-center gap-2 mb-6 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md"
        >
          <PlusCircle className="w-5 h-5" />
          Adicionar Funcionário
        </button>

        <div className="bg-white rounded-xl shadow-md p-6">
          {/* Barra de pesquisa */}
          {/* Barra de pesquisa */}
          <div className="mb-4 relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <Search className="w-5 h-5" />
            </span>
            <input
              type="text"
              placeholder="Pesquisar por nome..."
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              className="
      border border-gray-300 
      rounded-xl 
      px-10 py-2 
      w-full 
      shadow-sm 
      focus:outline-none 
      focus:ring-2 
      focus:ring-blue-500 
      focus:border-blue-500 
      transition 
      placeholder-gray-400
    "
            />
          </div>

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
                {funcionariosFiltrados.map((f) => (
                  <tr
                    key={f.id}
                    className="border-b hover:bg-gray-50 transition"
                  >
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
                        onClick={() => pedirConfirmacaoExclusao(f.id)}
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
      </main>

      <CriarFuncionarioModal
        aberto={modalAberto}
        onFechar={fecharModal}
        onSalvar={pedirConfirmacaoSalvar}
        editando={!!editandoFuncionario}
        form={form}
        setForm={setForm}
        erros={erros}
      />

      <ConfirmacaoFuncionarioModal
        aberto={confirmacaoAberta}
        mensagem={mensagemConfirmacao}
        funcionario={
          funcionarioAlvo
            ? {
                nome: funcionarioAlvo.nome,
                cpf: funcionarioAlvo.cpf,
                cargo: funcionarioAlvo.cargo,
              }
            : undefined
        }
        onFechar={fecharConfirmacao}
        onConfirmar={confirmarAcao}
        mostrarConfirmar={!!acaoConfirmacao} // mostra Confirmar apenas se for ação real
      />
    </div>
  );
};

export default CadastroFuncionarios;
