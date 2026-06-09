import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Utensils,
  BadgeCheck,
  BarChart3,
  LogOut,
  Bell,
  User,
  TrendingUp,
  Users,
  Star,
  Lock,
  PieChart,
  ChevronRight,
  Eye,
  ShoppingCart,
  TrendingDown,
  CheckCircle2,
  X
} from "lucide-react";

// Datos falsos para las estadísticas
const stats = [
  { label: "Visitas al perfil", value: "1,248", trend: "+12%", icon: Users, color: "bg-blue-50 text-blue-600" },
  { label: "Guardado en favoritos", value: "342", trend: "+5%", icon: Star, color: "bg-amber-50 text-amber-600" },
  { label: "Matches IA Clínico", value: "89%", trend: "+2.4%", icon: TrendingUp, color: "bg-emerald-50 text-emerald-600" },
];

// Datos falsos para el gráfico de barras
const chartData = [
  { day: "Lun", height: "40%" },
  { day: "Mar", height: "65%" },
  { day: "Mié", height: "45%" },
  { day: "Jue", height: "80%" },
  { day: "Vie", height: "100%" },
  { day: "Sáb", height: "85%" },
  { day: "Dom", height: "55%" },
];

export default function B2BDashboard() {
  // Recuperamos los datos reales guardados durante el registro
  const businessName = localStorage.getItem("picki_b2b_name") || "Tu Local";
  const businessType = localStorage.getItem("picki_b2b_type") || "Certificación Pendiente";
  const isCertified = localStorage.getItem("picki_b2b_certified") === "true";

  // Estado para la suscripción de Analytics
  const [hasAnalytics, setHasAnalytics] = useState(localStorage.getItem("picki_b2b_analytics") === "true");
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleUpgradeAnalytics = () => {
    setShowUpgradeModal(false);
    setHasAnalytics(true);
    localStorage.setItem("picki_b2b_analytics", "true");
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2500);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="flex min-h-screen bg-slate-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex-shrink-0 flex flex-col">
        <div className="h-16 flex items-center justify-center font-black text-xl text-violet-700 border-b border-slate-200">
          Picki<span className="text-slate-800">B2B</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <a href="#" className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-violet-50 text-violet-700 font-bold">
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 font-semibold">
            <Utensils className="w-5 h-5" />
            <span>Mi Menú</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 font-semibold">
            <BadgeCheck className="w-5 h-5" />
            <span>Certificaciones</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 font-semibold">
            <BarChart3 className="w-5 h-5" />
            <span>Estadísticas</span>
          </a>
        </nav>
        <div className="p-4 border-t border-slate-200">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-red-600 hover:bg-red-50 font-semibold">
            <LogOut className="w-5 h-5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-end px-6">
          <div className="flex items-center gap-4">
            <button className="text-slate-500 hover:text-slate-800"><Bell className="w-5 h-5" /></button>
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center"><User className="w-5 h-5 text-slate-600" /></div>
          </div>
        </header>

        <div className="flex-1 p-6 md:p-10 overflow-y-auto bg-slate-50">
          <div className="max-w-5xl mx-auto w-full">
            <h1 className="text-3xl font-black text-slate-800 mb-2">Dashboard de {businessName}</h1>
            <p className="text-slate-500 mb-8">Bienvenido de nuevo. Aquí tienes un resumen de tu actividad.</p>

          {/* TARJETAS DE MÉTRICAS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-start gap-4">
                <div className={`p-3 rounded-xl ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
                  <h4 className="text-2xl font-black text-slate-800">{stat.value}</h4>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md mt-2 inline-block">
                    {stat.trend} esta semana
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* GRÁFICO INTERACTIVO */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 col-span-2 flex flex-col">
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-bold text-lg text-slate-800">Tráfico de clientes (Picki AI)</h3>
                <select className="bg-slate-50 border border-slate-200 text-sm font-bold text-slate-600 py-1.5 px-3 rounded-lg outline-none">
                  <option>Últimos 7 días</option>
                  <option>Este mes</option>
                </select>
              </div>
              
              {/* Contenedor de las barras */}
              <div className="flex-1 flex items-end justify-between gap-2 h-48 mt-auto">
                {chartData.map((data, i) => (
                  <div key={i} className="flex flex-col items-center gap-3 w-full group">
                    <div className="w-full bg-slate-100 rounded-t-lg relative h-48 flex items-end overflow-hidden">
                      {/* La barra de color que sube */}
                      <div 
                        className="w-full bg-violet-500 rounded-t-lg group-hover:bg-violet-600 transition-colors duration-300"
                        style={{ height: data.height }}
                      ></div>
                    </div>
                    <span className="text-xs font-bold text-slate-400">{data.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* PERFIL DEL LOCAL */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 col-span-1">
              <h3 className="font-bold text-lg text-slate-800 mb-4">Certificación Activa</h3>
              {isCertified ? (
                <div className="bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl p-4 flex flex-col items-center text-center shadow-lg shadow-orange-500/20">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-3">
                    <BadgeCheck className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-black text-white mb-1">Local Certificado</h4>
                  <p className="text-xs font-medium text-orange-100 mb-4">Destacado en el mapa de usuarios</p>
                  <button className="w-full py-2.5 bg-white/20 text-white font-bold rounded-lg hover:bg-white/30 transition-colors text-sm backdrop-blur-sm">
                    Ver mi certificado
                  </button>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-3">
                    <BadgeCheck className="w-8 h-8 text-slate-400" />
                  </div>
                  <h4 className="font-bold text-slate-500 mb-1">Sin Certificar</h4>
                  <p className="text-xs font-medium text-slate-400 mb-4">Aumenta tus ventas validando tu menú</p>
                  <button className="w-full py-2.5 bg-white border border-slate-200 shadow-sm text-sm font-bold text-orange-500 rounded-lg hover:bg-slate-50 transition-colors">
                    Solicitar Certificación
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* --- NUEVA SECCIÓN: PICKI ANALYTICS PRO --- */}
          <div className="mt-10 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-black text-slate-800">Picki Analytics Pro</h2>
                <p className="text-slate-500 text-sm font-medium mt-1">Información avanzada del comportamiento de tus clientes.</p>
              </div>
              {hasAnalytics && (
                <span className="bg-violet-100 text-violet-700 px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase flex items-center gap-1.5">
                  <PieChart className="w-3.5 h-3.5" /> Plan Activo
                </span>
              )}
            </div>

            {!hasAnalytics ? (
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2rem] p-8 md:p-10 relative overflow-hidden shadow-2xl shadow-slate-900/20 border border-slate-700">
                <div className="absolute top-10 right-10 p-8 opacity-5 pointer-events-none scale-150 transform">
                  <PieChart className="w-64 h-64 text-white" />
                </div>
                <div className="relative z-10 max-w-2xl">
                  <div className="flex items-center gap-2 mb-4">
                    <Lock className="w-5 h-5 text-violet-400" />
                    <span className="text-violet-400 font-black text-xs tracking-widest uppercase">Función Premium</span>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight tracking-tight">
                    Entiende a tus clientes y <br className="hidden md:block" />multiplica tus ventas
                  </h3>
                  <p className="text-slate-300 font-medium text-base mb-8 leading-relaxed max-w-lg">
                    Descubre qué platos generan más curiosidad, por qué abandonan el carrito antes de pagar y accede a embudos de conversión detallados para optimizar tu negocio.
                  </p>
                  <button onClick={() => setShowUpgradeModal(true)} className="bg-violet-500 hover:bg-violet-600 text-white font-bold py-4 px-8 rounded-xl flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-violet-500/30">
                    Desbloquear Analytics Pro <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Fake Pro Stats */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-violet-200 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-blue-50 rounded-bl-full -mr-4 -mt-4 z-0"></div>
                  <div className="flex items-center justify-between mb-4 relative z-10">
                    <h4 className="font-bold text-slate-700 text-sm">Plato con más curiosidad</h4>
                    <Eye className="w-5 h-5 text-blue-500" />
                  </div>
                  <p className="text-xl font-black text-slate-900 leading-tight relative z-10">Sorrentinos Sin TACC</p>
                  <p className="text-xs font-medium text-slate-500 mt-2 relative z-10">452 visualizaciones hoy, solo 12 pedidos.</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-violet-200 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-rose-50 rounded-bl-full -mr-4 -mt-4 z-0"></div>
                  <div className="flex items-center justify-between mb-4 relative z-10">
                    <h4 className="font-bold text-slate-700 text-sm">Abandono de carrito</h4>
                    <ShoppingCart className="w-5 h-5 text-rose-500" />
                  </div>
                  <p className="text-3xl font-black text-slate-900 leading-tight relative z-10">18.4%</p>
                  <p className="text-xs font-medium text-emerald-600 mt-2 flex items-center gap-1 relative z-10">
                    <TrendingDown className="w-3.5 h-3.5" /> -2.1% vs mes anterior
                  </p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-violet-200 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-amber-50 rounded-bl-full -mr-4 -mt-4 z-0"></div>
                  <div className="flex items-center justify-between mb-4 relative z-10">
                    <h4 className="font-bold text-slate-700 text-sm">Motivo principal abandono</h4>
                    <BarChart3 className="w-5 h-5 text-amber-500" />
                  </div>
                  <p className="text-lg font-black text-slate-900 leading-tight relative z-10">Costo de envío alto</p>
                  <p className="text-xs font-medium text-slate-500 mt-2 relative z-10">Responsable del 45% de fugas hoy.</p>
                </div>
              </div>
            )}
          </div>

          </div>
        </div>
      </main>

      {/* MODALES FLOTANTES */}
      <AnimatePresence>
        {showUpgradeModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowUpgradeModal(false)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[6000]" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-3xl shadow-2xl z-[6001] overflow-hidden p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="w-16 h-16 bg-violet-100 rounded-2xl flex items-center justify-center">
                  <PieChart className="w-8 h-8 text-violet-600" />
                </div>
                <button onClick={() => setShowUpgradeModal(false)} className="p-2 bg-slate-100 rounded-full text-slate-500 active:scale-95"><X className="w-4 h-4" /></button>
              </div>
              <h3 className="font-black text-2xl text-slate-900 mb-2">Picki Analytics <span className="text-violet-600">Pro</span></h3>
              <p className="text-slate-500 text-sm font-medium mb-6">Desbloquea el poder de tus datos. Conoce exactamente por qué no estás vendiendo más.</p>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3 text-sm text-slate-700 font-bold"><CheckCircle2 className="w-5 h-5 text-violet-500 shrink-0" /> Embudos de conversión exactos.</li>
                <li className="flex items-start gap-3 text-sm text-slate-700 font-bold"><CheckCircle2 className="w-5 h-5 text-violet-500 shrink-0" /> Identificador de fuga de clientes.</li>
                <li className="flex items-start gap-3 text-sm text-slate-700 font-bold"><CheckCircle2 className="w-5 h-5 text-violet-500 shrink-0" /> Sugerencias de la IA para mejorar tu menú.</li>
              </ul>

              <button onClick={handleUpgradeAnalytics} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-all">
                Suscribirme por $15.000 / mes
              </button>
            </motion.div>
          </>
        )}

        {showSuccess && (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[7000] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center px-6">
             <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full flex flex-col items-center text-center">
               <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                 <CheckCircle2 className="w-10 h-10 text-green-600" />
               </div>
               <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">¡Suscripción Activa!</h3>
               <p className="text-sm text-slate-500 font-medium">Tus métricas avanzadas han sido desbloqueadas.</p>
             </motion.div>
           </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}