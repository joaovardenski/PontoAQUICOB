import React from "react";
import { Pencil, Trash } from "lucide-react";

export interface Funcionario {
  id: number;
  nome: string;
  cpf: string;
  cargo: string;
  carga_horaria: number;
}

interface Props {
  funcionarios: Funcionario[];
  onEdit: (f: Funcionario) => void;
  onDelete: (f: Funcionario) => void;
}

const FuncionariosTable: React.FC<Props> = ({ funcionarios, onEdit, onDelete }) => {
  return (
    <div className="hidden md:block overflow-x-auto">
      <table className="min-w-full text-left border-collapse text-sm">
        <thead>
          <tr className="border-b">
            <th className="py-2 px-4">Nome</th>
            <th className="py-2 px-4 whitespace-nowrap">CPF</th>
            <th className="py-2 px-4">Cargo</th>
            <th className="py-2 px-4 whitespace-nowrap">Carga Horária</th>
            <th className="py-2 px-4">Ações</th>
          </tr>
        </thead>
        <tbody>
          {funcionarios.map((f) => (
            <tr key={f.id} className="border-b hover:bg-gray-50 transition">
              <td className="py-2 px-4">{f.nome}</td>
              <td className="py-2 px-4 whitespace-nowrap">{f.cpf}</td>
              <td className="py-2 px-4">{f.cargo}</td>
              <td className="py-2 px-4 whitespace-nowrap">{f.carga_horaria}h/dia</td>
              <td className="py-2 px-4 flex gap-2">
                <button onClick={() => onEdit(f)} className="text-blue-600 hover:text-blue-800 p-1">
                  <Pencil className="w-5 h-5" />
                </button>
                <button onClick={() => onDelete(f)} className="text-red-600 hover:text-red-800 p-1">
                  <Trash className="w-5 h-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FuncionariosTable;
