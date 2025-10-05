export function validarCPF(cpf: string): boolean {
  cpf = cpf.replace(/[^\d]+/g, "");

  if (cpf.length !== 11) return false;

  if (/^(\d)\1+$/.test(cpf)) return false;

  let soma = 0;
  let resto: number;

  // Valida 1º dígito verificador
  for (let i = 1; i <= 9; i++) {
    soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }

  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(9, 10))) return false;

  // Valida 2º dígito verificador
  soma = 0;
  for (let i = 1; i <= 10; i++) {
    soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }

  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(10, 11))) return false;

  return true;
}

export function validarSenha(senha: string): boolean {
  if (!senha) return false;
  return senha.length >= 8 && senha.length <= 20;
}

export function validarLogin(cpf: string, senha: string): { valido: boolean; erros: string[] } {
  const erros: string[] = [];

  if (!validarCPF(cpf)) {
    erros.push("CPF inválido. Verifique o número digitado.");
  }

  if (!validarSenha(senha)) {
    erros.push("A senha deve ter entre 8 e 20 caracteres.");
  }

  return {
    valido: erros.length === 0,
    erros,
  };
}
