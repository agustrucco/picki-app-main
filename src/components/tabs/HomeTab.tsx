import { useState } from "react";
import { Search, MapPin, ChevronDown, Bell, Globe, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function HomeTab() {
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  return (
    <div className="flex flex-col pb-20 bg-slate-50 min-h-screen">
      {/* HEADER ESTILO PEDIDOSYA */}
      <div className="bg-white px-4 pt-4 pb-3 sticky top-0 z-30 border-b border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <button 
            onClick={() => setIsAddressModalOpen(true)}
            className="flex flex-col items-start"
          >
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Entregar en</span>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-[#009688]" />
              <span className="font-bold text-slate-800 text-sm">Tu dirección actual</span>
              <ChevronDown className="w-4 h-4 text-[#009688]" />
            </div>
          </button>
          
          <div className="flex gap-3">
            <button className="p-2 bg-slate-100 rounded-full relative">
              <Bell className="w-5 h-5 text-slate-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </div>

        {/* BUSCADOR */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-slate-400 group-focus-within:text-[#009688] transition-colors" />
          </div>
          <input
            type="text"
            placeholder="¿Qué quieres comer hoy?"
            className="w-full bg-slate-100 border-none rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-[#009688]/20 focus:bg-white transition-all outline-none"
          />
        </div>
      </div>

      {/* CONTENIDO DEL HOME (RELLENO) */}
      <div className="p-4 space-y-6">
        {/* Banner Promocional */}
        <div className="w-full h-40 bg-[#009688] rounded-2xl p-6 text-white relative overflow-hidden shadow-lg shadow-[#009688]/20">
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-1">Comer seguro</h3>
            <p className="text-sm opacity-90 max-w-[180px]">Explora restaurantes con certificación Picki.</p>
          </div>
          <ShoppingBag className="absolute -right-4 -bottom-4 w-32 h-32 opacity-20 rotate-12" />
        </div>

        <div className="flex items-center justify-between">
          <h2 className="font-bold text-lg text-slate-800">Categorías</h2>
          <button className="text-[#009688] text-sm font-semibold">Ver todas</button>
        </div>
        
        {/* Aquí irían tus tarjetas de comida */}
        <div className="grid grid-cols-2 gap-4">
            <div className="h-24 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center font-medium text-slate-500">Restaurantes</div>
            <div className="h-24 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center font-medium text-slate-500">Supermercado</div>
        </div>
      </div>

      {/* MODAL DE DIRECCIÓN (BOTTOM SHEET) */}
      <AnimatePresence>
        {isAddressModalOpen && (
          <>
            {/* Fondo oscuro */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddressModalOpen(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />
            
            {/* Panel que sube */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-x-0 bottom-0 bg-white rounded-t-[32px] z-50 p-6 pb-10"
            >
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6" />
              
              <h3 className="text-xl font-bold text-slate-800 mb-6">Elige tu dirección</h3>
              
              <div className="space-y-4">
                <button className="w-full flex items-center gap-4 p-4 rounded-2xl bg-[#009688]/5 border border-[#009688]/10 text-left">
                  <div className="w-10 h-10 rounded-full bg-[#009688] flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">Ubicación actual</p>
                    <p className="text-xs text-slate-500">Usar el GPS de mi dispositivo</p>
                  </div>
                </button>

                <button className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 border border-slate-100 text-left transition-colors">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">Cambiar de país</p>
                    <p className="text-xs text-slate-500">Argentina</p>
                  </div>
                </button>
              </div>

              <button 
                onClick={() => setIsAddressModalOpen(false)}
                className="w-full mt-8 py-4 bg-slate-100 text-slate-800 font-bold rounded-xl"
              >
                Cerrar
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
