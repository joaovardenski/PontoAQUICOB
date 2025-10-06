import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserCog, Library, LogOut, Menu } from "lucide-react";
import AquicobLogo from "../../assets/aquicobLogo.png";

import type { DiaMarcacoes, Funcionario, Marcacao } from "../../types";
import { gerarRelatorio } from "../../utils/RelatorioUtils";
import RelatorioFilters from "../../components/Relatorio/RelatorioFilters";
import RelatorioTable from "../../components/Relatorio/RelatorioTable";
import RelatorioCards from "../../components/Relatorio/RelatorioCards";
import FeedbackModal from "../../components/Modal/FeedbackModal";

const RelatoriosAdmin: React.FC = () => {
  const navigate = useNavigate();

  const [funcionarios] = useState<Funcionario[]>([
    { id: 1, nome: "João", cargaHorariaDiaria: 8 },
    { id: 2, nome: "Maria", cargaHorariaDiaria: 6 },
    { id: 3, nome: "Pedro", cargaHorariaDiaria: 8 },
  ]);

  const [batidas] = useState<Marcacao[]>([
    { id: 1, funcionarioId: 1, data: "2025-10-02", hora: "08:59", tipo: "E" },
    { id: 2, funcionarioId: 1, data: "2025-10-02", hora: "12:03", tipo: "P" },
    { id: 3, funcionarioId: 1, data: "2025-10-02", hora: "13:01", tipo: "E" },
    { id: 4, funcionarioId: 1, data: "2025-10-02", hora: "17:04", tipo: "S" },
    { id: 5, funcionarioId: 2, data: "2025-10-02", hora: "09:10", tipo: "E" },
    { id: 6, funcionarioId: 2, data: "2025-10-02", hora: "12:05", tipo: "P" },
    { id: 7, funcionarioId: 2, data: "2025-10-02", hora: "13:07", tipo: "E" },
    { id: 8, funcionarioId: 2, data: "2025-10-02", hora: "17:00", tipo: "S" },
    { id: 9, funcionarioId: 2, data: "2025-10-03", hora: "13:07", tipo: "E" },
    { id: 10, funcionarioId: 2, data: "2025-10-03", hora: "17:00", tipo: "S" },
  ]);

  const [funcionarioSelecionado, setFuncionarioSelecionado] =
    useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [relatorioGerado, setRelatorioGerado] = useState<{
    funcionario: Funcionario | null;
    relatorioPorDia: DiaMarcacoes[];
    totalPeriodo: string;
  } | null>(null);

  const [feedback, setFeedback] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const handleGerarRelatorio = () => {
    if (!funcionarioSelecionado || !startDate || !endDate) {
      setFeedback({
        message: "Selecione um funcionário e o período para gerar o relatório.",
        type: "error",
      });
      return;
    }
    if (startDate > endDate) {
      setFeedback({
        message: "A data de início não pode ser maior que a data de fim.",
        type: "error",
      });
      return;
    }

    const funcionarioObj =
      funcionarios.find((f) => f.nome === funcionarioSelecionado) || null;

    const { relatorioPorDia, totalPeriodo } = gerarRelatorio({
      batidas,
      funcionario: funcionarioObj,
      periodo: { start: startDate, end: endDate },
    });

    setRelatorioGerado({
      funcionario: funcionarioObj,
      relatorioPorDia,
      totalPeriodo,
    });
  };

  const handleLimparRelatorio = () => {
    setFuncionarioSelecionado("");
    setStartDate("");
    setEndDate("");
    setRelatorioGerado(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-fundo-claro)]">
      <header className="md:hidden sticky top-0 bg-[var(--color-azul-primario)] text-white p-4 flex justify-between items-center z-20">
        <h1 className="text-xl font-bold">Relatórios Admin</h1>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <Menu className="w-6 h-6" />
        </button>
      </header>

      <div className="flex flex-1">
        <aside
          className={`fixed inset-y-0 left-0 z-30 w-64 bg-[var(--color-azul-primario)] text-white flex-col justify-between transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 md:relative md:flex`}
        >
          {isMobileMenuOpen && (
            <div
              className="fixed inset-0 bg-black opacity-50 md:hidden z-20"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}

          <div className="flex flex-col h-full">
            <div className="flex items-center justify-center p-6">
              <img
                src={AquicobLogo}
                alt="AQUICOB"
                className="h-20 w-auto rounded-lg bg-white p-2"
              />
            </div>
            <nav className="flex flex-col mt-6 flex-grow">
              <button
                onClick={() => {
                  navigate("/admin");
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 px-6 py-3 text-md font-semibold rounded-lg mb-2 hover:bg-blue-800 transition"
              >
                <UserCog className="w-6 h-6" />
                Funcionários
              </button>
              <button
                onClick={() => {
                  navigate("/admin/relatorios");
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 px-6 py-3 text-md font-semibold bg-blue-900 rounded-lg mb-2 hover:bg-blue-800 transition"
              >
                <Library className="w-6 h-6" />
                Relatórios
              </button>
            </nav>
            <div className="p-6 mt-auto">
              <button
                onClick={() => navigate("/")}
                className="flex items-center justify-center w-full gap-3 px-6 py-3 text-md font-semibold rounded-lg bg-red-600 hover:bg-red-700 transition"
              >
                <LogOut className="w-6 h-6 rotate-180" /> Sair
              </button>
            </div>
          </div>
        </aside>

        <main className="flex-1 p-6 md:p-8 pb-20 md:pb-8">
          <h1 className="hidden md:block text-3xl font-bold mb-6">
            Relatório de Ponto
          </h1>

          <RelatorioFilters
            funcionarios={funcionarios}
            funcionarioSelecionado={funcionarioSelecionado}
            setFuncionarioSelecionado={setFuncionarioSelecionado}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            onGerar={handleGerarRelatorio}
            onLimpar={handleLimparRelatorio}
          />

          {relatorioGerado ? (
            <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 overflow-x-auto">
              <p className="mb-4 text-sm text-gray-600">
                Relatório gerado para:{" "}
                <strong>{relatorioGerado.funcionario?.nome}</strong> — meta
                diária:{" "}
                <strong>
                  {relatorioGerado.funcionario?.cargaHorariaDiaria}h
                </strong>
              </p>

              <RelatorioTable
                dias={relatorioGerado.relatorioPorDia}
                funcionario={relatorioGerado.funcionario!}
              />
              <RelatorioCards
                dias={relatorioGerado.relatorioPorDia}
                funcionario={relatorioGerado.funcionario!}
              />

              <p className="mt-4 font-semibold">
                Total no período: {relatorioGerado.totalPeriodo}
              </p>
              <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md font-semibold">
                Exportar PDF
              </button>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-6">
              Nenhum relatório gerado.
            </p>
          )}
        </main>

        <nav className="fixed bottom-0 left-0 right-0 bg-[var(--color-azul-primario)] text-white flex justify-around py-2 md:hidden shadow-lg z-20">
          <button
            onClick={() => navigate("/admin")}
            className="flex flex-col items-center text-xs p-1"
          >
            <UserCog className="w-5 h-5 mb-1" /> Funcionários
          </button>
          <button
            onClick={() => navigate("/admin/relatorios")}
            className="flex flex-col items-center text-xs text-blue-200 p-1"
          >
            <Library className="w-5 h-5 mb-1" /> Relatórios
          </button>
          <button
            onClick={() => navigate("/")}
            className="flex flex-col items-center text-xs text-red-300 p-1"
          >
            <LogOut className="w-5 h-5 mb-1 rotate-180" /> Sair
          </button>
        </nav>
      </div>
      {feedback && (
        <FeedbackModal
          isOpen={!!feedback}
          onClose={() => setFeedback(null)}
          type={feedback.type}
          message={feedback.message}
        />
      )}
    </div>
  );
};

export default RelatoriosAdmin;
