import React from "react";
import type { DiaMarcacoes, Funcionario } from "../../types";
import { calcularHorasDia, calcularSaldoDiaComCarga, formatBatidasMobile } from "../../utils/RelatorioUtils";

interface Props {
  dias: DiaMarcacoes[];
  funcionario: Funcionario | null;
}

const RelatorioCards: React.FC<Props> = ({ dias, funcionario }) => (
  <div className="md:hidden space-y-4">
    {dias.map((d) => {
      const cargaMinutos = (funcionario?.carga_horaria ?? 8) * 60;
      const saldo = calcularSaldoDiaComCarga(d.batidas, cargaMinutos);
      return (
        <div key={d.data} className="border p-3 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-1">
            <strong className="text-lg">{d.data.split("-").reverse().join("/")}</strong>
            <span className={`font-bold ${saldo.startsWith("+") ? "text-green-600" : "text-red-600"}`}>{saldo}</span>
          </div>
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Horas:</span> {calcularHorasDia(d.batidas)} | <span className="font-semibold">Meta:</span> {funcionario?.carga_horaria ?? 8}h
          </p>
          <p className="text-sm text-gray-600 mt-1 break-words">
            <span className="font-semibold">Batidas:</span> {formatBatidasMobile(d.batidas)}
          </p>
        </div>
      );
    })}
  </div>
);

export default RelatorioCards;
