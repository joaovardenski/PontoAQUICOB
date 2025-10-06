import { useEffect, useState } from "react";

export const useClock = () => {
  const [horaAtual, setHoraAtual] = useState(new Date().toLocaleTimeString());
  const [dataAtual, setDataAtual] = useState(
    new Date().toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
  );

  useEffect(() => {
    const REFRESH_INTERVAL = 1000;
    const timer = setInterval(() => {
      const now = new Date();
      setHoraAtual(now.toLocaleTimeString());
      setDataAtual(
        now.toLocaleDateString("pt-BR", {
          weekday: "long",
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
      );
    }, REFRESH_INTERVAL);

    return () => clearInterval(timer);
  }, []);

  return { horaAtual, dataAtual };
};
