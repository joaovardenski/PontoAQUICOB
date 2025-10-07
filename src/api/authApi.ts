// utils/auth.ts
import axiosPrivate from "./axiosPrivate";

export const logout = async () => {
  try {
    await axiosPrivate.post("/logout");

    localStorage.removeItem("auth_token");

    window.location.href = "/";
  } catch (error) {
    console.error("Erro ao deslogar:", error);
    localStorage.removeItem("auth_token");
    window.location.href = "/";
  }
};
