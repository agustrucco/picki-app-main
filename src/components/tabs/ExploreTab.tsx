import { useState } from "react";
import { Search, SlidersHorizontal, Map as MapIcon, List, Crosshair, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMap } from 'react-leaflet';
import L from 'leaflet';
import { restaurantsData } from "@/data/places";

const pickiMarker = new L.DivIcon({
  className: 'custom-div-icon',
  html: `<div style="background-color: #009688; width: 34px; height: 34px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.3); margin-left: -17px; margin-top: -34px;">
          <div style="transform: rotate(45deg); color: white; font-size: 16px;">📍</div>
         </div>`,
  iconSize: [34, 34],
  iconAnchor: [17, 34],
});

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  map.setView(center, 14);
  return null;
}

export default function ExploreTab() {
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [mapCenter, setMapCenter] = useState<[number, number]>([-34.5833, -58.4333]);

  const filteredPlaces = restaurantsData.filter(place => 
    activeFilter === "Todos" || place.tag === activeFilter || place.type === activeFilter
  );

  return (
    <div className="flex flex-col h-screen bg-slate-50 pb-20 relative overflow-hidden">
      {/* HEADER */}
      <div className="absolute top-4 inset-x-4 z-[1000] space-y-3 pointer-events-none">
        <div className="flex gap-2 pointer-events-auto">
          <div className="flex-1 bg-white rounded-2xl shadow-xl border border-slate-100 flex items-center px-4 py-3">
            <Search className="w-5 h-5 text-slate-400 mr-2" />
            <input type="text" placeholder="¿Café o cena segura?" className="bg-transparent border-none outline-none text-sm w-full font-medium" />
          </div>
          <button onClick={() => setShowFilters(true)} className="bg-white p-3.5 rounded-2xl shadow-xl border border-slate-100 text-[#009688]">
            <SlidersHorizontal className="w-6 h-6" />
          </button>
        </div>
        <div className="flex justify-center pointer-events-auto">
          <div className="bg-white/90 backdrop-blur-md p-1.5 rounded-2xl shadow-xl border border-white flex gap-1">
            <button onClick={() => setViewMode("map")} className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all ${viewMode === "map" ? "bg-[#009688] text-white shadow-lg" : "text-slate-500"}`}>
              <MapIcon className="w-4 h-4" /> Mapa
            </button>
            <button onClick={() => setViewMode("list")} className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all ${viewMode === "list" ? "bg-[#009688] text-white shadow-lg" : "text-slate-500"}`}>
              <List className="w-4 h-4" /> Lista
            </button>
          </div>
        </div>
      </div>

      {/* CONTENIDO */}
      <div className="flex-1 z-0 relative">
        {viewMode === "map" ? (
          <MapContainer center={mapCenter} zoom={13} zoomControl={false} style={{ height: '100%', width: '100%' }}>
            <ChangeView center={mapCenter} />
            <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
            <ZoomControl position="bottomright" />
            {filteredPlaces.map(place => (
              <Marker key={place.id} position={place.pos} icon={pickiMarker}>
                <Popup className="custom-popup">
                  <div className="w-40 rounded-lg overflow-hidden">
                    <img src={place.img} className="w-full h-20 object-cover rounded-md mb-2" />
                    <h4 className="font-bold text-xs">{place.type === "Cafetería" ? "☕" : "🍴"} {place.name}</h4>
                    <p className="text-[9px] text-[#009688] font-bold uppercase">{place.tag}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        ) : (
          <div className="pt-36 p-4 space-y-4 overflow-y-auto h-full">
            {filteredPlaces.map(place => (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={place.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100">
                <div className="relative h-32">
                   <img src={place.img} className="w-full h-full object-cover" />
                   <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-[9px] font-black text-[#009688]">
                     {place.type ? place.type.toUpperCase() : "LUGAR"}
                   </div>
                </div>
                <div className="p-4 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold">{place.name}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{place.tag} • {place.barrio || "CABA"}</p>
                  </div>
                  <div className="flex items-center text-yellow-500 font-bold text-sm"><Star className="w-3.5 h-3.5 fill-current mr-0.5" />{place.rating}</div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      
     {/* MODAL DE FILTROS COMPLETO */}
      <AnimatePresence>
        {showFilters && (
          <>
            {/* Fondo oscuro traslúcido */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setShowFilters(false)} 
              className="fixed inset-0 bg-black/40 z-[2000] backdrop-blur-sm" 
            />
            
            {/* Panel blanco que sube */}
            <motion.div 
              initial={{ y: "100%" }} 
              animate={{ y: 0 }} 
              exit={{ y: "100%" }} 
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-x-0 bottom-0 bg-white rounded-t-[40px] z-[2001] p-8 pb-12 shadow-2xl"
            >
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-8" />
              <h3 className="text-xl font-bold mb-6 italic text-slate-800">¿Qué buscamos hoy?</h3>
              
              <div className="space-y-8">
                {/* SECCIÓN 1: CATEGORÍA */}
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Tipo de lugar</p>
                  <div className="flex flex-wrap gap-2">
                    {["Todos", "Restaurante", "Cafetería"].map(f => (
                      <button 
                        key={f} 
                        onClick={() => setActiveFilter(f)} 
                        className={`px-5 py-2.5 rounded-2xl text-xs font-bold border-2 transition-all ${activeFilter === f ? "bg-[#009688] text-white border-[#009688] shadow-md shadow-[#009688]/20" : "bg-white text-slate-500 border-slate-100 active:bg-slate-50"}`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                {/* SECCIÓN 2: SEGURIDAD (Esto es lo que te faltaba) */}
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Requerimiento de Seguridad</p>
                  <div className="flex flex-wrap gap-2">
                    {["Sin TACC", "Vegano", "Certificado", "Opciones"].map(f => (
                      <button 
                        key={f} 
                        onClick={() => setActiveFilter(f)} 
                        className={`px-5 py-2.5 rounded-2xl text-xs font-bold border-2 transition-all ${activeFilter === f ? "bg-[#009688] text-white border-[#009688] shadow-md shadow-[#009688]/20" : "bg-white text-slate-500 border-slate-100 active:bg-slate-50"}`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                {/* BOTÓN DE CIERRE */}
                <button 
                  onClick={() => setShowFilters(false)} 
                  className="w-full py-5 bg-[#009688] text-white font-black rounded-2xl shadow-xl shadow-[#009688]/30 active:scale-[0.98] transition-all tracking-wide uppercase text-sm"
                >
                  MOSTRAR {filteredPlaces.length} OPCIONES
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}