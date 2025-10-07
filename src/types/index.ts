export interface Funcionario {
  id: number;
  nome: string;
  carga_horaria: number;
}

export interface Marcacao {
  id: number;
  funcionarioId: number;
  data: string;
  hora: string;
  tipo: "E" | "P" | "S" | "Pausa";
}

export interface DiaMarcacoes {
  data: string;
  batidas: Marcacao[];
}
