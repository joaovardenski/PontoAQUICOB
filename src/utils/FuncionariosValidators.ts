import { validarCPF } from "./AuthValidators";

interface FormFuncionario {
  nome: string;
  cpf: string;
  cargo: string;
}

export function validarFuncionario(form: FormFuncionario): string[] {
  const erros: string[] = [];

  // Validação do nome
  const nome = form.nome.trim();
  if (!nome) erros.push("O nome é obrigatório.");
  else if (nome.length < 3) erros.push("O nome deve ter no mínimo 3 caracteres.");
  else if (nome.length > 50) erros.push("O nome deve ter no máximo 50 caracteres.");

  // Validação do CPF
  const cpf = form.cpf.trim();
  if (!cpf) erros.push("O CPF é obrigatório.");
  else if (cpf.length > 14) erros.push("O CPF deve ter no máximo 14 caracteres.");
  else if (!validarCPF(cpf)) erros.push("CPF inválido.");

  // Validação do cargo/função
  const cargo = form.cargo.trim();
  if (!cargo) erros.push("O cargo/função é obrigatório.");
  else if (cargo.length < 2) erros.push("O cargo/função deve ter no mínimo 2 caracteres.");
  else if (cargo.length > 50) erros.push("O cargo/função deve ter no máximo 50 caracteres.");

  return erros;
}
