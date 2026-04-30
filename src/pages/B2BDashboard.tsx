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

        <div className="flex-1 p-8 overflow-y-auto">
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
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-3">
                  <BadgeCheck className="w-8 h-8 text-emerald-600" />
                </div>
                <h4 className="font-bold text-slate-800 mb-1">{businessType}</h4>
                <p className="text-xs font-medium text-emerald-600 mb-4">Verificada por Picki Standards</p>
                <button className="w-full py-2.5 bg-white border border-slate-200 shadow-sm text-sm font-bold text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
                  Subir nuevo certificado
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}