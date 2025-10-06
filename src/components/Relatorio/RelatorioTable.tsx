import React from "react";
import type { DiaMarcacoes, Funcionario } from "../../types";
import { calcularHorasDia, calcularSaldoDiaComCarga } from "../../utils/RelatorioUtils";

interface Props {
  dias: DiaMarcacoes[];
  funcionario: Funcionario | null;
}

const RelatorioTable: React.FC<Props> = ({ dias, funcionario }) => (
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
        {dias.map((d) => {
          const cargaMinutos = (funcionario?.cargaHorariaDiaria ?? 8) * 60;
          const saldo = calcularSaldoDiaComCarga(d.batidas, cargaMinutos);
          return (
            <tr key={d.data} className="border-b hover:bg-gray-50 transition">
              <td className="py-2 px-2 sm:px-4 whitespace-nowrap">{d.data.split("-").reverse().join("/")}</td>
              <td className="py-2 px-2 sm:px-4 whitespace-nowrap">
                {d.batidas.map((b) => `${b.hora} ${b.tipo}`).join(", ")}
              </td>
              <td className="py-2 px-2 sm:px-4 whitespace-nowrap">{calcularHorasDia(d.batidas)}</td>
              <td className="py-2 px-2 sm:px-4 whitespace-nowrap">{funcionario?.cargaHorariaDiaria ?? 8}h</td>
              <td className={`py-2 px-2 sm:px-4 font-semibold whitespace-nowrap ${saldo.startsWith("+") ? "text-green-600" : "text-red-600"}`}>
                {saldo}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

export default RelatorioTable;
