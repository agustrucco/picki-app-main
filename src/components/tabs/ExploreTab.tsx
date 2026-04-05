import { useState } from "react";
import { Search, SlidersHorizontal, Map as MapIcon, List, Crosshair } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ExploreTab() {
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-slate-50 pb-20">
      {/* HEADER BUSCADOR */}
      <div className="absolute top-4 inset-x-4 z-40 space-y-3">
        <div className="flex gap-2">
          <div className="flex-1 bg-white rounded-2xl shadow-lg border border-slate-100 flex items-center px-4 py-3">
            <Search className="w-5 h-5 text-slate-400 mr-2" />
            <input 
              type="text" 
              placeholder="Buscar restaurantes seguros..." 
              className="bg-transparent border-none outline-none text-sm w-full"
            />
          </div>
          <button 
            onClick={() => setShowFilters(true)}
            className="bg-white p-3.5 rounded-2xl shadow-lg border border-slate-100 text-slate-600 active:scale-95 transition-transform"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* TOGGLE MAPA / LISTA */}
        <div className="flex justify-center">
          <div className="bg-white/90 backdrop-blur-md p-1 rounded-xl shadow-xl border border-white flex gap-1">
            <button 
              onClick={() => setViewMode("map")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === "map" ? "bg-[#009688] text-white" : "text-slate-500"}`}
            >
              <MapIcon className="w-4 h-4" /> Mapa
            </button>
            <button 
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === "list" ? "bg-[#009688] text-white" : "text-slate-500"}`}
            >
              <List className="w-4 h-4" /> Lista
            </button>
          </div>
        </div>
      </div>

      {/* ÁREA DE CONTENIDO (Aquí irá el mapa dinámico) */}
      <div className="flex-1 relative bg-slate-200">
        {viewMode === "map" ? (
          <div className="w-full h-full flex items-center justify-center text-slate-400 bg-[url('https://www.google.com/maps/d/u/0/thumbnail?mid=1_v09Wl3N6Uf5l4W4N_k_2x_Zf08')] bg-cover opacity-50">
            {/* Aquí conectaremos el mapa real en el siguiente paso */}
            <p className="bg-white px-4 py-2 rounded-full shadow-md text-slate-800 font-medium">Cargando mapa interactivo...</p>
          </div>
        ) : (
          <div className="pt-32 p-4 space-y-4 overflow-y-auto h-full">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex gap-4">
                <div className="w-20 h-20 bg-slate-100 rounded-xl" />
                <div className="flex-1">
                  <h4 className="font-bold text-slate-800 text-sm">Restaurante Certificado {i}</h4>
                  <p className="text-xs text-slate-500 mb-2">Cocina Sin TACC • 200m</p>
                  <div className="flex gap-1">
                     <span className="px-2 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded-md">Seguro</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* BOTÓN MI UBICACIÓN */}
        {viewMode === "map" && (
          <button className="absolute bottom-6 right-6 p-4 bg-white rounded-full shadow-2xl border border-slate-100 text-[#009688] active:scale-90 transition-all">
            <Crosshair className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* MODAL DE FILTROS (Imagen 3 de tu referencia) */}
      <AnimatePresence>
        {showFilters && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowFilters(false)}
              className="fixed inset-0 bg-black/40 z-[50] backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              className="fixed inset-x-0 bottom-0 bg-white rounded-t-[32px] z-[60] p-6 max-h-[80vh] overflow-y-auto"
            >
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6" />
              <h3 className="text-xl font-bold mb-6">Filtros avanzados</h3>
              
              <div className="space-y-6 pb-10">
                <section>
                  <p className="font-bold text-sm mb-3">Dietas y Alergias</p>
                  <div className="flex flex-wrap gap-2">
                    {["Sin TACC", "Vegano", "Kosher", "Keto", "Sin Lactosa"].map(f => (
                      <button key={f} className="px-4 py-2 border border-slate-200 rounded-full text-xs font-medium text-slate-600 active:bg-[#009688] active:text-white">
                        {f}
                      </button>
                    ))}
                  </div>
                </section>
                
                <button 
                  onClick={() => setShowFilters(false)}
                  className="w-full py-4 bg-[#009688] text-white font-bold rounded-2xl shadow-lg"
                >
                  Aplicar filtros
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}