import type { Funcionario, Marcacao, DiaMarcacoes } from "../types";

interface Params {
  batidas: Marcacao[];
  funcionario: Funcionario | null;
  periodo: { start: string; end: string };
}

export function gerarRelatorio({ batidas, funcionario, periodo }: Params) {
  if (!funcionario) return { relatorioPorDia: [] as DiaMarcacoes[], totalPeriodo: "0h" };

  const relatorioPorDia = agruparBatidasPorDia(
    batidas,
    funcionario.id,
    periodo.start,
    periodo.end
  );

  const totalPeriodo = calcularTotalPeriodo(relatorioPorDia);

  return { relatorioPorDia, totalPeriodo };
}


export const calcularHorasDia = (batidas: Marcacao[]): string => {
  let totalMinutos = 0;
  let ultimoInicio: number | null = null;

  batidas.forEach((b) => {
    const [h, m] = b.hora.split(":").map(Number);
    const minutos = h * 60 + m;

    if (b.tipo === "E") ultimoInicio = minutos;
    else if ((b.tipo === "P" || b.tipo === "S") && ultimoInicio !== null) {
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

export const calcularSaldoDiaComCarga = (batidas: Marcacao[], cargaMinutos: number): string => {
  const [h, m] = calcularHorasDia(batidas).split(":").map(Number);
  const minutosTrabalhados = h * 60 + m;
  const saldo = minutosTrabalhados - cargaMinutos;
  const horasSaldo = Math.floor(Math.abs(saldo) / 60);
  const minutosSaldo = Math.abs(saldo) % 60;
  const sinal = saldo >= 0 ? "+" : "-";
  return `${sinal}${horasSaldo.toString().padStart(2, "0")}:${minutosSaldo
    .toString()
    .padStart(2, "0")}`;
};

export const calcularTotalPeriodo = (dias: DiaMarcacoes[]): string => {
  let totalMinutos = 0;
  dias.forEach((d) => {
    const [h, m] = calcularHorasDia(d.batidas).split(":").map(Number);
    totalMinutos += h * 60 + m;
  });
  const horas = Math.floor(totalMinutos / 60);
  const minutos = totalMinutos % 60;
  return `${horas.toString().padStart(2, "0")}:${minutos.toString().padStart(2, "0")}`;
};

export const agruparBatidasPorDia = (
  batidas: Marcacao[],
  funcionarioId: number,
  startDate: string,
  endDate: string
): DiaMarcacoes[] => {
  const dias: DiaMarcacoes[] = [];

  batidas
    .filter(
      (b) =>
        b.funcionarioId === funcionarioId &&
        b.data >= startDate &&
        b.data <= endDate
    )
    .sort((a, b) => a.data.localeCompare(b.data) || a.hora.localeCompare(b.hora))
    .forEach((b) => {
      let dia = dias.find((d) => d.data === b.data);
      if (!dia) {
        dia = { data: b.data, batidas: [] };
        dias.push(dia);
      }
      dia.batidas.push(b);
    });

  return dias;
};

export const formatBatidasMobile = (batidas: Marcacao[]): string =>
  batidas.map((b) => `${b.tipo}: ${b.hora}`).join(" | ");