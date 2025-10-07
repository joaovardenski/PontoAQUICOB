import React, { useState, useEffect } from "react";
import { PlusCircle, Search, Menu } from "lucide-react";

// Componentes
import FuncionariosTable from "../../components/Funcionario/FuncionariosTable";
import FuncionariosCardList from "../../components/Funcionario/FuncionariosCardList";
import AdminSidebar from "../../components/Admin/AdminSideBar";
import AdminMobileNav from "../../components/Admin/AdminMobileNav";
import CriarFuncionarioModal from "../../components/Modal/CriarFuncionarioModal";
import ConfirmacaoFuncionarioModal from "../../components/Modal/ConfirmacaoFuncionarioModal";

// API
import {
  getFuncionarios,
  createFuncionario,
  updateFuncionario,
  deleteFuncionario,
} from "../../api/funcionariosApi";

// Validação
import { validarFuncionario } from "../../utils/FuncionariosValidators";

export interface Funcionario {
  id: number;
  nome: string;
  cpf: string;
  cargo: string;
  carga_horaria: number;
  senha_inicial?: string;
}

type ConfirmationAction = "save" | "delete" | null;

const CadastroFuncionarios: React.FC = () => {
  /** ---------- Estados ---------- */
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [selectedFuncionario, setSelectedFuncionario] = useState<Funcionario | null>(null);

  const [isCadastroModalOpen, setIsCadastroModalOpen] = useState(false);
  const [isConfirmacaoModalOpen, setIsConfirmacaoModalOpen] = useState(false);

  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [confirmationAction, setConfirmationAction] = useState<ConfirmationAction>(null);

  const [form, setForm] = useState({
    nome: "",
    cpf: "",
    cargo: "",
    carga_horaria: 8,
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  /** ---------- Efeitos ---------- */
  useEffect(() => {
    carregarFuncionarios();
  }, []);

  const carregarFuncionarios = async () => {
    try {
      const data = await getFuncionarios();
      setFuncionarios(data);
    } catch (error) {
      console.error("Erro ao carregar funcionários:", error);
    }
  };

  /** ---------- Utilitários ---------- */
  const limparCpf = (cpf: string) => cpf.replace(/\D/g, "");

  const cpfDuplicado = (cpf: string, id?: number) =>
    funcionarios.some((f) => limparCpf(f.cpf) === limparCpf(cpf) && f.id !== id);

  const funcionariosFiltrados = funcionarios.filter((f) => {
    const termo = searchTerm.toLowerCase().trim();
    if (!termo) return true;

    const apenasNumeros = termo.replace(/\D/g, "");
    return (
      f.nome.toLowerCase().includes(termo) ||
      (apenasNumeros.length > 0 && f.cpf.replace(/\D/g, "").includes(apenasNumeros))
    );
  });

  /** ---------- Modais ---------- */
  const abrirCadastroModal = (func?: Funcionario) => {
    if (func) {
      setSelectedFuncionario(func);
      setForm({
        nome: func.nome,
        cpf: func.cpf,
        cargo: func.cargo,
        carga_horaria: func.carga_horaria,
      });
    } else {
      setSelectedFuncionario(null);
      setForm({ nome: "", cpf: "", cargo: "", carga_horaria: 8 });
    }
    setErrors([]);
    setIsCadastroModalOpen(true);
  };

  const fecharCadastroModal = () => {
    setIsCadastroModalOpen(false);
    setSelectedFuncionario(null);
    setErrors([]);
  };

  const abrirConfirmacaoModal = (
    mensagem: string,
    action: ConfirmationAction,
    func?: Funcionario
  ) => {
    setConfirmationMessage(mensagem);
    setConfirmationAction(action);
    if (func) setSelectedFuncionario(func);
    setIsConfirmacaoModalOpen(true);
  };

  const fecharConfirmacaoModal = () => {
    setIsConfirmacaoModalOpen(false);
    setConfirmationMessage("");
    setConfirmationAction(null);
    setSelectedFuncionario(null);
  };

  /** ---------- Ações ---------- */
  const solicitarSalvarFuncionario = () => {
    const validationErrors = validarFuncionario(form);

    if (cpfDuplicado(form.cpf, selectedFuncionario?.id)) {
      validationErrors.push("Já existe um funcionário com este CPF.");
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    const funcToSave: Funcionario | null = selectedFuncionario
      ? { ...selectedFuncionario, ...form }
      : null;

    setSelectedFuncionario(funcToSave);

    abrirConfirmacaoModal(
      selectedFuncionario
        ? "Deseja realmente alterar este funcionário?"
        : "Deseja realmente cadastrar este funcionário?",
      "save",
      funcToSave ?? undefined
    );
  };

  const salvarFuncionario = async () => {
    if (!selectedFuncionario) {
      await criarFuncionario();
    } else {
      await editarFuncionario();
    }
    fecharCadastroModal();
  };

  const criarFuncionario = async () => {
    try {
      const response = await createFuncionario(form);

      const novoFuncionario: Funcionario = {
        ...response.usuario,
        senha_inicial: response.senha_inicial,
      };

      setFuncionarios((prev) => [novoFuncionario, ...prev]);
      abrirConfirmacaoModal("Funcionário cadastrado com sucesso!", null);
    } catch (error) {
      console.error("Erro ao criar funcionário:", error);
      abrirConfirmacaoModal("Erro ao criar funcionário!", null);
    }
  };

  const editarFuncionario = async () => {
    try {
      await updateFuncionario(selectedFuncionario!.id, {
        ...form,
        cpf: limparCpf(form.cpf),
      });

      setFuncionarios((prev) =>
        prev.map((f) => (f.id === selectedFuncionario!.id ? { ...f, ...form } : f))
      );
      abrirConfirmacaoModal("Funcionário alterado com sucesso!", null);
    } catch (error) {
      console.error("Erro ao atualizar funcionário:", error);
      abrirConfirmacaoModal("Erro ao atualizar funcionário!", null);
    }
  };

  const solicitarExcluirFuncionario = (func: Funcionario) => {
    abrirConfirmacaoModal("Tem certeza que deseja excluir este funcionário?", "delete", func);
  };

  const confirmarAcao = async () => {
    if (confirmationAction === "save") {
      await salvarFuncionario();
    } else if (confirmationAction === "delete" && selectedFuncionario) {
      await excluirFuncionario();
    }
    fecharConfirmacaoModal();
  };

  const excluirFuncionario = async () => {
    try {
      await deleteFuncionario(selectedFuncionario!.id);
      abrirConfirmacaoModal("Funcionário excluído com sucesso!", null);
      await carregarFuncionarios();
    } catch (error) {
      console.error("Erro ao excluir funcionário:", error);
      abrirConfirmacaoModal("Erro ao excluir funcionário!", null);
    }
  };

  /** ---------- Render ---------- */
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[var(--color-fundo-claro)]">
      {/* Header Mobile */}
      <header className="md:hidden sticky top-0 bg-[var(--color-azul-primario)] text-white p-4 flex justify-between items-center z-20">
        <h1 className="text-xl font-bold">Cadastro de Funcionários</h1>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {/* Sidebar */}
      <AdminSidebar
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        currentPage="funcionarios"
      />

      {/* Conteúdo Principal */}
      <div className="flex flex-1">
        <main className="flex-1 p-6 md:p-8 pb-20 md:pb-8">
          <h1 className="hidden md:block text-3xl font-bold mb-6">Funcionários</h1>

          <button
            onClick={() => abrirCadastroModal()}
            className="flex items-center gap-2 mb-6 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md w-full justify-center md:w-auto"
          >
            <PlusCircle className="w-5 h-5" />
            Adicionar Funcionário
          </button>

          <div className="bg-white rounded-xl shadow-md p-4 md:p-6 overflow-x-auto">
            <div className="mb-4 relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <Search className="w-5 h-5" />
              </span>
              <input
                type="text"
                placeholder="Pesquisar por nome ou CPF..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 rounded-xl px-10 py-2 w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder-gray-400"
              />
            </div>

            {funcionarios.length === 0 ? (
              <p className="text-gray-500 text-center py-6">Nenhum funcionário cadastrado.</p>
            ) : funcionariosFiltrados.length === 0 ? (
              <p className="text-gray-500 text-center py-6">Nenhum funcionário encontrado.</p>
            ) : (
              <>
                <FuncionariosTable
                  funcionarios={funcionariosFiltrados}
                  onEdit={abrirCadastroModal}
                  onDelete={solicitarExcluirFuncionario}
                />
                <FuncionariosCardList
                  funcionarios={funcionariosFiltrados}
                  onEdit={abrirCadastroModal}
                  onDelete={solicitarExcluirFuncionario}
                />
              </>
            )}
          </div>
        </main>

        <AdminMobileNav currentPage="funcionarios" />
      </div>

      {/* Modais */}
      <CriarFuncionarioModal
        aberto={isCadastroModalOpen}
        onFechar={fecharCadastroModal}
        onSalvar={solicitarSalvarFuncionario}
        editando={!!selectedFuncionario}
        form={form}
        setForm={setForm}
        erros={errors}
      />

      <ConfirmacaoFuncionarioModal
        aberto={isConfirmacaoModalOpen}
        mensagem={confirmationMessage}
        funcionario={
          selectedFuncionario
            ? {
                nome: selectedFuncionario.nome,
                cpf: selectedFuncionario.cpf,
                cargo: selectedFuncionario.cargo,
                carga_horaria: selectedFuncionario.carga_horaria,
              }
            : undefined
        }
        onFechar={fecharConfirmacaoModal}
        onConfirmar={confirmarAcao}
        mostrarConfirmar={!!confirmationAction}
      />
    </div>
  );
};

export default CadastroFuncionarios;
