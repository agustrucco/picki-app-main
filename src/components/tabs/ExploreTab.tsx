import { useState } from "react";
import { Search, SlidersHorizontal, Map as MapIcon, List, Crosshair, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import L from 'leaflet';

// Icono personalizado para Picki
const pickiMarker = new L.DivIcon({
  className: 'custom-div-icon',
  html: `<div style="background-color: #009688; width: 30px; height: 30px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.2); margin-left: -15px; margin-top: -30px;">
          <div style="transform: rotate(45deg); color: white; font-size: 14px;">📍</div>
         </div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

const mockRestaurants = [
  { id: 1, name: "Sintaxis Palermo", pos: [-34.5845, -58.4395] as [number, number], tags: ["Sin TACC"] },
  { id: 2, name: "Bio Solo Orgánico", pos: [-34.5812, -58.4332] as [number, number], tags: ["Vegano"] },
  { id: 3, name: "Gout Gluten Free", pos: [-34.5901, -58.4123] as [number, number], tags: ["Sin TACC"] },
];

export default function ExploreTab() {
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  const [showFilters, setShowFilters] = useState(false);
  const center: [number, number] = [-34.5833, -58.4333];

  return (
    <div className="flex flex-col h-screen bg-slate-50 pb-20 relative">
      {/* BUSCADOR SOBRE EL MAPA */}
      <div className="absolute top-4 inset-x-4 z-[1000] space-y-3 pointer-events-none">
        <div className="flex gap-2 pointer-events-auto">
          <div className="flex-1 bg-white rounded-2xl shadow-xl border border-slate-100 flex items-center px-4 py-3">
            <Search className="w-5 h-5 text-slate-400 mr-2" />
            <input type="text" placeholder="Buscar lugares seguros..." className="bg-transparent border-none outline-none text-sm w-full" />
          </div>
          <button onClick={() => setShowFilters(true)} className="bg-white p-3.5 rounded-2xl shadow-xl border border-slate-100 text-slate-600 active:scale-95 transition-all">
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>

        <div className="flex justify-center pointer-events-auto">
          <div className="bg-white/90 backdrop-blur-md p-1 rounded-xl shadow-xl border border-white flex gap-1">
            <button onClick={() => setViewMode("map")} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === "map" ? "bg-[#009688] text-white" : "text-slate-500"}`}>
              <MapIcon className="w-4 h-4" /> Mapa
            </button>
            <button onClick={() => setViewMode("list")} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === "list" ? "bg-[#009688] text-white" : "text-slate-500"}`}>
              <List className="w-4 h-4" /> Lista
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 z-0 relative">
        {viewMode === "map" ? (
          <MapContainer center={center} zoom={14} zoomControl={false} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
            <ZoomControl position="bottomright" />
            {mockRestaurants.map(rest => (
              <Marker key={rest.id} position={rest.pos} icon={pickiMarker}>
                <Popup>
                  <div className="p-1">
                    <h4 className="font-bold">{rest.name}</h4>
                    <p className="text-xs text-slate-500">{rest.tags.join(" • ")}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        ) : (
          <div className="pt-32 p-4 space-y-4 overflow-y-auto h-full">
            {mockRestaurants.map(rest => (
              <div key={rest.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex gap-4">
                <div className="w-16 h-16 bg-[#009688]/10 rounded-xl flex items-center justify-center text-[#009688]"><MapPin /></div>
                <div>
                  <h4 className="font-bold text-slate-800">{rest.name}</h4>
                  <p className="text-xs text-slate-500">{rest.tags.join(" • ")}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showFilters && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowFilters(false)} className="fixed inset-0 bg-black/40 z-[2000] backdrop-blur-sm" />
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="fixed inset-x-0 bottom-0 bg-white rounded-t-[32px] z-[2001] p-6 pb-12">
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6" />
              <h3 className="text-xl font-bold mb-6">Filtros</h3>
              <button onClick={() => setShowFilters(false)} className="w-full py-4 bg-[#009688] text-white font-bold rounded-2xl">Aplicar</button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}