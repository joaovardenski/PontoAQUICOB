import { useState, useEffect } from "react";

export interface Ponto {
  horario: string;
  tipo: "entrada" | "pausa" | "saida";
  datahoraIso?: string;
}

export const usePontos = () => {
  const [registros, setRegistros] = useState<Ponto[]>([]);
  const [horasTrabalhadas, setHorasTrabalhadas] = useState("00:00");

  useEffect(() => {
    const total = calcularHorasTrabalhadas(registros);
    setHorasTrabalhadas(total);
  }, [registros]);

  const adicionarPonto = (tipo: Ponto["tipo"], iso?: string) => {
    const now = iso ? new Date(iso) : new Date();
    const horario = now.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const novo: Ponto = { tipo, horario, datahoraIso: now.toISOString() };
    setRegistros((prev) => [novo, ...prev]);
  };

  const setRegistrosDoDia = (pontos: Ponto[]) => {
    setRegistros(pontos);
  };

  return { registros, adicionarPonto, setRegistrosDoDia, horasTrabalhadas };
};

function parseTimestampFromPonto(p: Ponto): Date | null {
  if (p.datahoraIso) return new Date(p.datahoraIso);

  const match = p.horario.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
  if (!match) return null;

  const hour = Number(match[1]);
  const minute = Number(match[2]);
  const second = match[3] ? Number(match[3]) : 0;

  const d = new Date();
  d.setHours(hour, minute, second, 0);
  return d;
}

function calcularHorasTrabalhadas(pontos: Ponto[]): string {
  if (pontos.length === 0) return "00:00";


  const cronologico = [...pontos].slice().reverse();

  let totalMs = 0;
  let ultimaEntrada: Date | null = null;

  for (const p of cronologico) {
    const dt = parseTimestampFromPonto(p);
    if (!dt) continue;

    const tipoNorm = p.tipo.toLowerCase().replace("á", "a");

    if (tipoNorm.includes("entrada")) {
      ultimaEntrada = dt;
    } else if ((tipoNorm.includes("saida") || tipoNorm.includes("pausa")) && ultimaEntrada) {
      totalMs += dt.getTime() - ultimaEntrada.getTime();
      ultimaEntrada = null;
    }
  }

  if (ultimaEntrada) {
    totalMs += new Date().getTime() - ultimaEntrada.getTime();
  }

  if (totalMs <= 0) return "00:00";

  const totalMin = Math.floor(totalMs / 60000);
  const h = String(Math.floor(totalMin / 60)).padStart(2, "0");
  const m = String(totalMin % 60).padStart(2, "0");
  return `${h}:${m}`;
}
