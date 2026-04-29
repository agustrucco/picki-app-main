import { useState } from "react";
import Onboarding from "@/components/Onboarding";
import AuthScreen from "@/components/AuthScreen";
import MainApp from "@/components/MainApp";

type AppState = "onboarding" | "auth" | "main";

export default function Index() {
  // 1. Inicializamos leyendo la memoria del navegador. Si no hay nada, arranca en "auth" (Login)
  const [state, setState] = useState<AppState>(() => {
    return (localStorage.getItem("picki_app_state") as AppState) || "auth";
  });

  // 2. Cada vez que cambiamos de pantalla, lo guardamos para siempre.
  const handleSetState = (newState: AppState) => {
    localStorage.setItem("picki_app_state", newState);
    setState(newState);
  };

  if (state === "auth") return <AuthScreen onSignIn={() => handleSetState("onboarding")} />;
  if (state === "onboarding") return <Onboarding onComplete={() => handleSetState("main")} />;
  return <MainApp />;
}
