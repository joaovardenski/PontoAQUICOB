export function formatarCPF(valor: string): string {
  valor = valor.replace(/\D/g, "");

  valor = valor.slice(0, 11);

  if (valor.length <= 3) return valor;
  if (valor.length <= 6) return valor.replace(/(\d{3})(\d+)/, "$1.$2");
  if (valor.length <= 9)
    return valor.replace(/(\d{3})(\d{3})(\d+)/, "$1.$2.$3");
  return valor.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, "$1.$2.$3-$4");
}
