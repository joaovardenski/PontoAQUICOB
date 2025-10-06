import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserCog, Library, LogOut, Menu } from "lucide-react"; // Importei 'Menu' para o mobile
import AquicobLogo from "../../assets/AquicobLogo.png";

interface Marcacao {
  id: number;
  funcionario: string;
  data: string;
  hora: string;
  tipo: "E" | "P" | "S";
}

interface Funcionario {
  id: number;
  nome: string;
  cargaHorariaDiaria: number;
}

interface DiaMarcacoes {
  data: string;
  batidas: Marcacao[];
}

const RelatoriosAdmin: React.FC = () => {
  const [funcionarios] = useState<Funcionario[]>([
    { id: 1, nome: "João", cargaHorariaDiaria: 8 },
    { id: 2, nome: "Maria", cargaHorariaDiaria: 6 },
    { id: 3, nome: "Pedro", cargaHorariaDiaria: 8 },
  ]);

  const [marcacoes] = useState<Marcacao[]>([
    { id: 1, funcionario: "João", data: "2025-10-02", hora: "08:59", tipo: "E" },
    { id: 2, funcionario: "João", data: "2025-10-02", hora: "12:03", tipo: "P" },
    { id: 3, funcionario: "João", data: "2025-10-02", hora: "13:01", tipo: "E" },
    { id: 4, funcionario: "João", data: "2025-10-02", hora: "17:04", tipo: "S" },
    { id: 5, funcionario: "Maria", data: "2025-10-02", hora: "09:10", tipo: "E" },
    { id: 6, funcionario: "Maria", data: "2025-10-02", hora: "12:05", tipo: "P" },
    { id: 7, funcionario: "Maria", data: "2025-10-02", hora: "13:07", tipo: "E" },
    { id: 8, funcionario: "Maria", data: "2025-10-02", hora: "17:00", tipo: "S" },
    { id: 9, funcionario: "Maria", data: "2025-10-03", hora: "13:07", tipo: "E" },
    { id: 10, funcionario: "Maria", data: "2025-10-03", hora: "17:00", tipo: "S" },
  ]);

  const [funcionarioSelecionado, setFuncionarioSelecionado] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [gerarRelatorio, setGerarRelatorio] = useState(false);
  const [diasFiltrados, setDiasFiltrados] = useState<DiaMarcacoes[]>([]);
  const [reportFuncionario, setReportFuncionario] = useState<Funcionario | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Estado para menu mobile lateral

  const navigate = useNavigate();

  const calcularHorasDia = (batidas: Marcacao[]) => {
    let totalMinutos = 0;
    let ultimoInicio: number | null = null;

    batidas.forEach((b) => {
      const [h, m] = b.hora.split(":").map(Number);
      const minutos = h * 60 + m;

      if (b.tipo === "E") {
        ultimoInicio = minutos;
      } else if ((b.tipo === "P" || b.tipo === "S") && ultimoInicio !== null) {
        totalMinutos += minutos - ultimoInicio;
        ultimoInicio = null;
      }
    });

    const horas = Math.floor(totalMinutos / 60);
    const minutos = totalMinutos % 60;
    return `${horas.toString().padStart(2, "0")}:${minutos
      .toString()
      .padStart(2, "0")}`;
  };

  const calcularSaldoDiaComCarga = (batidas: Marcacao[], cargaMinutos: number) => {
    const horasDia = calcularHorasDia(batidas);
    const [h, m] = horasDia.split(":").map(Number);
    const minutosTrabalhados = h * 60 + m;

    const saldo = minutosTrabalhados - cargaMinutos;
    const horasSaldo = Math.floor(Math.abs(saldo) / 60);
    const minutosSaldo = Math.abs(saldo) % 60;
    const sinal = saldo >= 0 ? "+" : "-";
    return `${sinal}${horasSaldo.toString().padStart(2, "0")}:${minutosSaldo
      .toString()
      .padStart(2, "0")}`;
  };

  const calcularTotalPeriodo = () => {
    let totalMinutos = 0;
    diasFiltrados.forEach((d) => {
      const [h, m] = calcularHorasDia(d.batidas).split(":").map(Number);
      totalMinutos += h * 60 + m;
    });
    const horas = Math.floor(totalMinutos / 60);
    const minutos = totalMinutos % 60;
    return `${horas.toString().padStart(2, "0")}:${minutos
      .toString()
      .padStart(2, "0")}`;
  };

  const handleGerarRelatorio = () => {
    if (!funcionarioSelecionado || !startDate || !endDate) {
      alert("Selecione um funcionário e o período para gerar o relatório.");
      return;
    }

    if (startDate > endDate) {
      alert("A data de início não pode ser maior que a data de fim.");
      return;
    }

    const funcionarioObj =
      funcionarios.find((f) => f.nome === funcionarioSelecionado) || null;

    const dias: DiaMarcacoes[] = [];
    marcacoes
      .filter(
        (m) =>
          m.funcionario === funcionarioSelecionado &&
          m.data >= startDate &&
          m.data <= endDate
      )
      .sort((a, b) => a.data.localeCompare(b.data) || a.hora.localeCompare(b.hora))
      .forEach((m) => {
        let dia = dias.find((d) => d.data === m.data);
        if (!dia) {
          dia = { data: m.data, batidas: [] };
          dias.push(dia);
        }
        dia.batidas.push(m);
      });

    setDiasFiltrados(dias);
    setReportFuncionario(funcionarioObj);
    setGerarRelatorio(true);
  };

  const handleLimparRelatorio = () => {
    setDiasFiltrados([]);
    setReportFuncionario(null);
    setGerarRelatorio(false);
  };

  // Helper para formatar batidas no mobile (ex: E: 08:00, S: 17:00)
  const formatBatidasMobile = (batidas: Marcacao[]): string => {
    return batidas.map((b) => `${b.tipo}: ${b.hora}`).join(" | ");
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-fundo-claro)]">
      {/* HEADER MOBILE para o botão do menu lateral */}
      <header className="md:hidden sticky top-0 bg-[var(--color-azul-primario)] text-white p-4 flex justify-between items-center z-20">
        <h1 className="text-xl font-bold">Relatórios Admin</h1>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {/* MENU LATERAL (desktop e mobile) */}
      <div className="flex flex-1">
        {/* Sidebar Mobile: condicionalmente renderizada e com estilos de overlay */}
        <aside
          className={`fixed inset-y-0 left-0 z-30 w-64 bg-[var(--color-azul-primario)] text-white flex-col justify-between transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 md:relative md:flex`}
        >
          {/* Fundo escuro para o menu mobile */}
          {isMobileMenuOpen && (
            <div
              className="fixed inset-0 bg-black opacity-50 md:hidden z-20"
              onClick={() => setIsMobileMenuOpen(false)}
            ></div>
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
                  setIsMobileMenuOpen(false); // Fecha o menu no mobile após a navegação
                }}
                className="flex items-center gap-3 px-6 py-3 text-md font-semibold rounded-lg mb-2 hover:bg-blue-800 transition"
              >
                <UserCog className="w-6 h-6" />
                Funcionários
              </button>
              <button
                onClick={() => {
                  navigate("/admin/relatorios");
                  setIsMobileMenuOpen(false); // Fecha o menu no mobile após a navegação
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

        {/* CONTEÚDO PRINCIPAL */}
        <main className="flex-1 p-6 md:p-8 pb-20 md:pb-8">
          <h1 className="hidden md:block text-3xl font-bold mb-6">Relatório de Ponto</h1> {/* Esconde o título no mobile se houver um header */}

          {/* FILTROS: Usa flex-wrap e ajusta as larguras para o mobile */}
          <div className="flex flex-wrap md:flex-row gap-4 mb-6 items-end">
            <div className="w-full md:w-auto md:flex-1"> {/* w-full para mobile */}
              <label className="block mb-1 font-semibold">Funcionário</label>
              <select
                value={funcionarioSelecionado}
                onChange={(e) => setFuncionarioSelecionado(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione</option>
                {funcionarios.map((f) => (
                  <option key={f.id} value={f.nome}>
                    {f.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2 w-full md:w-auto md:flex-1"> {/* w-full para mobile */}
              <div className="flex-1">
                <label className="block mb-1 font-semibold">Período início</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex-1">
                <label className="block mb-1 font-semibold">Período fim</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Botões ocupam a largura total no mobile e alinham-se à direita/topo no desktop */}
            <div className="flex gap-2 w-full md:w-auto md:mt-0">
              <button
                onClick={handleGerarRelatorio}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold shadow-md"
              >
                Gerar
              </button>
              <button
                onClick={handleLimparRelatorio}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-semibold"
              >
                Limpar
              </button>
            </div>
          </div>

          {/* TABELA: Aplicando responsividade para a tabela */}
          {gerarRelatorio && diasFiltrados.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 **overflow-x-auto**"> {/* overflow-x-auto para a tabela deslizar horizontalmente */}
              {reportFuncionario && (
                <p className="mb-4 text-sm text-gray-600">
                  Relatório gerado para: <strong>{reportFuncionario.nome}</strong> — meta diária:{" "}
                  <strong>{reportFuncionario.cargaHorariaDiaria}h</strong>
                </p>
              )}

              {/* Tabela Padrão (Desktop/Tablet) */}
              <div className="hidden md:block">
                <table className="min-w-full border-collapse text-left text-sm sm:text-base">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 px-2 sm:px-4">Dia</th>
                      <th className="py-2 px-2 sm:px-4">Batidas</th>
                      <th className="py-2 px-2 sm:px-4">Horas</th>
                      <th className="py-2 px-2 sm:px-4">Meta</th>
                      <th className="py-2 px-2 sm:px-4">Saldo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {diasFiltrados.map((d) => {
                      const cargaMinutos = (reportFuncionario?.cargaHorariaDiaria ?? 8) * 60;
                      const saldo = calcularSaldoDiaComCarga(d.batidas, cargaMinutos);
                      return (
                        <tr
                          key={d.data}
                          className="border-b hover:bg-gray-50 transition"
                        >
                          <td className="py-2 px-2 sm:px-4 whitespace-nowrap">
                            {d.data.split("-").reverse().join("/")}
                          </td>
                          <td className="py-2 px-2 sm:px-4 whitespace-nowrap">
                            {d.batidas.map((b) => `${b.hora} ${b.tipo}`).join(", ")}
                          </td>
                          <td className="py-2 px-2 sm:px-4 whitespace-nowrap">
                            {calcularHorasDia(d.batidas)}
                          </td>
                          <td className="py-2 px-2 sm:px-4 whitespace-nowrap">
                            {reportFuncionario?.cargaHorariaDiaria ?? 8}h
                          </td>
                          <td
                            className={`py-2 px-2 sm:px-4 font-semibold whitespace-nowrap ${
                              saldo.startsWith("+") ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {saldo}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              {/* Layout de Cartão/Lista (Mobile) */}
              <div className="md:hidden space-y-4">
                {diasFiltrados.map((d) => {
                  const cargaMinutos = (reportFuncionario?.cargaHorariaDiaria ?? 8) * 60;
                  const saldo = calcularSaldoDiaComCarga(d.batidas, cargaMinutos);
                  return (
                    <div key={d.data} className="border p-3 rounded-lg shadow-sm">
                      <div className="flex justify-between items-center mb-1">
                        <strong className="text-lg">
                          {d.data.split("-").reverse().join("/")}
                        </strong>
                        <span
                          className={`font-bold ${
                            saldo.startsWith("+") ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {saldo}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Horas:</span> {calcularHorasDia(d.batidas)} | <span className="font-semibold">Meta:</span> {reportFuncionario?.cargaHorariaDiaria ?? 8}h
                      </p>
                      <p className="text-sm text-gray-600 mt-1 break-words">
                        <span className="font-semibold">Batidas:</span> {formatBatidasMobile(d.batidas)}
                      </p>
                    </div>
                  );
                })}
              </div>

              <p className="mt-4 font-semibold">
                Total no período: {calcularTotalPeriodo()}
              </p>

              <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md font-semibold">
                Exportar PDF
              </button>
            </div>
          )}

          {gerarRelatorio && diasFiltrados.length === 0 && (
            <p className="text-gray-500 text-center py-6">
              Nenhuma marcação encontrada.
            </p>
          )}
        </main>

        {/* MENU INFERIOR (mobile) */}
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
    </div>
  );
};

export default RelatoriosAdmin;