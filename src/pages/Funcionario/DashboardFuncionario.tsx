import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  CheckCircle,
  XCircle,
  Coffee,
  LogOut,
  Timer,
} from "lucide-react";
import FeedbackModal from "../../components/Modal/FeedbackModal";
import ModalConfirmacaoPonto from "../../components/Modal/ConfirmacaoPontoModal";
import AquicobLogo from "../../assets/aquicobLogo.png";

interface Ponto {
  horario: string;
  tipo: "Entrada" | "Saida" | "Pausa";
}

const DashboardFuncionario: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<{
    open: boolean;
    message: string;
    type: "success" | "error";
  }>({
    open: false,
    message: "",
    type: "success",
  });

  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    tipo: Ponto["tipo"] | null;
  }>({
    open: false,
    tipo: null,
  });

  const [pontos, setPontos] = useState<Ponto[]>([]);
  const [dataAtual, setDataAtual] = useState<string>(
    new Date().toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
  );
  const [horaAtual, setHoraAtual] = useState<string>(
    new Date().toLocaleTimeString()
  );
  const [horasTrabalhadas, setHorasTrabalhadas] = useState<string>("00:00");
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setHoraAtual(new Date().toLocaleTimeString());
      setDataAtual(
        new Date().toLocaleDateString("pt-BR", {
          weekday: "long",
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    calcularHorasTrabalhadas();
  }, [pontos]);

  const calcularHorasTrabalhadas = () => {
    let totalMs = 0;
    let ultimaEntrada: Date | null = null;

    pontos
      .slice()
      .reverse()
      .forEach((ponto) => {
        const match = ponto.horario.match(/(\d{1,2}):(\d{2}):(\d{2})/);
        if (!match) return;

        const [_, h, m, s] = match.map(Number);
        const dataPonto = new Date();
        dataPonto.setHours(h, m, s, 0);

        if (ponto.tipo === "Entrada") {
          ultimaEntrada = dataPonto;
        } else if (
          (ponto.tipo === "Saida" || ponto.tipo === "Pausa") &&
          ultimaEntrada
        ) {
          totalMs += dataPonto.getTime() - ultimaEntrada.getTime();
          ultimaEntrada = null;
        }
      });

    if (totalMs <= 0) {
      setHorasTrabalhadas("00:00");
      return;
    }

    const totalSegundos = Math.floor(totalMs / 1000);
    const horas = String(Math.floor(totalSegundos / 3600)).padStart(2, "0");
    const minutos = String(Math.floor((totalSegundos % 3600) / 60)).padStart(
      2,
      "0"
    );

    setHorasTrabalhadas(`${horas}:${minutos}`);
  };

  const confirmarPonto = async () => {
    if (!confirmModal.tipo) return;
    setLoading(true);
    setConfirmModal({ open: false, tipo: null });

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const novoPonto: Ponto = {
        horario: new Date().toLocaleTimeString(),
        tipo: confirmModal.tipo,
      };
      setPontos([novoPonto, ...pontos]);

      setModal({
        open: true,
        message: `Ponto de ${novoPonto.tipo} registrado às ${novoPonto.horario}`,
        type: "success",
      });
    } catch (error: unknown) {
      setModal({
        open: true,
        message: `Erro ao registrar ponto. Tente novamente: ${
          error instanceof Error ? error.message : String(error)
        }`,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const podeRegistrarPonto = (tipo: Ponto["tipo"]) => {
    if (pontos.length === 0) return tipo === "Entrada";
    const ultimo = pontos[0].tipo;
    if (ultimo === "Saida") return false;
    if (ultimo === tipo) return false;
    if (tipo === "Pausa" && !pontos.some((p) => p.tipo === "Entrada"))
      return false;
    if (tipo === "Entrada" && ultimo === "Entrada") return false;
    return true;
  };

  const abrirModalConfirmacao = (tipo: Ponto["tipo"]) => {
    if (!podeRegistrarPonto(tipo)) {
      setModal({
        open: true,
        message: `Não é possível registrar um ponto de ${tipo} neste momento.`,
        type: "error",
      });
      return;
    }
    setConfirmModal({ open: true, tipo });
  };

  const getIcon = (tipo: Ponto["tipo"]) => {
    switch (tipo) {
      case "Entrada":
        return <CheckCircle className="text-green-600 w-5 h-5" />;
      case "Pausa":
        return <Coffee className="text-yellow-500 w-5 h-5" />;
      case "Saida":
        return <XCircle className="text-red-600 w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-fundo-claro)] flex flex-col items-center p-4 sm:p-8">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-[var(--color-azul-primario)] text-white flex flex-col sm:flex-row items-center justify-between p-6 sm:p-8">
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

          {/* Relógio + botão sair */}
          <div className="mt-4 sm:mt-0 flex items-center gap-6 text-gray-100">
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-2">
                <Clock className="w-6 h-6" />
                <span className="font-mono text-lg">{horaAtual}</span>
              </div>
              <span className="text-sm text-gray-200">{dataAtual}</span>
            </div>

            <button
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/");
              }}
              className="flex items-center gap-1 bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg text-white font-medium transition-all shadow-md"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>

        {/* Corpo */}
        <div className="p-6 sm:p-10 bg-gradient-to-br from-gray-50 to-gray-100">
          {/* Seção de Registro */}
          <div className="bg-white shadow-md rounded-xl p-6 mb-8 text-center">
            <h2 className="text-2xl font-semibold mb-6 text-[var(--color-texto-base)]">
              Registrar Ponto
            </h2>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => abrirModalConfirmacao("Entrada")}
                disabled={loading}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-500 hover:to-green-700 text-white px-8 py-3 rounded-lg font-medium shadow-md transition-all"
              >
                <CheckCircle className="w-5 h-5" />
                Entrada
              </button>

              <button
                onClick={() => abrirModalConfirmacao("Pausa")}
                disabled={loading}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-500 to-yellow-400 hover:to-yellow-600 text-white px-8 py-3 rounded-lg font-medium shadow-md transition-all"
              >
                <Coffee className="w-5 h-5" />
                Pausa
              </button>

              <button
                onClick={() => abrirModalConfirmacao("Saida")}
                disabled={loading}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-500 hover:to-red-700 text-white px-8 py-3 rounded-lg font-medium shadow-md transition-all"
              >
                <XCircle className="w-5 h-5" />
                Saída
              </button>
            </div>

            {/* Tempo trabalhado do dia */}
            <div className="mt-6 flex items-center justify-center gap-2 text-gray-700">
              <Timer className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-lg">
                Horas trabalhadas hoje:{" "}
                <span className="font-mono text-blue-700">
                  {horasTrabalhadas}
                </span>
              </span>
            </div>
          </div>

          {/* Histórico de pontos */}
          <div className="bg-white shadow-md rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-4 text-[var(--color-texto-base)]">
              Registros do Dia
            </h2>

            {pontos.length === 0 ? (
              <p className="text-gray-500 text-center py-6">
                Nenhum ponto registrado hoje.
              </p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {pontos.map((ponto, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between py-3 px-2 hover:bg-gray-50 rounded-lg transition"
                  >
                    <div className="flex items-center gap-3">
                      {getIcon(ponto.tipo)}
                      <span className="font-medium">{ponto.tipo}</span>
                    </div>
                    <span className="font-mono text-gray-600">
                      {ponto.horario}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Modal de confirmação */}
      <ModalConfirmacaoPonto
        isOpen={confirmModal.open}
        onClose={() => setConfirmModal({ open: false, tipo: null })}
        onConfirm={confirmarPonto}
        message={`Você confirma o registro de ${
          confirmModal.tipo ?? ""
        } às ${horaAtual}?`}
        tipo={confirmModal.tipo}
      />

      {/* Modal de feedback */}
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
