import { useState } from "react";
import Onboarding from "@/components/Onboarding";
import AuthScreen from "@/components/AuthScreen";
import MainApp from "@/components/MainApp";
import B2BDashboard from "./B2BDashboard";
import B2BRegister from "./B2BRegister";

type AppState = "onboarding" | "auth" | "main" | "b2b_auth" | "b2b_register" | "b2b_main";

export default function Index() {
  // 1. Inicializamos leyendo la memoria del navegador. Si no hay nada, arranca en "auth" (Login)
  const [state, setState] = useState<AppState>(() => {
    const storedState = localStorage.getItem("picki_app_state") as AppState;
    // Si ya estaba en una sesión B2B, lo mandamos directo al Dashboard de negocios.
    if (storedState === "b2b_main") return "b2b_main";
    // Si ya estaba en una sesión de cliente, lo mandamos a la app principal.
    if (storedState === "main") return "main";
    // Por defecto, siempre al login de clientes.
    return "auth";
  });

  // 2. Cada vez que cambiamos de pantalla, lo guardamos para siempre.
  const handleSetState = (newState: AppState) => {
    localStorage.setItem("picki_app_state", newState);
    setState(newState);
  };

  if (state === "auth") return <AuthScreen onSignIn={() => handleSetState("onboarding")} onGoToBusiness={() => handleSetState("b2b_register")} onLogin={() => handleSetState("main")} />;
  if (state === "onboarding") return <Onboarding onComplete={() => handleSetState("main")} />;
  if (state === "b2b_register") return <B2BRegister onComplete={() => handleSetState("b2b_main")} onBack={() => handleSetState("auth")} />;
  if (state === "b2b_main") return <B2BDashboard />;

  return <MainApp />;
}
