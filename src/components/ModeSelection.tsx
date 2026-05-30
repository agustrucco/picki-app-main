import { Store, Bot, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface ModeSelectionProps {
  onComplete: () => void;
}

export default function ModeSelection({ onComplete }: ModeSelectionProps) {
  const userName = localStorage.getItem("picki_user_name") || "Agustín";

  const handleSelectMode = (mode: "classic" | "agent") => {
    localStorage.setItem("picki_app_mode", mode);
    onComplete();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col p-6 font-sans">
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
          <h1 className="text-3xl font-black text-slate-900 mb-2 leading-tight">
            ¡Hola, {userName}!
          </h1>
          <p className="text-slate-500 font-medium">
            Picki está evolucionando. ¿Qué experiencia quieres probar hoy?
          </p>
        </motion.div>

        <div className="flex flex-col gap-4">
          {/* MODO CLÁSICO */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelectMode("classic")}
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4 text-left transition-all"
          >
            <div className="w-14 h-14 bg-[#009688]/10 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Store className="w-7 h-7 text-[#009688]" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900 text-lg">Modo Clásico</h3>
              <p className="text-xs text-slate-500 font-medium mt-1">Explora restaurantes, categorías y promociones como siempre.</p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </motion.button>

          {/* MODO AGENTE */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelectMode("agent")}
            className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-3xl border border-slate-700 shadow-xl shadow-slate-900/20 flex items-center gap-4 text-left transition-all"
          >
            <div className="w-14 h-14 bg-violet-500/20 rounded-2xl flex items-center justify-center flex-shrink-0 border border-violet-500/30">
              <Bot className="w-7 h-7 text-violet-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-white text-lg">Agente IA</h3>
                <span className="bg-violet-600 text-[9px] font-black text-white px-2 py-0.5 rounded-full uppercase tracking-wider">Nuevo</span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Solo dime qué se te antoja y yo encuentro y reservo el lugar 100% seguro para ti.</p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-500" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}