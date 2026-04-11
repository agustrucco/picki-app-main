import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { Search, Star, ShieldCheck, Map as MapIcon, List, Filter, LocateFixed } from "lucide-react";
import { renderToStaticMarkup } from "react-dom/server";

const pickiMarkerIcon = L.divIcon({
  html: renderToStaticMarkup(
    <div style={{ backgroundColor: '#009688', color: 'white', padding: '6px', borderRadius: '9999px', boxShadow: '0 4px 6px rgba(0,0,0,0.3)', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>
    </div>
  ),
  className: "", // Quita las clases por defecto de Leaflet para usar las nuestras
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36],
});

// 22 Restaurantes simulados
const IMAGES = [
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80",
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80",
  "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=80",
  "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400&q=80",
];

const MOCK_RESTAURANTS = [
  { id: 1, name: "Sintaxis Palermo", type: "100% Libre de Gluten", position: [-34.5885, -58.4305] as [number, number], rating: 4.8, image: IMAGES[0] },
  { id: 2, name: "Vegan & Safe", type: "Vegano / Sin Lácteos", position: [-34.5912, -58.4332] as [number, number], rating: 4.6, image: IMAGES[1] },
  { id: 3, name: "Kosher Deli", type: "Kosher Certificado", position: [-34.5945, -58.4280] as [number, number], rating: 4.9, image: IMAGES[2] },
  { id: 4, name: "Bio Solo Orgánico", type: "Orgánico / Vegano", position: [-34.5832, -58.4350] as [number, number], rating: 4.7, image: IMAGES[3] },
  { id: 5, name: "La Arepería", type: "Libre de Gluten", position: [-34.5890, -58.4210] as [number, number], rating: 4.5, image: IMAGES[4] },
  { id: 6, name: "Artemisia", type: "Vegetariano", position: [-34.5920, -58.4250] as [number, number], rating: 4.8, image: IMAGES[0] },
  { id: 7, name: "Let it V", type: "100% Plant Based", position: [-34.5850, -58.4380] as [number, number], rating: 4.9, image: IMAGES[1] },
  { id: 8, name: "Sacro", type: "Plant Based / Alta Cocina", position: [-34.5810, -58.4410] as [number, number], rating: 4.8, image: IMAGES[2] },
  { id: 9, name: "Donnet", type: "Hongos / Vegano", position: [-34.5980, -58.4450] as [number, number], rating: 4.6, image: IMAGES[3] },
  { id: 10, name: "Buenos Aires Verde", type: "Orgánico / Crudivegano", position: [-34.5845, -58.4320] as [number, number], rating: 4.7, image: IMAGES[4] },
  { id: 11, name: "Kensho", type: "Kosher", position: [-34.5905, -58.4310] as [number, number], rating: 4.5, image: IMAGES[0] },
  { id: 12, name: "Loving Hut", type: "Vegano", position: [-34.5960, -58.4200] as [number, number], rating: 4.4, image: IMAGES[1] },
  { id: 13, name: "Mudrá", type: "Plant Based", position: [-34.5990, -58.4350] as [number, number], rating: 4.8, image: IMAGES[2] },
  { id: 14, name: "Estilo Veggie", type: "Vegano / Sin Gluten", position: [-34.5870, -58.4400] as [number, number], rating: 4.6, image: IMAGES[3] },
  { id: 15, name: "Casa Munay", type: "Vegetariano", position: [-34.5820, -58.4280] as [number, number], rating: 4.5, image: IMAGES[4] },
  { id: 16, name: "B-Fresh", type: "Saludable / Sin TACC", position: [-34.5895, -58.4190] as [number, number], rating: 4.7, image: IMAGES[0] },
  { id: 17, name: "Veganius", type: "Vegano", position: [-34.5935, -58.4390] as [number, number], rating: 4.6, image: IMAGES[1] },
  { id: 18, name: "Sattva", type: "Vegetariano", position: [-34.5950, -58.4250] as [number, number], rating: 4.5, image: IMAGES[2] },
  { id: 19, name: "Naturaleza Sabia", type: "Vegetariano / Vegano", position: [-34.5910, -58.4380] as [number, number], rating: 4.7, image: IMAGES[3] },
  { id: 20, name: "Vita", type: "Vegano", position: [-34.5860, -58.4260] as [number, number], rating: 4.6, image: IMAGES[4] },
  { id: 21, name: "Green Factory", type: "Fast Food Vegano", position: [-34.5975, -58.4310] as [number, number], rating: 4.4, image: IMAGES[0] },
  { id: 22, name: "La Reverde", type: "Parrilla Vegana", position: [-34.5940, -58.4420] as [number, number], rating: 4.8, image: IMAGES[1] },
];

// Componente utilitario para manejar la geolocalización desde el mapa
function LocationButton() {
  const map = useMap();
  return (
    <button
      onClick={() => {
        map.locate().on("locationfound", function (e) {
          map.flyTo(e.latlng, 16);
        });
      }}
      className="absolute bottom-6 right-4 z-[1000] bg-white p-3.5 rounded-full shadow-lg border border-slate-100 text-slate-700 active:scale-95 transition-all"
    >
      <LocateFixed className="w-5 h-5" />
    </button>
  );
}

export default function ExploreTab() {
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  // Coordenadas centrales (Ej: Palermo, Buenos Aires)
  const center: [number, number] = [-34.5900, -58.4300];

  return (
    <div className="relative flex flex-col h-screen bg-slate-50">
      
      {/* BARRA SUPERIOR: Buscador y Filtros */}
      <div className="absolute top-6 left-4 right-4 z-[1000] flex gap-2">
        <div className="flex-1 flex items-center gap-3 bg-white px-5 py-3.5 rounded-2xl shadow-lg border border-slate-100">
          <Search className="w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Buscar zonas o restaurantes..." 
            className="flex-1 bg-transparent text-sm font-medium outline-none text-slate-700 placeholder:text-slate-400 w-full" 
          />
        </div>
        <button className="bg-white px-4 rounded-2xl shadow-lg border border-slate-100 text-slate-700 flex items-center justify-center active:scale-95 transition-all">
          <Filter className="w-5 h-5" />
        </button>
      </div>

      {/* CONTENIDO PRINCIPAL: Mapa o Listado */}
      <div className="flex-1 w-full h-full relative pb-20">
        {viewMode === "map" ? (
          <div className="w-full h-full z-0">
            <MapContainer center={center} zoom={15} zoomControl={false} style={{ height: "100%", width: "100%" }}>
              <TileLayer
                attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              />
              <LocationButton />
              {MOCK_RESTAURANTS.map((restaurant) => (
                <Marker key={restaurant.id} position={restaurant.position} icon={pickiMarkerIcon}>
                  <Popup className="custom-popup">
                    <div className="w-[200px] -m-3 overflow-hidden rounded-xl bg-white shadow-sm">
                      <img src={restaurant.image} alt={restaurant.name} className="w-full h-28 object-cover" />
                      <div className="p-3">
                        <h3 className="font-bold text-slate-900 text-sm leading-tight mb-1">{restaurant.name}</h3>
                        <div className="flex items-center gap-1 text-[#009688] mb-3">
                          <ShieldCheck className="w-3 h-3" />
                          <span className="text-[10px] font-bold tracking-wide">{restaurant.type}</span>
                        </div>
                        <button className="w-full bg-[#009688] text-white text-xs font-bold py-2 rounded-lg active:scale-95 transition-all">Ver lugar</button>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        ) : (
          // LISTADO DE RESTAURANTES
          <div className="w-full h-full pt-24 px-4 pb-28 overflow-y-auto">
            <h2 className="text-lg font-bold text-slate-900 mb-4 px-1">22 lugares cerca tuyo</h2>
            <div className="flex flex-col gap-4">
              {MOCK_RESTAURANTS.map((restaurant) => (
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
                    <p className="text-[11px] text-slate-400 font-medium">A 1.2 km de tu ubicación</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* BOTÓN FLOTANTE: Alternar Mapa/Listado */}
      <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-[1000]">
        <button 
          onClick={() => setViewMode(prev => prev === "map" ? "list" : "map")}
          className="bg-slate-900 text-white px-5 py-3 rounded-full shadow-xl flex items-center gap-2 font-medium text-sm hover:scale-105 active:scale-95 transition-all"
        >
          {viewMode === "map" ? (
            <>
              <List className="w-4 h-4" /> Ver listado
            </>
          ) : (
            <>
              <MapIcon className="w-4 h-4" /> Ver mapa
            </>
          )}
        </button>
      </div>
    </div>
  );
}