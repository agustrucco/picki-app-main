import { useState, useEffect, useRef } from "react";
import { Timer, ChevronRight, Search, MapPin, Bell, UtensilsCrossed, ShoppingBag, Star, ShieldCheck, Sparkles, Bot, CheckCircle2, Coffee, Beer, IceCream, CakeSlice, MoreHorizontal, MessageCircle, X, Send, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MOCK_RESTAURANTS } from "@/data/mockRestaurants";

interface HomeTabProps {
  onSwitchMode?: () => void;
}

// --- MOCK DE PLATOS Y RECETAS ---
const MOCK_RECIPES = [
  {
    id: 1,
    name: "Sorrentinos de Jamón y Queso",
    restaurant: "Sintaxis Palermo",
    type: "100% Libre de Gluten",
    image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&q=80",
    price: "$8.500",
    ingredients: [
      { name: "Masa fresca sin TACC", price: "$2.000" },
      { name: "Jamón cocido natural", price: "$1.500" },
      { name: "Queso mozzarella", price: "$1.800" },
      { name: "Salsa de tomate casera", price: "$1.200" }
    ],
    ingredientsTotal: "$6.500"
  },
  {
    id: 2,
    name: "Pizza Vegana de Masa Madre",
    restaurant: "Vegan & Safe",
    type: "Vegano / Plant Based",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80",
    price: "$9.200",
    ingredients: [
      { name: "Masa madre precocida", price: "$3.000" },
      { name: "Queso de almendras", price: "$2.500" },
      { name: "Salsa de tomate", price: "$1.200" },
      { name: "Albahaca fresca", price: "$500" }
    ],
    ingredientsTotal: "$7.200"
  },
  {
    id: 3,
    name: "Hamburguesa Doble Smash",
    restaurant: "CeliBurger",
    type: "100% Libre de Gluten",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
    price: "$10.500",
    ingredients: [
      { name: "Pan de papa sin TACC", price: "$2.500" },
      { name: "Medallones de carne x2", price: "$4.000" },
      { name: "Queso cheddar", price: "$1.500" },
      { name: "Bacon crujiente", price: "$1.500" }
    ],
    ingredientsTotal: "$9.500"
  },
  {
    id: 4,
    name: "Ensalada Falafel Kosher",
    restaurant: "Jerusalem Deli",
    type: "Kosher Certificado",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80",
    price: "$7.800",
    ingredients: [
      { name: "Falafel certificado", price: "$3.500" },
      { name: "Mix de hojas verdes", price: "$1.000" },
      { name: "Salsa Tahini", price: "$1.200" },
      { name: "Tomates cherry", price: "$800" }
    ],
    ingredientsTotal: "$6.500"
  },
  {
    id: 5,
    name: "Brownie de Chocolate",
    restaurant: "Sweet & Safe",
    type: "Sin Lácteos",
    image: "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=400&q=80",
    price: "$4.500",
    ingredients: [
      { name: "Harina de almendras", price: "$1.800" },
      { name: "Cacao puro", price: "$1.200" },
      { name: "Aceite de coco", price: "$900" },
      { name: "Nueces picadas", price: "$500" }
    ],
    ingredientsTotal: "$4.400"
  }
];

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
  
  // Estado para controlar el modal de "Solicitar Receta"
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);

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

  // Aseguramos tener al menos 10 opciones para la demostración (duplicando si la BD mock es pequeña)
  let baseItems = recommendedRestaurants.length > 0 ? recommendedRestaurants : MOCK_RESTAURANTS;
  let carouselItems = [...baseItems];
  let multiplier = 1;
  while (carouselItems.length > 0 && carouselItems.length < 10) {
    const clones = baseItems.map(r => ({ ...r, id: r.id + (1000 * multiplier) }));
    carouselItems = [...carouselItems, ...clones];
    multiplier++;
  }
  carouselItems = carouselItems.slice(0, 10);

  const listItems = MOCK_RESTAURANTS.filter(r => !carouselItems.find(c => c.id === r.id)); // El resto para la lista vertical

  // --- ADS PROMOCIONALES (CREATIVIDAD MOCK) ---
  const promotionalAds = [
    {
      id: 1,
      brand: "McDonald's",
      title: "25% OFF",
      desc: "En tu combo verificado Sin TACC.",
      color: "from-red-500 to-rose-600",
      shadow: "shadow-red-500/20",
      emoji: "🍟"
    },
    {
      id: 2,
      brand: "Carrefour",
      title: "3x2 Plant Based",
      desc: "En toda la sección vegana.",
      color: "from-blue-600 to-indigo-600",
      shadow: "shadow-blue-500/20",
      emoji: "🛒"
    },
    {
      id: 3,
      brand: "Starbucks",
      title: "Upgrade Gratis",
      desc: "Leche de almendras sin cargo adicional.",
      color: "from-emerald-600 to-teal-700",
      shadow: "shadow-emerald-500/20",
      emoji: "☕"
    }
  ];

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

        {/* 📢 CARRUSEL DE PUBLICIDADES Y PROMOCIONES (AUTO-SCROLLING MARQUEE) */}
        <div className="mt-6 overflow-hidden relative w-full pb-2">
          {/* Gradientes laterales para suavizar la entrada y salida (Efecto fade) */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-slate-50 to-transparent z-20 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-slate-50 to-transparent z-20 pointer-events-none" />

          <motion.div
            className="flex w-max"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ ease: "linear", duration: 30, repeat: Infinity }}
          >
            {/* Multiplicamos el arreglo varias veces para que cubra pantallas grandes sin cortarse */}
            {[...promotionalAds, ...promotionalAds, ...promotionalAds, ...promotionalAds].map((ad, index) => (
              <div
                key={`${ad.id}-${index}`}
                className={`w-[320px] md:w-[420px] mr-4 bg-gradient-to-br ${ad.color} p-5 rounded-3xl shadow-lg ${ad.shadow} relative overflow-hidden cursor-pointer flex-shrink-0`}
              >
                {/* Decoración de fondo (Emoji gigante semi-transparente) */}
                <div className="absolute -right-2 -bottom-2 text-7xl opacity-20 rotate-12 select-none pointer-events-none">
                  {ad.emoji}
                </div>
                
                <div className="relative z-10">
                  <span className="bg-white/20 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm">
                    {ad.brand}
                  </span>
                  <h3 className="text-2xl font-black text-white mt-3 leading-tight tracking-tight">
                    {ad.title}
                  </h3>
                  <p className="text-white/90 text-xs font-medium mt-1 w-[85%] leading-relaxed">
                    {ad.desc}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

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
            {carouselItems.map((restaurant, index) => {
              // Generamos la categoría en base al índice para asegurar que haya variedad visual siempre
              const safetyLevel = index % 3;
              const bgColors = ["bg-emerald-600/95", "bg-amber-500/95", "bg-rose-600/95"];
              const textColors = ["text-emerald-100", "text-amber-100", "text-rose-100"];
              const labels = ["Seguro", "Poco seguro", "No confiable"];

              return (
                <div key={restaurant.id} className="min-w-[240px] bg-white rounded-3xl p-3 border border-slate-100 shadow-sm snap-start">
                  <div className="relative">
                    <img src={restaurant.image} alt={restaurant.name} className="w-full h-32 object-cover rounded-2xl mb-3" />
                    
                    {/* ✨ BADGE DE AI MATCH (CATEGORÍAS) */}
                    <div className={`absolute top-2 left-2 ${bgColors[safetyLevel]} backdrop-blur-sm px-2 py-1.5 rounded-lg flex items-center gap-1 shadow-md border border-white/10 z-10`}>
                      <Sparkles className={`w-3 h-3 ${textColors[safetyLevel]}`} />
                      <span className="text-[10px] font-black text-white tracking-wide uppercase">
                        {labels[safetyLevel]}
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
              );
            })}
          </div>
        </div>

        {/* --- 7. PLATOS Y RECETAS (REEMPLAZA A TODOS LOS RESTAURANTES) --- */}
        <div className="px-6 mt-6 pb-8">
          <h4 className="text-lg font-bold text-slate-900 mb-4">Platos y recetas cerca tuyo</h4>
          <div className="flex flex-col gap-4">
            {MOCK_RECIPES.map((recipe) => (
              <div key={recipe.id} className="bg-white rounded-2xl p-3 shadow-sm border border-slate-100 flex gap-4 relative overflow-hidden">
                <img src={recipe.image} alt={recipe.name} className="w-24 h-24 rounded-xl object-cover" />
                <div className="flex-1 py-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 leading-tight pr-2 text-sm">{recipe.name}</h3>
                    <p className="text-xs text-slate-500">{recipe.restaurant}</p>
                    <div className="flex items-center gap-1 text-[#009688] mt-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold">{recipe.type}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-black text-slate-800 text-sm">{recipe.price}</span>
                    <button onClick={() => setSelectedRecipe(recipe)} className="bg-violet-600 text-white text-[10px] font-bold px-4 py-2 rounded-xl active:scale-95 transition-all shadow-md shadow-violet-600/20">
                      Solicitar
                    </button>
                  </div>
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

        {/* --- MODAL DE RECETA / COMPRA (BOTTOM SHEET) --- */}
        {selectedRecipe && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRecipe(null)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[6000]"
            />
            <motion.div
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 max-h-[85vh] bg-slate-50 z-[6001] rounded-t-[32px] shadow-2xl flex flex-col overflow-hidden"
            >
              <div className="p-6 bg-white border-b border-slate-100 shrink-0 relative">
                <button onClick={() => setSelectedRecipe(null)} className="absolute top-6 right-6 p-2 bg-slate-100 rounded-full text-slate-500 active:scale-95">
                  <X className="w-4 h-4" />
                </button>
                <span className="bg-violet-100 text-violet-700 text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider mb-2 inline-block">Tu pedido</span>
                <h3 className="font-black text-2xl text-slate-900 leading-tight pr-8">{selectedRecipe.name}</h3>
                <p className="text-sm font-medium text-slate-500 mt-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> Enviar a: Tu dirección actual
                </p>
              </div>

              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
                {/* Opción 1: Plato Listo */}
                <div className="bg-white p-5 rounded-3xl border-2 border-violet-500 shadow-lg shadow-violet-500/10 relative">
                  <div className="absolute -top-3 left-4 bg-violet-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">Opción 1</div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-black text-lg text-slate-800">Plato Listo para Comer</h4>
                      <p className="text-xs font-medium text-slate-500 mt-0.5">Preparado por {selectedRecipe.restaurant}</p>
                    </div>
                    <span className="font-black text-xl text-violet-600">{selectedRecipe.price}</span>
                  </div>
                  <button className="w-full mt-4 bg-violet-600 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md shadow-violet-600/20">
                    Pedir Plato Listo <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Opción 2: Ingredientes (Cocínalo tú mismo) */}
                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm relative">
                  <div className="absolute -top-3 left-4 bg-slate-200 text-slate-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Opción 2</div>
                  <div className="flex justify-between items-start mb-4 mt-2">
                    <div>
                      <h4 className="font-black text-lg text-slate-800">Cocínalo tú mismo</h4>
                      <p className="text-[11px] font-medium text-slate-500 mt-0.5 flex items-center gap-1">
                        <ShoppingBag className="w-3 h-3" /> Compra los ingredientes exactos
                      </p>
                    </div>
                    <span className="font-black text-xl text-slate-800">{selectedRecipe.ingredientsTotal}</span>
                  </div>
                  
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 mb-4">
                    <ul className="space-y-2.5">
                      {selectedRecipe.ingredients.map((ing: any, i: number) => (
                        <li key={i} className="flex justify-between items-center text-sm">
                          <span className="font-medium text-slate-700 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> {ing.name}
                          </span>
                          <span className="font-bold text-slate-500">{ing.price}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md">
                    Comprar Ingredientes <ShoppingBag className="w-4 h-4" />
                  </button>
                </div>
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