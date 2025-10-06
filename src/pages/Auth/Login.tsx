import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, User, LogIn, Eye, EyeOff } from "lucide-react";
import AquicobLogo from "../../assets/aquicobLogo.png";
import { validarLogin } from "../../utils/AuthValidators";
import { formatarCPF } from "../../utils/MaskUtils";
import AuthInputField from "../../components/Auth/AuthInputField";
import AuthSubmitButton from "../../components/Auth/AuthSubmitButton";

interface LoginFormData {
  cpf: string;
  senha: string;
}

const ERROR_TIMEOUT = 8000;
const LOGIN_DELAY = 2000;

const useLoginForm = (onSuccess: () => void) => {
  const [credentials, setCredentials] = useState<LoginFormData>({
    cpf: "",
    senha: "",
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    cpf?: string;
    senha?: string;
  }>({});

  useEffect(() => {
    if (!validationErrors.cpf && !validationErrors.senha) return;

    const timer = setTimeout(() => setValidationErrors({}), ERROR_TIMEOUT);
    return () => clearTimeout(timer);
  }, [validationErrors]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: name === "cpf" ? formatarCPF(value) : value,
    });
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = validarLogin(credentials.cpf, credentials.senha);
    if (!result.valido) {
      const newErrors: { cpf?: string; senha?: string } = {};
      result.erros.forEach((error) => {
        if (error.includes("CPF")) newErrors.cpf = error;
        if (error.includes("senha")) newErrors.senha = error;
      });
      setValidationErrors(newErrors);
      return;
    }

    setValidationErrors({});
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, LOGIN_DELAY));
    setIsLoading(false);
    onSuccess();
  };

  return {
    credentials,
    isPasswordVisible,
    isLoading,
    validationErrors,
    handleInputChange,
    togglePasswordVisibility,
    handleLoginSubmit,
  };
};

const Login: React.FC = () => {
  const navigate = useNavigate();

  const {
    credentials,
    isPasswordVisible,
    isLoading,
    validationErrors,
    handleInputChange,
    togglePasswordVisibility,
    handleLoginSubmit,
  } = useLoginForm(() => navigate("/funcionario"));

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-fundo-claro)] p-4">
      <div className="flex w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden bg-white">
        <aside className="hidden md:flex flex-col justify-center items-center p-12 w-1/2 bg-[var(--color-azul-primario)] text-white">
          <LogIn className="w-16 h-16 mb-4 stroke-2 text-[var(--color-ciano-acento)]" />
          <h1 className="text-2xl font-bold mb-3 text-center">
            Bem-vindo(a) à AQUICOB
          </h1>
          <p className="text-center text-gray-200">
            Acesse para utilizar o sistema de Ponto Eletrônico e relatórios.
          </p>
        </aside>

        <section className="w-full md:w-1/2 p-8 sm:p-12">
          <div className="flex justify-center mb-6">
            <img src={AquicobLogo} alt="Logo AQUICOB" className="h-26" />
          </div>

          <h2 className="text-2xl font-semibold text-center mb-6 text-[var(--color-texto-base)]">
            Acesso ao Ponto Eletrônico
          </h2>

          <form onSubmit={handleLoginSubmit} className="space-y-6">
            <AuthInputField
              label="CPF"
              name="cpf"
              type="text"
              value={credentials.cpf}
              onChange={handleInputChange}
              placeholder="Seu CPF"
              iconLeft={<User className="h-5 w-5 text-[var(--color-borda-suave)]" />}
              error={validationErrors.cpf}
            />

            <AuthInputField
              label="Senha"
              name="senha"
              type={isPasswordVisible ? "text" : "password"}
              value={credentials.senha}
              onChange={handleInputChange}
              placeholder="Sua senha"
              iconLeft={<Lock className="h-5 w-5 text-[var(--color-borda-suave)]" />}
              iconRight={
                isPasswordVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />
              }
              onClickIconRight={togglePasswordVisibility}
              error={validationErrors.senha}
            />

            <AuthSubmitButton type="submit" loading={isLoading}>
              Entrar
            </AuthSubmitButton>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Login;
