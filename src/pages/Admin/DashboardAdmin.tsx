import React, { useState } from "react";
import {
  Pencil,
  Trash,
  PlusCircle,
  Search,
  Menu, // Importado para o botão de menu mobile
} from "lucide-react";

// Importando os novos componentes
import AdminSidebar from "../../components/AdminSidebar"; 
import AdminMobileNav from "../../components/AdminMobileNav"; 

import CriarFuncionarioModal from "../../components/Modal/CriarFuncionarioModal";
import ConfirmacaoFuncionarioModal from "../../components/Modal/ConfirmacaoFuncionarioModal";
import { validarFuncionario } from "../../utils/FuncionariosValidators";

// ... (Interfaces e Lógica de Ações permanecem as mesmas)

interface Funcionario {
    id: number;
    nome: string;
    cpf: string;
    cargo: string;
    cargaHorariaDiaria: number;
}
type AcaoConfirmacao = "salvar" | "excluir" | null;

const CadastroFuncionarios: React.FC = () => {
    const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
    const [modalAberto, setModalAberto] = useState(false);
    const [confirmacaoAberta, setConfirmacaoAberta] = useState(false);
    const [mensagemConfirmacao, setMensagemConfirmacao] = useState("");
    const [editandoFuncionario, setEditandoFuncionario] =
      useState<Funcionario | null>(null);
    const [form, setForm] = useState({
      nome: "",
      cpf: "",
      cargo: "",
      cargaHorariaDiaria: 8,
    });
  
    const [erros, setErros] = useState<string[]>([]);
    const [acaoConfirmacao, setAcaoConfirmacao] = useState<AcaoConfirmacao>(null);
    const [funcionarioIdAlvo, setFuncionarioIdAlvo] = useState<number | null>(
      null
    );
    const [funcionarioAlvo, setFuncionarioAlvo] = useState<Funcionario | null>(
      null
    );
    const [termoBusca, setTermoBusca] = useState("");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Mantém o estado aqui

    // ... (Funções abrirModalCadastro, fecharModal, abrirConfirmacao, fecharConfirmacao,
    // pedirConfirmacaoSalvar, salvarFuncionario, pedirConfirmacaoExclusao, confirmarAcao)
    
    /* ---------------------------------- START: Lógica Copiada ---------------------------------- */
    const abrirModalCadastro = (func?: Funcionario) => {
        if (func) {
          setEditandoFuncionario(func);
          setForm({
            nome: func.nome,
            cpf: func.cpf,
            cargo: func.cargo,
            cargaHorariaDiaria: func.cargaHorariaDiaria,
          });
        } else {
          setEditandoFuncionario(null);
          setForm({ nome: "", cpf: "", cargo: "", cargaHorariaDiaria: 8 });
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
    /* ---------------------------------- END: Lógica Copiada ---------------------------------- */
  
    /** FILTRAGEM DE FUNCIONÁRIOS */
    const funcionariosFiltrados = funcionarios.filter(
      (f) =>
        f.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
        f.cpf.replace(/\D/g, "").includes(termoBusca.replace(/\D/g, ""))
    );
  
    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-[var(--color-fundo-claro)]">
        
        {/* HEADER MOBILE (apenas com o botão de Menu) */}
        <header className="md:hidden sticky top-0 bg-[var(--color-azul-primario)] text-white p-4 flex justify-between items-center z-20">
            <h1 className="text-xl font-bold">Cadastro de Funcionários</h1>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                <Menu className="w-6 h-6" />
            </button>
        </header>

        <div className="flex flex-1">
            {/* 1. COMPONENTE SIDEBAR */}
            <AdminSidebar 
                isMobileMenuOpen={isMobileMenuOpen}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
                currentPage="funcionarios" // Define o item ativo
            />

            {/* Conteúdo principal */}
            <main className="flex-1 p-6 md:p-8 pb-20 md:pb-8">
                <h1 className="hidden md:block text-3xl font-bold mb-6">Funcionários</h1>

                <button
                    onClick={() => abrirModalCadastro()}
                    className="flex items-center gap-2 mb-6 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md w-full justify-center md:w-auto"
                >
                    <PlusCircle className="w-5 h-5" />
                    Adicionar Funcionário
                </button>

                <div className="bg-white rounded-xl shadow-md p-4 md:p-6 overflow-x-auto">
                    {/* Barra de pesquisa */}
                    <div className="mb-4 relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                            <Search className="w-5 h-5" />
                        </span>
                        <input
                            type="text"
                            placeholder="Pesquisar por nome ou CPF..."
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
                    ) : funcionariosFiltrados.length === 0 ? (
                        <p className="text-gray-500 text-center py-6">
                            Nenhum funcionário encontrado com o termo de busca.
                        </p>
                    ) : (
                        <>
                            {/* TABELA - Desktop/Tablet */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="min-w-full text-left border-collapse text-sm">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="py-2 px-4">Nome</th>
                                            <th className="py-2 px-4 whitespace-nowrap">CPF</th>
                                            <th className="py-2 px-4">Cargo</th>
                                            <th className="py-2 px-4 whitespace-nowrap">Carga Horária</th>
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
                                                <td className="py-2 px-4 whitespace-nowrap">{f.cpf}</td>
                                                <td className="py-2 px-4">{f.cargo}</td>
                                                <td className="py-2 px-4 whitespace-nowrap">
                                                    {f.cargaHorariaDiaria}h/dia
                                                </td>
                                                <td className="py-2 px-4 flex gap-2">
                                                    <button
                                                        onClick={() => abrirModalCadastro(f)}
                                                        className="text-blue-600 hover:text-blue-800 p-1"
                                                    >
                                                        <Pencil className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => pedirConfirmacaoExclusao(f.id)}
                                                        className="text-red-600 hover:text-red-800 p-1"
                                                    >
                                                        <Trash className="w-5 h-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* LISTA DE CARDS - Mobile */}
                            <div className="md:hidden space-y-3">
                                {funcionariosFiltrados.map((f) => (
                                    <div
                                        key={f.id}
                                        className="border border-gray-200 p-3 rounded-lg shadow-sm bg-gray-50"
                                    >
                                        <div className="flex justify-between items-center mb-1">
                                            <strong className="text-lg text-gray-800">{f.nome}</strong>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => abrirModalCadastro(f)}
                                                    className="text-blue-600 hover:text-blue-800 p-1"
                                                    aria-label={`Editar ${f.nome}`}
                                                >
                                                    <Pencil className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => pedirConfirmacaoExclusao(f.id)}
                                                    className="text-red-600 hover:text-red-800 p-1"
                                                    aria-label={`Excluir ${f.nome}`}
                                                >
                                                    <Trash className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            <span className="font-semibold">CPF:</span> {f.cpf}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <span className="font-semibold">Cargo:</span> {f.cargo}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <span className="font-semibold">Carga Horária:</span>{" "}
                                            {f.cargaHorariaDiaria}h/dia
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </main>

            {/* 2. COMPONENTE MOBILE NAV */}
            <AdminMobileNav currentPage="funcionarios" />
        </div>

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
                        cargaHorariaDiaria: funcionarioAlvo.cargaHorariaDiaria,
                    }
                    : undefined
            }
            onFechar={fecharConfirmacao}
            onConfirmar={confirmarAcao}
            mostrarConfirmar={!!acaoConfirmacao}
        />
    </div>
    );
};

export default CadastroFuncionarios;