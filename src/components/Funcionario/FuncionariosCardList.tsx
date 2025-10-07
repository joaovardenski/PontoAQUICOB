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

const FuncionariosCardList: React.FC<Props> = ({ funcionarios, onEdit, onDelete }) => {
  return (
    <div className="md:hidden space-y-3">
      {funcionarios.map((f) => (
        <div key={f.id} className="border border-gray-200 p-3 rounded-lg shadow-sm bg-gray-50">
          <div className="flex justify-between items-center mb-1">
            <strong className="text-lg text-gray-800">{f.nome}</strong>
            <div className="flex gap-2">
              <button onClick={() => onEdit(f)} className="text-blue-600 hover:text-blue-800 p-1">
                <Pencil className="w-5 h-5" />
              </button>
              <button onClick={() => onDelete(f)} className="text-red-600 hover:text-red-800 p-1">
                <Trash className="w-5 h-5" />
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            <span className="font-semibold">CPF:</span> {f.cpf}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Cargo:</span> {f.cargo}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Carga Horária:</span> {f.carga_horaria}h/dia
          </p>
        </div>
      ))}
    </div>
  );
};

export default FuncionariosCardList;
