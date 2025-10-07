import axiosPrivate from "./axiosPrivate";
import type { DiaMarcacoes, Funcionario, Marcacao } from "../types";
import { gerarRelatorio } from "../utils/RelatorioUtils";

interface GerarRelatorioParams {
  funcionarioId: number;
  startDate: string;
  endDate: string;
}

export const gerarRelatorioAPI = async ({
  funcionarioId,
  startDate,
  endDate,
}: GerarRelatorioParams): Promise<{
  funcionario: Funcionario;
  relatorioPorDia: DiaMarcacoes[];
  totalPeriodo: string;
}> => {
  const response = await axiosPrivate.get(`/pontos/${funcionarioId}`, {
    params: { data_inicio: startDate, data_fim: endDate },
  });

  const registros: { id: number; datahora: string; tipo: string }[] =
    response.data;

  const batidasPorDia: Record<string, Marcacao[]> = {};

  registros.forEach((r) => {
    const [data, horaCompleta] = r.datahora.split(" ");
    const hora = horaCompleta.slice(0, 5);
    if (!batidasPorDia[data]) batidasPorDia[data] = [];

    let tipo: "E" | "P" | "S" | "Pausa";
    if (r.tipo === "entrada") tipo = "E";
    else if (r.tipo === "pausa") tipo = "P";
    else if (r.tipo === "saida") tipo = "S";
    else tipo = "Pausa";

    batidasPorDia[data].push({
      id: r.id,
      funcionarioId,
      data,
      hora,
      tipo,
    });
  });

  const relatorioPorDia: DiaMarcacoes[] = Object.entries(batidasPorDia).map(
    ([data, batidas]) => ({ data, batidas })
  );

  const funcionario: Funcionario = {
    id: funcionarioId,
    nome: "",
    carga_horaria: 8,
  };

  const { totalPeriodo } = gerarRelatorio({
    batidas: relatorioPorDia.flatMap((d) => d.batidas),
    funcionario,
    periodo: { start: startDate, end: endDate },
  });

  return { funcionario, relatorioPorDia, totalPeriodo };
};
