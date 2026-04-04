import { useState } from "react";
import Onboarding from "@/components/Onboarding";
import AuthScreen from "@/components/AuthScreen";
import MainApp from "@/components/MainApp";

type AppState = "onboarding" | "auth" | "main";

export default function Index() {
  const [state, setState] = useState<AppState>("onboarding");

  if (state === "onboarding") return <Onboarding onComplete={() => setState("auth")} />;
  if (state === "auth") return <AuthScreen onSignIn={() => setState("main")} />;
  return <MainApp />;
}
