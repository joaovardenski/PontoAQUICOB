import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserCog, Library, LogOut } from "lucide-react";
import AquicobLogo from "../../assets/AquicobLogo.png";

interface Marcacao {
  id: number;
  funcionario: string;
  data: string; // yyyy-mm-dd
  hora: string; // HH:mm
  tipo: "E" | "P" | "S"; // Entrada, Pausa ou Saída
}

interface Funcionario {
  id: number;
  nome: string;
}

interface DiaMarcacoes {
  data: string;
  batidas: Marcacao[];
}

const RelatoriosAdmin: React.FC = () => {
  const [funcionarios] = useState<Funcionario[]>([
    { id: 1, nome: "João" },
    { id: 2, nome: "Maria" },
    { id: 3, nome: "Pedro" },
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

  const navigate = useNavigate();

  // Calcula horas do dia considerando pausas
  const calcularHorasDia = (batidas: Marcacao[]) => {
    let totalMinutos = 0;
    let ultimoInicio: number | null = null;

    batidas.forEach((b) => {
      const [h, m] = b.hora.split(":").map(Number);
      const minutos = h * 60 + m;

      if (b.tipo === "E") {
        ultimoInicio = minutos;
      } else if (b.tipo === "P" && ultimoInicio !== null) {
        totalMinutos += minutos - ultimoInicio;
        ultimoInicio = null;
      } else if (b.tipo === "S" && ultimoInicio !== null) {
        totalMinutos += minutos - ultimoInicio;
        ultimoInicio = null;
      }
    });

    const horas = Math.floor(totalMinutos / 60);
    const minutos = totalMinutos % 60;
    return `${horas.toString().padStart(2, "0")}:${minutos.toString().padStart(2, "0")}`;
  };

  const calcularTotalPeriodo = () => {
    let totalMinutos = 0;
    diasFiltrados.forEach((d) => {
      const [h, m] = calcularHorasDia(d.batidas).split(":").map(Number);
      totalMinutos += h * 60 + m;
    });
    const horas = Math.floor(totalMinutos / 60);
    const minutos = totalMinutos % 60;
    return `${horas.toString().padStart(2, "0")}:${minutos.toString().padStart(2, "0")}`;
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

    // Filtra e agrupa marcações
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
    setGerarRelatorio(true);
  };

  return (
    <div className="flex min-h-screen bg-[var(--color-fundo-claro)]">
      <aside className="w-64 bg-[var(--color-azul-primario)] text-white flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-center p-6">
            <img src={AquicobLogo} alt="AQUICOB" className="h-20 w-auto rounded-lg bg-white p-2" />
          </div>
          <nav className="flex flex-col mt-6">
            <button
              onClick={() => navigate("/admin")}
              className="flex items-center gap-3 px-6 py-3 text-md font-semibold rounded-lg mb-2 hover:bg-blue-800 transition"
            >
              <UserCog className="w-6 h-6" />
              Funcionários
            </button>
            <button
              onClick={() => navigate("/admin/relatorios")}
              className="flex items-center gap-3 px-6 py-3 text-md font-semibold bg-blue-900 rounded-lg mb-2 hover:bg-blue-800 transition"
            >
              <Library className="w-6 h-6" />
              Relatórios
            </button>
          </nav>
        </div>
        <div className="p-6">
          <button
            onClick={() => navigate("/")}
            className="flex items-center justify-center w-full gap-3 px-6 py-3 text-md font-semibold rounded-lg bg-red-600 hover:bg-red-700 transition"
          >
            <LogOut className="w-6 h-6 rotate-180" /> Sair
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">Relatório de Ponto</h1>

        {/* Filtros */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 items-end">
          <div className="flex-1">
            <label className="block mb-1 font-semibold">Funcionário</label>
            <select
              value={funcionarioSelecionado}
              onChange={(e) => setFuncionarioSelecionado(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione</option>
              {funcionarios.map((f) => (
                <option key={f.id} value={f.nome}>{f.nome}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-2 flex-1">
            <div className="flex-1">
              <label className="block mb-1 font-semibold">Período início</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex-1">
              <label className="block mb-1 font-semibold">Período fim</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            onClick={handleGerarRelatorio}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold shadow-md mt-4 md:mt-0"
          >
            Gerar
          </button>
        </div>

        {/* Tabela de relatórios */}
        {gerarRelatorio && diasFiltrados.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-4">Dia</th>
                  <th className="py-2 px-4">Batidas (hh:mm)</th>
                  <th className="py-2 px-4">Horas no dia</th>
                </tr>
              </thead>
              <tbody>
                {diasFiltrados.map((d) => (
                  <tr key={d.data} className="border-b hover:bg-gray-50 transition">
                    <td className="py-2 px-4">{d.data.split("-").reverse().join("/")}</td>
                    <td className="py-2 px-4">{d.batidas.map((b) => `${b.hora} ${b.tipo}`).join(", ")}</td>
                    <td className="py-2 px-4">{calcularHorasDia(d.batidas)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p className="mt-4 font-semibold">Total no período: {calcularTotalPeriodo()}</p>

            <button
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md font-semibold"
            >
              Exportar PDF
            </button>
          </div>
        )}

        {gerarRelatorio && diasFiltrados.length === 0 && (
          <p className="text-gray-500 text-center py-6">Nenhuma marcação encontrada.</p>
        )}
      </main>
    </div>
  );
};

export default RelatoriosAdmin;
