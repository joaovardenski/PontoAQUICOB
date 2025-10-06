import React from "react";
import type { Funcionario } from "../../types";


interface Props {
  funcionarios: Funcionario[];
  funcionarioSelecionado: string;
  setFuncionarioSelecionado: (value: string) => void;
  startDate: string;
  setStartDate: (value: string) => void;
  endDate: string;
  setEndDate: (value: string) => void;
  onGerar: () => void;
  onLimpar: () => void;
}

const RelatorioFilters: React.FC<Props> = ({
  funcionarios,
  funcionarioSelecionado,
  setFuncionarioSelecionado,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  onGerar,
  onLimpar,
}) => (
  <div className="flex flex-wrap md:flex-row gap-4 mb-6 items-end">
    <div className="w-full md:w-auto md:flex-1">
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

    <div className="flex gap-2 w-full md:w-auto md:flex-1">
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

    <div className="flex gap-2 w-full md:w-auto md:mt-0">
      <button
        onClick={onGerar}
        className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold shadow-md"
      >
        Gerar
      </button>
      <button
        onClick={onLimpar}
        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-semibold"
      >
        Limpar
      </button>
    </div>
  </div>
);

export default RelatorioFilters;
