import React, { useEffect, useState } from "react";
import { Lock, User, LogIn, Eye, EyeOff } from "lucide-react";
import AquicobLogo from "../../assets/aquicobLogo.png";
import { validarLogin } from "../../utils/AuthValidators";
import { formatarCPF } from "../../utils/MaskUtils";
import AuthInputField from "../../components/AuthInputField";
import AuthSubmitButton from "../../components/AuthSubmitButton";

interface LoginFormData {
  cpf: string;
  senha: string;
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    cpf: "",
    senha: "",
  });
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ cpf?: string; senha?: string }>({});

  useEffect(() => {
    if (!errors.cpf && !errors.senha) return;

    const timer = setTimeout(() => setErrors({}), 8000);
    return () => clearTimeout(timer);
  }, [errors]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const novoValor = name === "cpf" ? formatarCPF(value) : value;

    setFormData({
      ...formData,
      [name]: novoValor,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = validarLogin(formData.cpf, formData.senha);
    if (!result.valido) {
      const newErrors: { cpf?: string; senha?: string } = {};
      result.erros.forEach((error) => {
        if (error.includes("CPF")) newErrors.cpf = error;
        if (error.includes("senha")) newErrors.senha = error;
      });
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-fundo-claro)] p-4">
      <div className="flex w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden bg-white">
        <div className="hidden md:flex flex-col justify-center items-center p-12 w-1/2  bg-[var(--color-azul-primario)] text-white">
          <LogIn className="w-16 h-16 mb-4 stroke-2 text-[var(--color-ciano-acento)]" />
          <h1 className="text-2xl text-center font-bold mb-3">
            Bem-vindo(a) à AQUICOB
          </h1>
          <p className="text-center text-gray-200">
            Acesse para utilizar o sistema de Ponto Eletrônico e relatórios.
          </p>
        </div>
        <div className="w-full md:w-1/2 p-8 sm:p-12">
          <div className="flex justify-center mb-6">
            <img src={AquicobLogo} alt="Logo AQUICOB" className="h-26" />
          </div>

          <h2 className="text-2xl font-semibold text-center mb-6 text-[var(--color-texto-base)]">
            Acesso ao Ponto Eletrônico
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AuthInputField
              label="CPF"
              name="cpf"
              type="text"
              value={formData.cpf}
              onChange={handleChange}
              placeholder="Seu CPF"
              iconLeft={
                <User className="h-5 w-5 text-[var(--color-borda-suave)]" />
              }
              error={errors.cpf}
            />

            <AuthInputField
              label="Senha"
              name="senha"
              type={mostrarSenha ? "text" : "password"}
              value={formData.senha}
              onChange={handleChange}
              placeholder="Sua senha"
              iconLeft={
                <Lock className="h-5 w-5 text-[var(--color-borda-suave)]" />
              }
              iconRight={
                mostrarSenha ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )
              }
              onClickIconRight={() => setMostrarSenha(!mostrarSenha)}
              error={errors.senha}
            />

            <AuthSubmitButton type="submit" loading={loading}>
              Entrar
            </AuthSubmitButton>
          </form>

          <div className="mt-6 text-center">
            <a
              href="#"
              className="text-sm font-medium text-[var(--color-ciano-acento)] 
                          hover:text-[var(--color-azul-primario)] transition duration-150"
            >
              Esqueci minha senha
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
