import React, { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";

import type { DiaMarcacoes, Funcionario } from "../../types";
import RelatorioFilters from "../../components/Relatorio/RelatorioFilters";
import RelatorioTable from "../../components/Relatorio/RelatorioTable";
import RelatorioCards from "../../components/Relatorio/RelatorioCards";
import FeedbackModal from "../../components/Modal/FeedbackModal";
import AdminSidebar from "../../components/Admin/AdminSideBar";
import AdminMobileNav from "../../components/Admin/AdminMobileNav";

import { calcularHorasDia } from "../../utils/RelatorioUtils";

import { getFuncionarios } from "../../api/funcionariosApi";
import { gerarRelatorioAPI } from "../../api/relatoriosApi";
import autoTable from "jspdf-autotable";

const RelatoriosAdmin: React.FC = () => {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
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

  /** ---------- Effects ---------- */
  useEffect(() => {
    // Busca os funcionários do back-end ao montar o componente
    const fetchFuncionarios = async () => {
      try {
        const data = await getFuncionarios();
        setFuncionarios(data);
      } catch (error: unknown) {
        setFeedback({
          message: "Erro ao carregar funcionários.",
          type: "error",
        });
      }
    };

    fetchFuncionarios();
  }, []);

  /** ---------- Funções ---------- */
  const handleGerarRelatorio = async () => {
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

    if (!funcionarioObj) {
      setFeedback({ message: "Funcionário não encontrado.", type: "error" });
      return;
    }

    try {
      const { relatorioPorDia, totalPeriodo } = await gerarRelatorioAPI({
        funcionarioId: funcionarioObj.id,
        startDate,
        endDate,
      });

      setRelatorioGerado({
        funcionario: funcionarioObj,
        relatorioPorDia,
        totalPeriodo,
      });
    } catch (error: unknown) {
      setFeedback({ message: "Erro ao gerar relatório.", type: "error" });
    }
  };

  const handleLimparRelatorio = () => {
    setFuncionarioSelecionado("");
    setStartDate("");
    setEndDate("");
    setRelatorioGerado(null);
  };

  const handleExportPDF = () => {
    if (!relatorioGerado) return;

    const doc = new jsPDF();

    // Cabeçalho
    doc.setFontSize(16);
    doc.text(`Relatório de ${relatorioGerado.funcionario?.nome}`, 14, 20);
    doc.setFontSize(12);
    doc.text(`Período: ${startDate} até ${endDate}`, 14, 28);
    doc.text(
      `Meta diária: ${relatorioGerado.funcionario?.carga_horaria ?? 8}h`,
      14,
      36
    );

    // Tabela de registros
    const tableData = relatorioGerado.relatorioPorDia.map((d) => [
      d.data.split("-").reverse().join("/"),
      d.batidas.map((b) => `${b.hora} ${b.tipo}`).join(", "),
      calcularHorasDia(d.batidas),
    ]);

    autoTable(doc, {
      head: [["Dia", "Batidas", "Horas"]],
      body: tableData,
      startY: 45,
    });

    // Total do período
    const finalY = (doc as any).lastAutoTable?.finalY ?? 60;
    doc.text(
      `Total no período: ${relatorioGerado.totalPeriodo}`,
      14,
      finalY + 10
    );

    doc.save(`Relatorio_${relatorioGerado.funcionario?.nome}.pdf`);
  };

  /** ---------- Render ---------- */
  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-fundo-claro)]">
      {/* Header Mobile */}
      <header className="md:hidden sticky top-0 bg-[var(--color-azul-primario)] text-white p-4 flex justify-between items-center z-20">
        <h1 className="text-xl font-bold">Relatórios Admin</h1>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <Menu className="w-6 h-6" />
        </button>
      </header>

      <div className="flex flex-1">
        <AdminSidebar
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          currentPage="relatorios"
        />

        {/* Main Content */}
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
                <strong>{relatorioGerado.funcionario?.carga_horaria}h</strong>
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

              <button
                onClick={handleExportPDF}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md font-semibold"
              >
                Exportar PDF
              </button>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-6">
              Nenhum relatório gerado.
            </p>
          )}
        </main>

        <AdminMobileNav currentPage="relatorios" />
      </div>

      {/* Feedback Modal */}
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
