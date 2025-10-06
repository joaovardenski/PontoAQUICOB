import { useState, useEffect } from "react";

export interface Ponto {
  horario: string;
  tipo: "Entrada" | "Saida" | "Pausa";
}

export const usePontos = () => {
  const [registros, setRegistros] = useState<Ponto[]>([]);
  const [horasTrabalhadas, setHorasTrabalhadas] = useState("00:00");

  useEffect(() => {
    const total = calcularHorasTrabalhadas(registros);
    setHorasTrabalhadas(total);
  }, [registros]);

  const adicionarPonto = (tipo: Ponto["tipo"]) => {
    const novo = { tipo, horario: new Date().toLocaleTimeString() };
    setRegistros([novo, ...registros]);
  };

  return { registros, adicionarPonto, horasTrabalhadas };
};

const calcularHorasTrabalhadas = (pontos: Ponto[]): string => {
  let totalMs = 0;
  let ultimaEntrada: Date | null = null;

  pontos.slice().reverse().forEach((p) => {
    const match = p.horario.match(/(\d{1,2}):(\d{2}):(\d{2})/);
    if (!match) return;
    const [_, h, m, s] = match.map(Number);
    const data = new Date();
    data.setHours(h, m, s, 0);

    if (p.tipo === "Entrada") ultimaEntrada = data;
    else if ((p.tipo === "Saida" || p.tipo === "Pausa") && ultimaEntrada) {
      totalMs += data.getTime() - ultimaEntrada.getTime();
      ultimaEntrada = null;
    }
  });

  if (totalMs <= 0) return "00:00";
  const totalSeg = Math.floor(totalMs / 1000);
  const h = String(Math.floor(totalSeg / 3600)).padStart(2, "0");
  const m = String(Math.floor((totalSeg % 3600) / 60)).padStart(2, "0");
  return `${h}:${m}`;
};
