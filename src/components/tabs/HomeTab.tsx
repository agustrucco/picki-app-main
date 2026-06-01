import { useState, useEffect, useRef } from "react";
import { Timer, Rocket, ChevronRight, Search, MapPin, Bell, UtensilsCrossed, ShoppingBag, Star, ShieldCheck, Sparkles, Bot, CheckCircle2, Coffee, Beer, IceCream, CakeSlice, MoreHorizontal, MessageCircle, X, Send, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MOCK_RESTAURANTS } from "@/data/mockRestaurants";

interface HomeTabProps {
  onSwitchMode?: () => void;
}

export default function HomeTab({ onSwitchMode }: HomeTabProps) {
  // --- LECTURA DE DATOS DEL ONBOARDING (SIMULACIÓN PARA EL MVP) ---
  // Lee de localStorage, o usa valores por defecto si está vacío
  const userName = localStorage.getItem("picki_user_name") || "Agustín";
  const userDiet = localStorage.getItem("picki_user_diet") || "Libre de Gluten";

  // --- ESTADOS PARA EL BUSCADOR SEMÁNTICO IA ---
  const [aiPrompt, setAiPrompt] = useState("");
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [showAiSuccess, setShowAiSuccess] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Referencia para limitar el área de arrastre del botón del bot
  const dragConstraintsRef = useRef<HTMLDivElement>(null);

  const triggerAISearch = () => {
    if (!aiPrompt) return;
    setIsAiSearching(true);
    setTimeout(() => {
      setIsAiSearching(false);
      setShowAiSuccess(true);
      setTimeout(() => setShowAiSuccess(false), 4000);
    }, 2500);
  };

  // Filtramos la base de datos falsa según la dieta elegida
  const recommendedRestaurants = MOCK_RESTAURANTS.filter((r) => {
    const typeLower = r.type.toLowerCase();
    if (userDiet === "Libre de Gluten") return typeLower.includes("gluten") || typeLower.includes("tacc");
    if (userDiet === "Vegano") return typeLower.includes("vegan") || typeLower.includes("plant based");
    if (userDiet === "Kosher") return typeLower.includes("kosher");
    return true; // Si es otra dieta, mostramos todo
  });

  const carouselItems = recommendedRestaurants.length > 0 ? recommendedRestaurants.slice(0, 5) : MOCK_RESTAURANTS.slice(0, 5);
  const listItems = MOCK_RESTAURANTS.filter(r => !carouselItems.find(c => c.id === r.id)); // El resto para la lista vertical

  // --- 1. CONFIGURACIÓN DEL DEMO DAY (LA LÓGICA) ---
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
        // Cálculo preciso: 1000ms * 60s * 60m * 24h
        const dayInMs = 1000 * 60 * 60 * 24;
        const monthInMs = dayInMs * 30.44;

        setTimeLeft({
          meses: Math.floor(difference / monthInMs),
          dias: Math.floor((difference % monthInMs) / dayInMs),
          horas: Math.floor((difference % dayInMs) / (1000 * 60 * 60)),
          minutos: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          segundos: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
      }

      if (difference <= 0) {
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  // MOCK DE NOTIFICACIONES (Estratégico para PM)
  const notifications = [
    { id: 1, title: "Cupón 20% OFF 🎟️", desc: `En tu próximo pedido en un lugar con certificación para dieta ${userDiet}.`, time: "Hace 2 horas", unread: true, action: "Usar cupón" },
    { id: 2, title: "Promoción exclusiva 🍕", desc: "2x1 en pizzas seguras en 'Sintaxis' esta noche. Verificado por Picki.", time: "Hace 5 horas", unread: true, action: "Ver promo" },
    { id: 3, title: "Certificación renovada 🛡️", desc: "La Trattoria aprobó su nuevo control de contaminación cruzada.", time: "Ayer", unread: false, action: "" }
  ];

  return (
    // Usamos bg-slate-50 para que el fondo no sea blanco puro y los banners resalten
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans relative select-none">
      
      {/* Contenedor invisible para establecer los límites del arrastre en toda la pantalla */}
      <div ref={dragConstraintsRef} className="fixed inset-0 pointer-events-none z-0" />

      {/* --- 2. HEADER: DIRECCIÓN Y NOTIFICACIONES (LO QUE TENÍAS) --- */}
      {/* pt-[calc(env(safe-area-inset-top)+1rem)] asegura que el contenido no quede debajo del notch en móviles */}
      <div className="sticky top-0 flex items-center justify-between px-6 pb-4 pt-[calc(env(safe-area-inset-top)+1rem)] bg-white/80 backdrop-blur-md shadow-sm z-[100]">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">ENTREGAR EN</span>
          <div className="flex items-center gap-1.5 cursor-pointer">
            <MapPin className="w-4 h-4 text-[#009688]" />
            <span className="font-bold text-slate-800 text-sm">Tu dirección actual</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>
        </div>
        <button onClick={() => setShowNotifications(true)} className="relative p-2.5 rounded-full bg-slate-100 text-slate-500 active:bg-slate-200 active:scale-90 transition-all">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-slate-100"></span>
        </button>
      </div>

      {/* --- 3. ÁREA SCROLLEABLE DE CONTENIDO --- */}
      {/* pb-safe evita que el contenido quede detrás de la barra de navegación del sistema móvil */}
      <div className="pb-[calc(env(safe-area-inset-bottom)+8rem)]">
        
        {/* 🚀 BUSCADOR SEMÁNTICO IA */}
        <div className="px-6 mt-6">
          <div className="relative p-[2px] rounded-2xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-[#009688] shadow-lg shadow-violet-500/20 transition-all focus-within:scale-[1.02]">
            <div className="flex items-center gap-3 bg-white px-5 py-3.5 rounded-[14px]">
              <Sparkles className="w-5 h-5 text-violet-500" />
              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && triggerAISearch()}
                placeholder="Ej: Antojo de pastas, pero sin TACC..."
                className="flex-1 bg-transparent text-sm font-medium outline-none text-slate-700 placeholder:text-slate-400"
              />
              <button onClick={triggerAISearch} className="bg-violet-100 active:bg-violet-200 px-3 py-1.5 rounded-lg text-violet-700 font-bold text-xs flex items-center gap-1 transition-all active:scale-95">
                Buscar
              </button>
            </div>
          </div>
        </div>

        {/* 🚀 BANNER DEMO DAY PICKI (LO NUEVO) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mx-6 mt-6 p-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-lg shadow-slate-900/20 border border-white/10 relative overflow-hidden"
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
            <div className="bg-white/5 px-2 py-1 rounded-md border border-white/10">
              <span className="text-[9px] font-bold text-[#009688]">7 NOV • 11:00 AM</span>
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

        {/* 🤖 AI INSIGHT: RECOMENDACIÓN DEL DÍA */}
        <div className="px-6 mt-8">
          <div className="bg-white p-5 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-violet-600" />
                </div>
                <span className="text-[10px] font-black text-violet-600 uppercase tracking-widest">Picki AI Insight</span>
              </div>
              <span className="bg-amber-100 text-amber-700 text-[9px] font-black px-2 py-0.5 rounded-full uppercase">Tip de Seguridad</span>
            </div>
            <p className="text-sm font-bold text-slate-800 leading-tight">
              "Hoy hay alta humedad. Si vas a <span className="text-[#009688]">Sintaxis</span>, recuerda que su protocolo de secado de utensilios es el mejor para evitar contaminación cruzada aérea."
            </p>
            <div className="mt-3 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
              <span className="text-[10px] font-bold text-slate-400 italic">Basado en tu perfil de {userDiet}</span>
            </div>
          </div>
        </div>

        {/* --- 4. BANNER VERDE "COMER SEGURO" (LO QUE TENÍAS) --- */}
        <div className="px-6 mt-8">
          <div className="bg-[#509688] p-6 rounded-[32px] relative overflow-hidden flex items-center justify-between shadow-xl shadow-[#509688]/30">
            {/* Patrón de fondo (simulado con opacidad) */}
            <div className="absolute inset-0 opacity-10 flex items-center justify-center">
              <div className="w-full h-full scale-150 rotate-12" style={{ backgroundImage: 'radial-gradient(#ffffff 2px, transparent 2px)', backgroundSize: '20px 20px' }}></div>
            </div>
            
            <div className="max-w-[70%] relative z-10">
              <h3 className="text-2xl font-black text-white tracking-tight leading-tight">Comer seguro</h3>
              <p className="text-white/80 text-xs font-semibold mt-1.5">Explora restaurantes con certificación Picki.</p>
            </div>
            {/* Icono de bolsa de fondo (simulado con Lucide) */}
            <div className="absolute -right-8 -bottom-8 p-12 bg-white/10 rounded-full">
              <ShoppingBag className="w-20 h-20 text-white/40 rotate-12" />
            </div>
          </div>
        </div>

        {/* BIENVENIDA A AGUSTÍN (LO NUEVO QUE SUMAMOS) */}
        <div className="px-8 mt-8">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-tight">
            ¡Hola, {userName}! 👋
          </h2>
          <p className="text-slate-400 text-sm font-medium">Estamos a tiempo de cambiar el mundo.</p>
        </div>

        {/* --- 5. SECCIÓN CATEGORÍAS (LO QUE TENÍAS) --- */}
        <div className="px-6 mt-10">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-bold text-slate-900">Categorías</h4>
            <button className="flex items-center gap-1 text-[11px] font-bold text-[#009688]">
              Ver todas <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Restaurante", icon: UtensilsCrossed, color: "bg-[#009688]/10 text-[#009688]" },
              { label: "Cafetería", icon: Coffee, color: "bg-orange-50 text-orange-600" },
              { label: "Bar", icon: Beer, color: "bg-amber-50 text-amber-600" },
              { label: "Heladería", icon: IceCream, color: "bg-pink-50 text-pink-600" },
              { label: "Pastelería", icon: CakeSlice, color: "bg-purple-50 text-purple-600" },
              { label: "Otro", icon: MoreHorizontal, color: "bg-slate-100 text-slate-500" },
            ].map((cat, i) => (
              <div key={i} className="bg-white p-4 rounded-3xl border border-slate-100 flex items-center justify-center gap-3 shadow-sm active:scale-95 transition-all cursor-pointer h-16">
                <div className={`p-2 rounded-xl ${cat.color} flex-shrink-0`}>
                  <cat.icon className="w-5 h-5" />
                </div>
                <span className="font-bold text-sm text-slate-800">
                  {cat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* --- 6. RESTAURANTES RECOMENDADOS (CARRUSEL HORIZONTAL) --- */}
        <div className="mt-10 pl-6">
          <div className="flex items-center justify-between pr-6 mb-4">
            <div className="flex flex-col">
              <h4 className="text-lg font-bold text-slate-900">Recomendados para ti</h4>
              <span className="text-xs font-bold text-violet-600 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> AI Match Clínico
              </span>
            </div>
            <button className="flex items-center gap-1 text-[11px] font-bold text-[#009688]">
              Ver más <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 pr-6 snap-x [&::-webkit-scrollbar]:hidden">
            {carouselItems.map((restaurant) => (
              <div key={restaurant.id} className="min-w-[240px] bg-white rounded-3xl p-3 border border-slate-100 shadow-sm snap-start">
                <div className="relative">
                  <img src={restaurant.image} alt={restaurant.name} className="w-full h-32 object-cover rounded-2xl mb-3" />
                  
                  {/* ✨ BADGE DE AI MATCH */}
                  <div className="absolute top-2 left-2 bg-violet-600/95 backdrop-blur-sm px-2 py-1.5 rounded-lg flex items-center gap-1 shadow-md border border-white/10 z-10">
                    <Sparkles className="w-3 h-3 text-violet-100" />
                    <span className="text-[10px] font-black text-white tracking-wide">
                      {99 - (restaurant.id % 4)}% SEGURO
                    </span>
                  </div>

                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span className="text-[10px] font-bold text-slate-700">{restaurant.rating}</span>
                  </div>
                </div>
                <h3 className="font-bold text-slate-900 text-base leading-tight mb-1">{restaurant.name}</h3>
                <div className="flex items-center gap-1.5 text-[#009688]">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-xs font-bold">{restaurant.type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- 7. TODOS LOS RESTAURANTES (LISTA VERTICAL) --- */}
        <div className="px-6 mt-6 pb-8">
          <h4 className="text-lg font-bold text-slate-900 mb-4">Cerca tuyo</h4>
          <div className="flex flex-col gap-4">
            {listItems.map((restaurant) => (
              <div key={restaurant.id} className="bg-white rounded-2xl p-3 shadow-sm border border-slate-100 flex gap-4">
                <img src={restaurant.image} alt={restaurant.name} className="w-24 h-24 rounded-xl object-cover" />
                <div className="flex-1 py-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-slate-900 leading-tight">{restaurant.name}</h3>
                    <div className="flex items-center gap-1 bg-amber-50 px-1.5 py-0.5 rounded text-amber-600">
                      <Star className="w-3 h-3 fill-current" />
                      <span className="text-[10px] font-bold">{restaurant.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[#009688] mb-2">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span className="text-xs font-bold">{restaurant.type}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium">A {(Math.random() * 5 + 0.5).toFixed(1)} km de tu ubicación</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- OVERLAY ANIMADO DEL BUSCADOR IA --- */}
      <AnimatePresence>
        {isAiSearching && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[6000] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center px-6">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white p-6 rounded-3xl shadow-2xl max-w-sm w-full flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mb-4 relative">
                <Bot className="w-8 h-8 text-violet-600 relative z-10" />
                <div className="absolute inset-0 border-4 border-violet-400 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2 tracking-tight">Picki AI procesando...</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                Analizando las cartas de 120 restaurantes y cruzando ingredientes con tu perfil clínico y requerimientos.
              </p>
            </motion.div>
          </motion.div>
        )}

        {showAiSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -50 }} 
            className="fixed top-12 left-6 right-6 z-[6000] bg-emerald-500 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-3"
          >
            <CheckCircle2 className="w-6 h-6 flex-shrink-0 text-emerald-100" />
            <p className="text-sm font-bold leading-tight text-white">
              ¡Match encontrado! Se filtraron los resultados para asegurar que sean 100% seguros para ti.
            </p>
          </motion.div>
        )}

        {/* --- MODAL DE NOTIFICACIONES --- */}
        {showNotifications && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNotifications(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[6000]"
            />
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-slate-50 z-[6001] shadow-2xl flex flex-col"
            >
              <div className="pt-[calc(env(safe-area-inset-top)+1rem)] px-6 pb-4 bg-white border-b border-slate-100 flex items-center justify-between shadow-sm shrink-0">
                <div>
                  <h3 className="font-black text-slate-900 text-lg">Notificaciones</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Novedades y Ofertas</p>
                </div>
                <button onClick={() => setShowNotifications(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors active:scale-95 text-slate-500">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                {notifications.map(notif => (
                  <div key={notif.id} className={`bg-white p-4 rounded-2xl border ${notif.unread ? 'border-violet-200 shadow-md shadow-violet-500/5' : 'border-slate-100 shadow-sm'} relative overflow-hidden`}>
                    {notif.unread && <div className="absolute top-0 left-0 bottom-0 w-1 bg-violet-500" />}
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-sm text-slate-900 leading-tight">{notif.title}</h4>
                      <span className="text-[10px] font-medium text-slate-400">{notif.time}</span>
                    </div>
                    <p className="text-xs text-slate-600 mb-3 leading-relaxed">{notif.desc}</p>
                    {notif.action && (
                      <button className="text-[11px] font-bold text-violet-600 bg-violet-50 px-3 py-1.5 rounded-lg active:scale-95 transition-all">{notif.action}</button>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- 🤖 AGENTE PICKI: CHATBOT FLOTANTE ARRASTRABLE --- */}
      <motion.button
        drag
        dragConstraints={dragConstraintsRef}
        dragMomentum={false}
        dragElastic={0.1}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          if (onSwitchMode) onSwitchMode();
        }}
        className="fixed bottom-32 right-6 z-[5000] w-14 h-14 bg-slate-900 rounded-full shadow-2xl flex items-center justify-center group cursor-grab active:cursor-grabbing"
      >
        {/* Efecto de pulso para indicar que es IA viva (Añadido pointer-events-none para no interferir con el Drag) */}
        <div className="absolute inset-0 rounded-full bg-slate-900 animate-ping opacity-20 group-hover:opacity-0 transition-opacity pointer-events-none" />
        <Bot className="w-6 h-6 text-white relative z-10 pointer-events-none" />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#009688] rounded-full border-2 border-white flex items-center justify-center pointer-events-none">
          <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
        </div>
      </motion.button>

    </div>
  );
}