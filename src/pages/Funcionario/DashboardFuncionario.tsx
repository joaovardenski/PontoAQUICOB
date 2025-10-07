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
import { logout } from "../../api/authApi";
import { capitalizarPrimeiraLetra } from "../../utils/StringUtils";

const DashboardFuncionario: React.FC = () => {
  const navigate = useNavigate();
  const { horaAtual, dataAtual } = useClock();
  const { registros, adicionarPonto, setRegistrosDoDia, horasTrabalhadas } =
    usePontos();

  /** ---------- Estados ---------- */
  const [loading, setLoading] = useState(false);

  const [feedbackModal, setFeedbackModal] = useState({
    open: false,
    message: "",
    type: "success" as "success" | "error",
  });

  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    tipo: Ponto["tipo"] | null;
  }>({ open: false, tipo: null });

  /** ---------- Funções ---------- */

  // Buscar registros do dia
  const carregarRegistrosDoDia = async () => {
    setLoading(true);
    try {
      const hoje = new Date().toISOString().split("T")[0];
      const response = await axiosPrivate.get(`/pontos/me?data=${hoje}`);

      const registrosDoDia: Ponto[] = response.data.map((r: any) => {
        const tipoStr = String(r.tipo || "").toLowerCase();
        const tipo = tipoStr.includes("entrada")
          ? "entrada"
          : tipoStr.includes("pausa")
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
      console.error("Erro ao carregar registros do dia:", error);
      abrirFeedback("Erro ao carregar registros do dia.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarRegistrosDoDia();
  }, []);

  // Determina se o usuário pode registrar determinado tipo de ponto
  const podeRegistrarPonto = (tipo: Ponto["tipo"]) => {
    const ultimoTipo = registros[0]?.tipo;

    if (!ultimoTipo) return tipo === "entrada";
    if (ultimoTipo.includes("saida")) return false;
    if (ultimoTipo === tipo) return false;
    if (ultimoTipo.includes("entrada")) return tipo === "pausa" || tipo === "saida";
    if (ultimoTipo.includes("pausa")) return tipo === "entrada" || tipo === "saida";

    return false;
  };

  // Abrir modal de confirmação antes de registrar ponto
  const abrirConfirmacaoPonto = (tipo: Ponto["tipo"]) => {
    if (!podeRegistrarPonto(tipo)) {
      const ordemEsperada =
        registros.length === 0
          ? "ENTRADA"
          : registros[0].tipo === "entrada"
          ? "PAUSA ou SAÍDA"
          : "ENTRADA ou SAÍDA";

      abrirFeedback(
        `Não é possível registrar ponto de ${tipo} neste momento. Ordem esperada: ${ordemEsperada}.`,
        "error"
      );
      return;
    }

    setConfirmModal({ open: true, tipo });
  };

  // Registrar ponto no backend
  const registrarPonto = async () => {
    if (!confirmModal.tipo) return;

    setLoading(true);
    setConfirmModal({ open: false, tipo: null });

    try {
      await axiosPrivate.post("/pontos", { tipo: confirmModal.tipo.toLowerCase() });

      adicionarPonto(confirmModal.tipo);

      abrirFeedback(
        `Ponto de ${confirmModal.tipo} registrado às ${horaAtual}`,
        "success"
      );
    } catch (error: unknown) {
      abrirFeedback(
        `Erro ao registrar ponto. Tente novamente: ${
          error instanceof Error ? error.message : ""
        }`,
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // Abrir feedback modal
  const abrirFeedback = (mensagem: string, tipo: "success" | "error") => {
    setFeedbackModal({ open: true, message: mensagem, type: tipo });
  };

  // Retorna ícone para cada tipo de ponto
  const obterIconePonto = (tipo: Ponto["tipo"]) => {
    const tipoFormatado = tipo.toLowerCase().replace("á", "a");
    if (tipoFormatado.includes("entrada")) return <CheckCircle className="text-green-600 w-5 h-5" />;
    if (tipoFormatado.includes("pausa")) return <Coffee className="text-yellow-500 w-5 h-5" />;
    return <XCircle className="text-red-600 w-5 h-5" />;
  };

  /** ---------- Render ---------- */
  return (
    <div className="min-h-screen bg-[var(--color-fundo-claro)] flex flex-col items-center p-4 sm:p-8">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <header className="bg-[var(--color-azul-primario)] text-white flex flex-col sm:flex-row items-center justify-between p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <img
              src={AquicobLogo}
              alt="Logo AQUICOB"
              className="h-16 sm:h-20 bg-white p-2 rounded-lg object-contain mr-2"
            />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Painel do Funcionário</h1>
              <p className="text-gray-200 text-sm sm:text-base">Bem-vindo ao sistema de ponto eletrônico</p>
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

        {/* Main */}
        <main className="p-6 sm:p-10 bg-gradient-to-br from-gray-50 to-gray-100">
          {/* Registrar Ponto */}
          <section className="bg-white shadow-md rounded-xl p-6 mb-8 text-center">
            <h2 className="text-2xl font-semibold mb-6 text-[var(--color-texto-base)]">Registrar Ponto</h2>

            {registros[0]?.tipo.toLowerCase().includes("saida") ? (
              <p className="text-2xl font-semibold text-green-500 py-6">
                Dia finalizado, bom descanso!
              </p>
            ) : (
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <RegistroButton
                  label="Entrada"
                  icon={CheckCircle}
                  color="green"
                  onClick={() => abrirConfirmacaoPonto("entrada")}
                  disabled={loading || !podeRegistrarPonto("entrada")}
                />
                <RegistroButton
                  label="Pausa"
                  icon={Coffee}
                  color="yellow"
                  onClick={() => abrirConfirmacaoPonto("pausa")}
                  disabled={loading || !podeRegistrarPonto("pausa")}
                />
                <RegistroButton
                  label="Saída"
                  icon={XCircle}
                  color="red"
                  onClick={() => abrirConfirmacaoPonto("saida")}
                  disabled={loading || !podeRegistrarPonto("saida")}
                />
              </div>
            )}

            <div className="mt-6 flex items-center justify-center gap-2 text-gray-700">
              <Timer className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-lg">
                Horas trabalhadas hoje:{" "}
                <span className="font-mono text-blue-700">{horasTrabalhadas}</span>
              </span>
            </div>
          </section>

          {/* Registros do dia */}
          <section className="bg-white shadow-md rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-4 text-[var(--color-texto-base)]">Registros do Dia</h2>

            {registros.length === 0 ? (
              <p className="text-gray-500 text-center py-6">Nenhum ponto registrado hoje.</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {registros.map((ponto, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between py-3 px-2 hover:bg-gray-50 rounded-lg transition"
                  >
                    <div className="flex items-center gap-3">
                      {obterIconePonto(ponto.tipo)}
                      <span className="font-medium">{capitalizarPrimeiraLetra(ponto.tipo)}</span>
                    </div>
                    <span className="font-mono text-gray-600">{ponto.horario}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </main>
      </div>

      {/* Modais */}
      <ModalConfirmacaoPonto
        isOpen={confirmModal.open}
        onClose={() => setConfirmModal({ open: false, tipo: null })}
        onConfirm={registrarPonto}
        message={`Você confirma o registro de ${confirmModal.tipo ?? ""} às ${horaAtual}?`}
        tipo={confirmModal.tipo}
      />

      <FeedbackModal
        isOpen={feedbackModal.open}
        onClose={() => setFeedbackModal({ ...feedbackModal, open: false })}
        type={feedbackModal.type}
        message={feedbackModal.message}
      />
    </div>
  );
};

export default DashboardFuncionario;
