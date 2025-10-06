import { useMemo } from "react";
import type { Marcacao, DiaMarcacoes, Funcionario } from "../types";
import { calcularTotalPeriodo, agruparBatidasPorDia } from "../utils/RelatorioUtils";

interface UseRelatorioParams {
  batidas: Marcacao[];
  funcionario: Funcionario | null;
  periodo: { start: string; end: string };
}

export const useRelatorio = ({ batidas, funcionario, periodo }: UseRelatorioParams) => {
  const relatorioPorDia: DiaMarcacoes[] = useMemo(() => {
    if (!funcionario || !periodo.start || !periodo.end) return [];
    return agruparBatidasPorDia(batidas, funcionario.id, periodo.start, periodo.end);
  }, [batidas, funcionario, periodo]);

  const totalPeriodo = useMemo(() => calcularTotalPeriodo(relatorioPorDia), [relatorioPorDia]);

  return { relatorioPorDia, totalPeriodo };
};
