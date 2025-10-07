import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  Coffee,
  XCircle,
  Timer,
  Clock,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useClock } from "../../hooks/useClock";
import { usePontos } from "../../hooks/usePontos";
import type { Ponto } from "../../hooks/usePontos";
import AquicobLogo from "../../assets/aquicobLogo.png";
import RegistroButton from "../../components/Funcionario/RegistroButton";
import ModalConfirmacaoPonto from "../../components/Modal/ConfirmacaoPontoModal";
import FeedbackModal from "../../components/Modal/FeedbackModal";
import axiosPrivate from "../../api/axiosPrivate";
import { capitalizarPrimeiraLetra } from "../../utils/StringUtils";
import { logout } from "../../api/authApi";

const DashboardFuncionario: React.FC = () => {
  const navigate = useNavigate();
  const { horaAtual, dataAtual } = useClock();
  const { registros, adicionarPonto, setRegistrosDoDia, horasTrabalhadas } =
    usePontos();

  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({
    open: false,
    message: "",
    type: "success" as "success" | "error",
  });
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    tipo: Ponto["tipo"] | null;
  }>({ open: false, tipo: null });

  const buscarRegistrosDoDia = async () => {
    setLoading(true);
    try {
      const hoje = new Date().toISOString().split("T")[0];
      const response = await axiosPrivate.get(`/pontos/me?data=${hoje}`);

      const registrosDoDia: Ponto[] = response.data.map((r: any) => {
        const tipoTxt = String(r.tipo || "").toLowerCase();
        const tipo = tipoTxt.includes("entrada")
          ? "entrada"
          : tipoTxt.includes("pausa")
          ? "pausa"
          : "saida";

        const horario = new Date(r.datahora).toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
          timeZone: "America/Sao_Paulo",
        });

        return { tipo, horario, datahoraIso: r.datahora } as Ponto;
      });

      setRegistrosDoDia(registrosDoDia.reverse());
    } catch (error) {
      console.error("Erro ao buscar registros do dia:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarRegistrosDoDia();
  }, []);

  const podeRegistrar = (tipo: Ponto["tipo"]) => {
    const ultimo = registros[0]?.tipo

    if (!ultimo) return tipo === "entrada";

    if (ultimo.includes("saida")) return false;

    if (ultimo === tipo) return false;

    if (ultimo.includes("entrada"))
      return tipo === "pausa" || tipo === "saida";

    if (ultimo.includes("pausa"))
      return tipo === "entrada" || tipo === "saida";

    return false;
  };

  const abrirConfirmacaoPonto = (tipo: Ponto["tipo"]) => {
    if (!podeRegistrar(tipo)) {
      setModal({
        open: true,
        message: `Não é possível registrar um ponto de ${tipo} neste momento. A ordem esperada é ${
          registros.length === 0
            ? "ENTRADA"
            : registros[0].tipo === "entrada"
            ? "PAUSA ou SAÍDA"
            : "ENTRADA ou SAÍDA"
        }.`,
        type: "error",
      });
      return;
    }
    setConfirmModal({ open: true, tipo });
  };

  const registrarPonto = async () => {
    if (!confirmModal.tipo) return;
    setLoading(true);
    setConfirmModal({ open: false, tipo: null });

    try {
      const tipoBackend = confirmModal.tipo.toLowerCase();

      const response = await axiosPrivate.post("/pontos", {
        tipo: tipoBackend,
      });

      console.log("Ponto registrado:", response.data);

      adicionarPonto(confirmModal.tipo!);

      setModal({
        open: true,
        message: `Ponto de ${confirmModal.tipo} registrado às ${horaAtual}`,
        type: "success",
      });
    } catch (error: unknown) {
      setModal({
        open: true,
        message: `Erro ao registrar ponto. Tente novamente: ${
          error instanceof Error ? error.message : ""
        }`,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (tipo: Ponto["tipo"]) => {
    const t = tipo.toLowerCase().replace("á", "a");
    if (t.includes("entrada"))
      return <CheckCircle className="text-green-600 w-5 h-5" />;
    if (t.includes("pausa"))
      return <Coffee className="text-yellow-500 w-5 h-5" />;
    return <XCircle className="text-red-600 w-5 h-5" />;
  };

  return (
    <div className="min-h-screen bg-[var(--color-fundo-claro)] flex flex-col items-center p-4 sm:p-8">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden">
        <header className="bg-[var(--color-azul-primario)] text-white flex flex-col sm:flex-row items-center justify-between p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <img
              src={AquicobLogo}
              alt="Logo AQUICOB"
              className="h-16 sm:h-20 bg-white p-2 rounded-lg object-contain mr-2"
            />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">
                Painel do Funcionário
              </h1>
              <p className="text-gray-200 text-sm sm:text-base">
                Bem-vindo ao sistema de ponto eletrônico
              </p>
            </div>
          </div>

          <div className="mt-4 sm:mt-0 flex items-center gap-6 text-gray-100">
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-2">
                <Clock className="w-6 h-6" />
                <span className="font-mono text-lg">{horaAtual}</span>
              </div>
              <span className="text-sm text-gray-200">{dataAtual}</span>
            </div>

            <button
              onClick={() => logout()}
              className="flex items-center gap-1 bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg text-white font-medium transition-all shadow-md"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </header>

        <main className="p-6 sm:p-10 bg-gradient-to-br from-gray-50 to-gray-100">
          <section className="bg-white shadow-md rounded-xl p-6 mb-8 text-center">
            <h2 className="text-2xl font-semibold mb-6 text-[var(--color-texto-base)]">
              Registrar Ponto
            </h2>

            {registros.length > 0 &&
            registros[0].tipo.toLowerCase().includes("saida") ? (
              <div className="flex flex-col items-center justify-center py-6">
                <p className="text-2xl font-semibold text-green-500">
                  Dia finalizado, bom descanso!
                </p>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <RegistroButton
                  label="Entrada"
                  icon={CheckCircle}
                  color="green"
                  onClick={() => abrirConfirmacaoPonto("entrada")}
                  disabled={loading || !podeRegistrar("entrada")}
                />
                <RegistroButton
                  label="Pausa"
                  icon={Coffee}
                  color="yellow"
                  onClick={() => abrirConfirmacaoPonto("pausa")}
                  disabled={loading || !podeRegistrar("pausa")}
                />
                <RegistroButton
                  label="Saída"
                  icon={XCircle}
                  color="red"
                  onClick={() => abrirConfirmacaoPonto("saida")}
                  disabled={loading || !podeRegistrar("saida")}
                />
              </div>
            )}

            <div className="mt-6 flex items-center justify-center gap-2 text-gray-700">
              <Timer className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-lg">
                Horas trabalhadas hoje:{" "}
                <span className="font-mono text-blue-700">
                  {horasTrabalhadas}
                </span>
              </span>
            </div>
          </section>

          <section className="bg-white shadow-md rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-4 text-[var(--color-texto-base)]">
              Registros do Dia
            </h2>

            {registros.length === 0 ? (
              <p className="text-gray-500 text-center py-6">
                Nenhum ponto registrado hoje.
              </p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {registros.map((ponto, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between py-3 px-2 hover:bg-gray-50 rounded-lg transition"
                  >
                    <div className="flex items-center gap-3">
                      {getIcon(ponto.tipo)}
                      <span className="font-medium">{capitalizarPrimeiraLetra(ponto.tipo)}</span>
                    </div>
                    <span className="font-mono text-gray-600">
                      {ponto.horario}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </main>
      </div>

      <ModalConfirmacaoPonto
        isOpen={confirmModal.open}
        onClose={() => setConfirmModal({ open: false, tipo: null })}
        onConfirm={registrarPonto}
        message={`Você confirma o registro de ${
          confirmModal.tipo ?? ""
        } às ${horaAtual}?`}
        tipo={confirmModal.tipo}
      />

      <FeedbackModal
        isOpen={modal.open}
        onClose={() => setModal({ ...modal, open: false })}
        type={modal.type}
        message={modal.message}
      />
    </div>
  );
};

export default DashboardFuncionario;
