import { useState, useEffect, useRef } from "react";
import { User, MapPin, Award, Heart, Star, LogOut, Sparkles, X, Bot, Activity, ShieldCheck, Rocket, ChevronRight, CheckCircle2, Crown } from "lucide-react";
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
  // Leemos los datos del usuario guardados en la memoria local
  const userName = localStorage.getItem("picki_user_name") || "Agustín";
  const userDiet = localStorage.getItem("picki_user_diet") || "Libre de Gluten";
  
  // Estado para saber si el usuario es Premium
  const [isPremium, setIsPremium] = useState(localStorage.getItem("picki_user_premium") === "true");
  const [showSuccess, setShowSuccess] = useState(false);

  // Generamos un Avatar dinámico usando el nombre del usuario y el color verde principal de Picki
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=009688&color=fff&size=150&rounded=true&bold=true`;
  const botAvatarUrl = "https://api.dicebear.com/7.x/bottts/svg?seed=Picki&backgroundColor=7c3aed";

  // Estados para simular el chat de la IA
  const [showAI, setShowAI] = useState(false);
  const [messages, setMessages] = useState<{text: string}[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll del chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, showResult]);

  // --- LÓGICA DEL COUNTDOWN (MOVIDO DEL HOME) ---
  const targetDate = new Date("2026-11-07T11:00:00").getTime(); 
  
  const [timeLeft, setTimeLeft] = useState({
    meses: 0, dias: 0, horas: 0, minutos: 0, segundos: 0
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const dayInMs = 1000 * 60 * 60 * 24;
      const monthInMs = dayInMs * 30.44;
      
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          meses: Math.floor(difference / monthInMs),
          dias: Math.floor((difference % monthInMs) / dayInMs),
          horas: Math.floor((difference % dayInMs) / (1000 * 60 * 60)),
          minutos: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          segundos: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const handleLogout = () => {
    localStorage.clear(); // Borra la memoria de la sesión y el onboarding
    window.location.reload(); // Recarga la app para volver a leer el estado inicial (Onboarding)
  };

  // Función para simular la suscripción
  const handleSubscribe = () => {
    setShowUpgrade(false);
    setIsPremium(true);
    localStorage.setItem("picki_user_premium", "true");
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 2500);
  };

  // Función para simular la cancelación de la suscripción (Revertir a Free)
  const handleUnsubscribe = () => {
    setIsPremium(false);
    localStorage.setItem("picki_user_premium", "false");
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
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src={avatarUrl} alt={userName} className="w-14 h-14 rounded-full shadow-md border-2 border-white object-cover" />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 leading-none">{userName}</h2>
              {isPremium ? (
                <span className="bg-gradient-to-r from-orange-400 to-amber-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-0.5 shadow-sm shadow-orange-500/30">
                  <Crown className="w-2.5 h-2.5" /> Premium
                </span>
              ) : (
                <span className="bg-slate-100 text-slate-500 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">Free</span>
              )}
            </div>
            <p className="text-sm font-medium text-slate-500 mt-1">{userDiet}</p>
          </div>
        </div>
      </div>

      {/* UPGRADE BANNER */}
      {!isPremium ? (
        <div className="mb-8 p-5 bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl shadow-lg shadow-orange-500/20 relative overflow-hidden">
          {/* Decoración de fondo */}
          <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/20 blur-2xl rounded-full pointer-events-none" />
          <div className="relative z-10 flex justify-between items-center">
            <div>
              <span className="text-orange-100 text-[10px] font-black uppercase tracking-widest mb-1 block">Picki Premium</span>
              <h3 className="text-xl font-black text-white leading-tight">Mejora tu <br/>experiencia</h3>
            </div>
            <button onClick={() => setShowUpgrade(true)} className="bg-white text-orange-500 font-bold px-4 py-2.5 rounded-xl shadow-sm active:scale-95 transition-all flex items-center gap-1 text-sm">
              Conoce más <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-8 p-5 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl shadow-lg shadow-slate-900/20 border border-slate-700 relative overflow-hidden">
          {/* Decoración de fondo */}
          <div className="absolute -right-4 -top-4 w-32 h-32 bg-orange-500/10 blur-2xl rounded-full pointer-events-none" />
          <div className="relative z-10 flex justify-between items-center">
            <div>
              <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1 block">Tu Plan Actual</span>
              <h3 className="text-xl font-black text-white leading-tight flex items-center gap-1.5">
                Picki <span className="text-orange-500">Premium</span>
              </h3>
            </div>
            <button onClick={handleUnsubscribe} className="bg-slate-700/50 hover:bg-slate-700 text-slate-300 font-bold px-4 py-2.5 rounded-xl border border-slate-600 active:scale-95 transition-all text-xs">
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* 🚀 BANNER DEMO DAY PICKI (MOVIDO DEL HOME) */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mb-8 p-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl shadow-lg shadow-slate-900/20 border border-white/10 relative overflow-hidden"
      >
        {/* Decoración de fondo */}
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#009688] opacity-30 blur-3xl rounded-full" />
        
        <div className="flex items-center justify-between mb-3 relative z-10">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-tr from-[#009688] to-emerald-400 p-1.5 rounded-lg shadow-lg shadow-[#009688]/40">
              <Rocket className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] block">Countdown</span>
              <span className="text-xs font-bold text-white uppercase">DEMO DAY MVP</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-1.5 relative z-10">
          {[
            { label: "Mes", val: timeLeft.meses },
            { label: "Días", val: timeLeft.dias },
            { label: "Hs", val: timeLeft.horas },
            { label: "Min", val: timeLeft.minutos },
            { label: "Seg", val: timeLeft.segundos },
          ].map((item, i) => (
            <div key={i} className="bg-white/5 backdrop-blur-sm rounded-xl py-2 border border-white/5 flex flex-col items-center">
              <span className="text-lg font-black text-white tabular-nums tracking-tighter leading-none mb-0.5">
                {String(item.val).padStart(2, '0')}
              </span>
              <span className="text-[7px] font-black text-[#009688] uppercase tracking-[0.2em]">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

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
                <img src={botAvatarUrl} alt="Picki Agent" className="w-10 h-10 rounded-xl shadow-sm border border-slate-100 object-cover" />
                <div>
                  <h3 className="font-bold text-slate-900 leading-tight">Picki AI</h3>
                  <p className="text-[10px] font-medium text-violet-600 flex items-center gap-1">
                    <Activity className="w-3 h-3" /> Escaneo Clínico
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
                  <img src={botAvatarUrl} alt="Picki" className="w-8 h-8 rounded-full shadow-sm border border-slate-100 flex-shrink-0 mt-1 object-cover" />
                  <div className="bg-white p-3.5 rounded-2xl rounded-tl-sm shadow-sm border border-slate-100 text-sm text-slate-700 leading-relaxed">{msg.text}</div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 max-w-[85%]">
                  <img src={botAvatarUrl} alt="Picki" className="w-8 h-8 rounded-full shadow-sm border border-slate-100 flex-shrink-0 mt-1 object-cover" />
                  <div className="bg-white px-4 py-4 rounded-2xl rounded-tl-sm shadow-sm border border-slate-100 flex items-center gap-1.5 h-[48px]">
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

        {/* MODAL DE UPGRADE */}
        {showUpgrade && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowUpgrade(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[6000]"
            />
            <motion.div
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 max-h-[90vh] bg-slate-50 z-[6001] rounded-t-[32px] shadow-2xl flex flex-col overflow-hidden"
            >
              <div className="p-6 bg-white border-b border-slate-100 shrink-0 relative flex items-center justify-between">
                <div>
                  <h3 className="font-black text-2xl text-slate-900 leading-tight">Picki <span className="text-orange-500">Premium</span></h3>
                  <p className="text-sm font-medium text-slate-500 mt-1">Comer seguro sin límites</p>
                </div>
                <button onClick={() => setShowUpgrade(false)} className="p-2 bg-slate-100 rounded-full text-slate-500 active:scale-95 transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Plan Free */}
                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm relative">
                  <h4 className="font-black text-lg text-slate-800 mb-1">Plan Free (Actual)</h4>
                  <span className="font-bold text-slate-400 text-sm block mb-4">$0 / mes</span>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2 text-sm text-slate-600 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      Explorar restaurantes cercanos y hacer pedidos.
                    </li>
                    <li className="flex items-start gap-2 text-sm text-slate-600 font-medium opacity-50">
                      <X className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      Agente IA avanzado en tiempo real.
                    </li>
                    <li className="flex items-start gap-2 text-sm text-slate-600 font-medium opacity-50">
                      <X className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      Localizador nacional y base de datos ampliada.
                    </li>
                    <li className="flex items-start gap-2 text-sm text-slate-600 font-medium opacity-50">
                      <X className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      Sin publicidad, reseñas extendidas y foros.
                    </li>
                  </ul>
                </div>

                {/* Plan Premium */}
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-5 rounded-3xl border-2 border-orange-400 shadow-lg shadow-orange-500/10 relative">
                  <div className="absolute -top-3 right-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
                    Recomendado
                  </div>
                  <h4 className="font-black text-lg text-orange-600 mb-1">Premium</h4>
                  <span className="font-black text-slate-900 text-xl block mb-4">$4.500 <span className="text-sm font-bold text-slate-500">/ mes</span></span>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2 text-sm text-slate-700 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                      <strong>Localizador Nacional:</strong> Encuentra lugares seguros en cualquier punto del país.
                    </li>
                    <li className="flex items-start gap-2 text-sm text-slate-700 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                      <strong>Agente IA Ilimitado:</strong> Asistencia personalizada para planificar comidas seguras.
                    </li>
                    <li className="flex items-start gap-2 text-sm text-slate-700 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                      <strong>Base de datos Plus:</strong> Accede a toda la información adicional de nuestra BD.
                    </li>
                    <li className="flex items-start gap-2 text-sm text-slate-700 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                      <strong>Sin Publicidad:</strong> Experiencia fluida y sin anuncios comerciales.
                    </li>
                    <li className="flex items-start gap-2 text-sm text-slate-700 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                      <strong>Comunidad Plus:</strong> Acceso a foros exclusivos, reseñas y comentarios.
                    </li>
                  </ul>

                  <button onClick={handleSubscribe} className="w-full mt-6 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md shadow-orange-500/30">
                    <Crown className="w-5 h-5" /> Suscribirme ahora
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}

        {/* MODAL DE ÉXITO SUSCRIPCIÓN */}
        {showSuccess && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="fixed inset-0 z-[7000] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center px-6"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }} 
                animate={{ scale: 1, y: 0 }} 
                className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full flex flex-col items-center text-center"
              >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">¡Bienvenido a Premium!</h3>
                <p className="text-sm text-slate-500 font-medium">
                  Tu suscripción se ha activado correctamente.
                </p>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
