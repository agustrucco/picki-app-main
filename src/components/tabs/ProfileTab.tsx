import { useState, useEffect, useRef } from "react";
import { User, MapPin, Award, Heart, Star, LogOut, Sparkles, X, Bot, Activity, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const placesVisited = [
  { name: "La Trattoria", visits: 5 },
  { name: "Green Fit", visits: 3 },
  { name: "Sushi Safe", visits: 2 },
];

const badges = [
  { emoji: "🥇", label: "Explorador" },
  { emoji: "🛡️", label: "Verificador" },
  { emoji: "⭐", label: "Reseñador" },
  { emoji: "💚", label: "Comunidad" },
  { emoji: "🔥", label: "Streak 7 días" },
  { emoji: "🎯", label: "Precisión" },
];

const favorites = [
  { name: "Pizza Sin TACC", place: "La Trattoria" },
  { name: "Bowl Energía", place: "Green Fit" },
];

export default function ProfileTab() {
  // Estados para simular el chat de la IA
  const [showAI, setShowAI] = useState(false);
  const [messages, setMessages] = useState<{text: string}[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll del chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, showResult]);

  const handleLogout = () => {
    localStorage.clear(); // Borra la memoria de la sesión y el onboarding
    window.location.reload(); // Recarga la app para volver a leer el estado inicial (Onboarding)
  };

  // Función para iniciar la secuencia simulada del bot
  const startAIChat = () => {
    setShowAI(true);
    setMessages([]);
    setShowResult(false);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setMessages([{ text: 'Hola. Soy Picki AI 🤖. Estoy analizando tu perfil y cruzando tus datos clínicos con los menús verificados...' }]);
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          setShowResult(true);
        }, 2500);
      }, 1500);
    }, 1500);
  };

  return (
    <div className="pb-24 px-5 pt-5">
      {/* User card */}
      <div className="bg-card rounded-2xl p-5 shadow-sm mb-6 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
          <User className="w-7 h-7 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">María García</h2>
          <p className="text-sm text-muted-foreground">Celíaca · Sin lácteos</p>
        </div>
      </div>

      {/* Botón IA - Escaneo Clínico */}
      <button onClick={startAIChat} className="w-full mb-8 bg-gradient-to-r from-violet-600 to-indigo-600 p-4 rounded-3xl shadow-lg shadow-indigo-500/30 flex items-center justify-between text-white hover:scale-[1.02] active:scale-[0.98] transition-all">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-xl">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="text-left">
            <h3 className="font-bold text-base">Escaneo Clínico AI</h3>
            <p className="text-[11px] text-indigo-100 font-medium">Descubre qué platos son seguros hoy</p>
          </div>
        </div>
        <div className="bg-white/20 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wider">
          NUEVO
        </div>
      </button>

      {/* Places visited */}
      <h3 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
        <MapPin className="w-5 h-5 text-secondary" />
        Lugares visitados
      </h3>
      <div className="flex flex-col gap-2 mb-6">
        {placesVisited.map((p) => (
          <div key={p.name} className="bg-card rounded-xl p-3.5 shadow-sm flex justify-between items-center">
            <span className="text-sm font-medium text-foreground">{p.name}</span>
            <span className="text-xs text-muted-foreground">{p.visits} visitas</span>
          </div>
        ))}
      </div>

      {/* Badges */}
      <h3 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
        <Award className="w-5 h-5 text-amber" />
        Insignias y Recompensas
      </h3>
      <div className="grid grid-cols-3 gap-3 mb-6">
        {badges.map((b) => (
          <div key={b.label} className="bg-card rounded-xl p-3 shadow-sm flex flex-col items-center gap-1.5">
            <span className="text-2xl">{b.emoji}</span>
            <span className="text-xs font-medium text-foreground text-center">{b.label}</span>
          </div>
        ))}
      </div>

      {/* Favorites */}
      <h3 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
        <Heart className="w-5 h-5 text-destructive" />
        Favoritos
      </h3>
      <div className="flex flex-col gap-2">
        {favorites.map((f) => (
          <div key={f.name} className="bg-card rounded-xl p-3.5 shadow-sm flex items-center gap-3">
            <Star className="w-4 h-4 text-amber fill-current" />
            <div>
              <p className="text-sm font-medium text-foreground">{f.name}</p>
              <p className="text-xs text-muted-foreground">{f.place}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Botón de Cerrar Sesión */}
      <button 
        onClick={handleLogout}
        className="w-full mt-8 py-4 bg-red-50 text-red-600 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-red-100 active:scale-[0.98] transition-all"
      >
        <LogOut className="w-5 h-5" />
        Cerrar sesión y reiniciar
      </button>

      {/* MODAL DE CHAT IA FLOTANTE */}
      <AnimatePresence>
        {showAI && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[5000] bg-slate-50 flex flex-col"
          >
            {/* Header del Chat */}
            <div className="bg-white px-5 py-4 border-b border-slate-100 flex items-center justify-between shadow-sm pb-[max(1rem,env(safe-area-inset-top))]">
              <div className="flex items-center gap-3">
                <div className="bg-violet-100 p-2 rounded-xl text-violet-600">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 leading-tight">Picki AI</h3>
                  <p className="text-[10px] font-medium text-violet-600 flex items-center gap-1">
                    <Activity className="w-3 h-3" /> Escaneo Clínico Activo
                  </p>
                </div>
              </div>
              <button onClick={() => setShowAI(false)} className="p-2 rounded-full bg-slate-100 text-slate-500 active:scale-95">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cuerpo del Chat */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {messages.map((msg, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, scale: 0.9, originX: 0 }} animate={{ opacity: 1, scale: 1 }} className="flex gap-3 max-w-[85%]">
                  <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center flex-shrink-0 mt-1"><Bot className="w-4 h-4 text-white" /></div>
                  <div className="bg-white p-3.5 rounded-2xl rounded-tl-sm shadow-sm border border-slate-100 text-sm text-slate-700 leading-relaxed">{msg.text}</div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 max-w-[85%]">
                  <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center flex-shrink-0 mt-1"><Bot className="w-4 h-4 text-white" /></div>
                  <div className="bg-white px-4 py-3.5 rounded-2xl rounded-tl-sm shadow-sm border border-slate-100 flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></span>
                    <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                  </div>
                </motion.div>
              )}

              {showResult && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6 bg-white border-2 border-violet-100 rounded-3xl p-5 shadow-xl shadow-violet-500/10">
                  <div className="flex items-center gap-2 mb-4">
                    <ShieldCheck className="w-6 h-6 text-[#009688]" />
                    <h4 className="font-black text-slate-800 text-lg">Pasaporte Clínico</h4>
                  </div>
                  <div className="flex gap-2 mb-5">
                    <span className="bg-rose-50 text-rose-600 text-[10px] font-bold px-2 py-1 rounded-md">Celíaca</span>
                    <span className="bg-amber-50 text-amber-600 text-[10px] font-bold px-2 py-1 rounded-md">Sin Lácteos</span>
                  </div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Platos 100% Seguros recomendados:</p>
                  <div className="space-y-3">
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      <h5 className="font-bold text-sm text-slate-800">Sorrentinos Sin TACC</h5><p className="text-xs text-slate-500 mb-2">Sintaxis Palermo</p><button className="w-full py-2 bg-violet-600 text-white text-xs font-bold rounded-xl active:scale-95 transition-all">Pedir ahora</button>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      <h5 className="font-bold text-sm text-slate-800">Pizza Vegana (Masa madre)</h5><p className="text-xs text-slate-500 mb-2">Vegan & Safe</p><button className="w-full py-2 bg-violet-600 text-white text-xs font-bold rounded-xl active:scale-95 transition-all">Pedir ahora</button>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={chatEndRef} className="pb-8" />
            </div>

            {/* Input Fake */}
            <div className="p-4 bg-white border-t border-slate-100 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
              <div className="bg-slate-50 rounded-2xl py-3.5 px-5 text-sm text-slate-400 border border-slate-200 font-medium">
                {isTyping ? "La IA está escribiendo..." : "Análisis finalizado."}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
