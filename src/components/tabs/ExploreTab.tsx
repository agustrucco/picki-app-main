import { useState } from "react";
import { Search, SlidersHorizontal, Map as MapIcon, List, Crosshair, MapPin, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import L from 'leaflet';

// ICONO PERSONALIZADO DE PICKI (TEAL)
const pickiMarker = new L.DivIcon({
  className: 'custom-div-icon',
  html: `<div style="background-color: #009688; width: 34px; height: 34px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.3); margin-left: -17px; margin-top: -34px;">
          <div style="transform: rotate(45deg); color: white; font-size: 16px;">📍</div>
         </div>`,
  iconSize: [34, 34],
  iconAnchor: [17, 34],
});

// BASE DE DATOS CURADA (MVP BUENOS AIRES)
const restaurants = [
  { id: 1, name: "Don Julio", pos: [-34.5863, -58.4244] as [number, number], tag: "Seguro", img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400", rating: 4.9, info: "Parrilla N°1 del mundo" },
  { id: 2, name: "Guerrín", pos: [-34.6041, -58.3859] as [number, number], tag: "Sin TACC disp.", img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400", rating: 4.8, info: "Pizza icónica del Centro" },
  { id: 3, name: "El Preferido", pos: [-34.5852, -58.4239] as [number, number], tag: "Certificado", img: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400", rating: 4.7, info: "Bodegón modernizado" },
  { id: 4, name: "Sintaxis Palermo", pos: [-34.5845, -58.4395] as [number, number], tag: "100% Sin TACC", img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400", rating: 4.6, info: "Especialistas en Celiaquía" },
  { id: 5, name: "Hierbabuena", pos: [-34.6262, -58.3712] as [number, number], tag: "Vegano", img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400", rating: 4.5, info: "San Telmo - Healthy Food" },
  { id: 6, name: "Cucina Paradiso", pos: [-34.5614, -58.4542] as [number, number], tag: "Sin TACC", img: "https://images.unsplash.com/photo-1473093226795-af9932fe5856?w=400", rating: 4.7, info: "Pasta de Donato de Santis" },
  { id: 7, name: "Sacro", pos: [-34.5857, -58.4344] as [number, number], tag: "Plant-based", img: "https://images.unsplash.com/photo-1540914124281-342d8df481fe?w=400", rating: 4.8, info: "Alta cocina vegetal" },
  { id: 8, name: "Sarkis", pos: [-34.5909, -58.4357] as [number, number], tag: "Opciones", img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400", rating: 4.9, info: "Clásico Armenio" },
  { id: 9, name: "Pani Recoleta", pos: [-34.5888, -58.3917] as [number, number], tag: "Meriendas", img: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400", rating: 4.4, info: "Deli & Bakery" },
  { id: 10, name: "Anchoita", pos: [-34.5843, -58.4447] as [number, number], tag: "Certificado", img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400", rating: 4.9, info: "La joya de Chacarita" },
];

export default function ExploreTab() {
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  const [showFilters, setShowFilters] = useState(false);
  const center: [number, number] = [-34.5833, -58.4333]; // Foco en Palermo

  return (
    <div className="flex flex-col h-screen bg-slate-50 pb-20 relative">
      {/* HEADER BUSCADOR (Z-INDEX 1000 PARA ESTAR SOBRE EL MAPA) */}
      <div className="absolute top-4 inset-x-4 z-[1000] space-y-3 pointer-events-none">
        <div className="flex gap-2 pointer-events-auto">
          <div className="flex-1 bg-white rounded-2xl shadow-2xl border border-slate-100 flex items-center px-4 py-3">
            <Search className="w-5 h-5 text-slate-400 mr-2" />
            <input type="text" placeholder="¿Dónde quieres comer seguro?" className="bg-transparent border-none outline-none text-sm w-full font-medium" />
          </div>
          <button onClick={() => setShowFilters(true)} className="bg-white p-3.5 rounded-2xl shadow-2xl border border-slate-100 text-[#009688] active:scale-95 transition-all">
            <SlidersHorizontal className="w-6 h-6" />
          </button>
        </div>

        {/* TOGGLE VISTA */}
        <div className="flex justify-center pointer-events-auto">
          <div className="bg-white/90 backdrop-blur-md p-1.5 rounded-2xl shadow-2xl border border-white flex gap-1">
            <button onClick={() => setViewMode("map")} className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all ${viewMode === "map" ? "bg-[#009688] text-white shadow-lg" : "text-slate-500"}`}>
              <MapIcon className="w-4 h-4" /> Mapa
            </button>
            <button onClick={() => setViewMode("list")} className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all ${viewMode === "list" ? "bg-[#009688] text-white shadow-lg" : "text-slate-500"}`}>
              <List className="w-4 h-4" /> Lista
            </button>
          </div>
        </div>
      </div>

      {/* ÁREA DE CONTENIDO */}
      <div className="flex-1 z-0 relative">
        {viewMode === "map" ? (
          <MapContainer center={center} zoom={13} zoomControl={false} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
            <ZoomControl position="bottomright" />
            {restaurants.map(rest => (
              <Marker key={rest.id} position={rest.pos} icon={pickiMarker}>
                <Popup className="custom-popup">
                  <div className="w-48 overflow-hidden rounded-lg">
                    <img src={rest.img} className="w-full h-24 object-cover mb-2" alt={rest.name} />
                    <h4 className="font-bold text-sm text-slate-800">{rest.name}</h4>
                    <p className="text-[10px] text-slate-500 mb-2">{rest.info}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] bg-green-50 text-[#009688] px-2 py-0.5 rounded font-bold">{rest.tag}</span>
                      <div className="flex items-center text-yellow-500 text-[10px]"><Star className="w-3 h-3 fill-current mr-0.5" /> {rest.rating}</div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        ) : (
          <div className="pt-36 p-4 space-y-4 overflow-y-auto h-full bg-slate-50">
            {restaurants.map(rest => (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={rest.id} className="bg-white rounded-[24px] overflow-hidden shadow-sm border border-slate-100 flex flex-col">
                <div className="relative h-40">
                   <img src={rest.img} className="w-full h-full object-cover" alt={rest.name} />
                   <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-[#009688]">{rest.tag}</div>
                </div>
                <div className="p-4 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-slate-800">{rest.name}</h4>
                    <p className="text-xs text-slate-500">{rest.info}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-yellow-500 text-sm font-bold"><Star className="w-3.5 h-3.5 fill-current mr-1" /> {rest.rating}</div>
                    <p className="text-[10px] text-slate-400">Palermo</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* BOTÓN UBICACIÓN */}
      {viewMode === "map" && (
        <button className="absolute bottom-6 right-6 p-4 bg-white rounded-full shadow-2xl border border-slate-100 text-[#009688] z-[1001] active:scale-90 transition-all">
          <Crosshair className="w-6 h-6" />
        </button>
      )}

      {/* MODAL FILTROS */}
      <AnimatePresence>
        {showFilters && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowFilters(false)} className="fixed inset-0 bg-black/40 z-[2000] backdrop-blur-sm" />
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 25 }} className="fixed inset-x-0 bottom-0 bg-white rounded-t-[40px] z-[2001] p-8 pb-12 shadow-2xl">
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-8" />
              <h3 className="text-2xl font-black text-slate-800 mb-8 italic">Filtros de Seguridad</h3>
              <div className="space-y-8">
                <div>
                  <p className="font-bold text-xs uppercase tracking-widest text-slate-400 mb-4">Requerimientos Dietarios</p>
                  <div className="flex flex-wrap gap-2">
                    {["Sin TACC", "Kosher", "Vegano", "Sin Lactosa", "Keto"].map(f => (
                      <button key={f} className="px-5 py-2.5 border-2 border-slate-100 rounded-2xl text-xs font-bold text-slate-600 hover:border-[#009688] hover:text-[#009688] transition-all">
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
                <button onClick={() => setShowFilters(false)} className="w-full py-5 bg-[#009688] text-white font-black rounded-2xl shadow-xl shadow-[#009688]/30 active:scale-[0.98] transition-all">
                  APLICAR FILTROS
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}