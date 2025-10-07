import axiosPrivate from "./axiosPrivate";

export interface FuncionarioPayload {
  nome: string;
  cpf: string;
  cargo?: string;
  carga_horaria?: number;
  tipo_usuario?: string;
}

export const getFuncionarios = async () => {
  const response = await axiosPrivate.get("/funcionarios");
  return response.data;
};

export const createFuncionario = async (data: FuncionarioPayload) => {
  const response = await axiosPrivate.post("/funcionarios", data);
  return response.data;
};

export const updateFuncionario = async (id: number, data: FuncionarioPayload) => {
  const response = await axiosPrivate.put(`/funcionarios/${id}`, data);
  return response.data;
};

export const deleteFuncionario = async (id: number) => {
  const response = await axiosPrivate.delete(`/funcionarios/${id}`);
  return response.data;
};
