import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";

// DATOS DE EJEMPLO
const places = [
  { id: 1, name: "Casa Cavia", type: "RESTAURANTE", rating: 4.5, price: "$$$", barrio: "Palermo", img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80", position: [-34.5800, -58.4200] as [number, number] },
  { id: 2, name: "Sintaxis", type: "CAFETERÍA", rating: 4.8, price: "$$", barrio: "Palermo Soho", img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80", position: [-34.5885, -58.4305] as [number, number] },
  { id: 3, name: "Sacro", type: "RESTAURANTE", rating: 4.9, price: "$$$$", barrio: "Colegiales", img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80", position: [-34.5810, -58.4410] as [number, number] },
];

// FUNCIÓN PARA CREAR EL ICONO PERSONALIZADO DE TARJETA
const createCardIcon = (place: typeof places[0]) => {
  // Creamos el HTML de la tarjeta con clases de Tailwind
  const htmlString = renderToStaticMarkup(
    <div className="flex bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden w-60 h-24 hover:scale-105 transition-transform duration-200 cursor-pointer">
      {/* IMAGEN IZQUIERDA */}
      <img src={place.img} alt={place.name} className="w-24 h-24 object-cover flex-shrink-0" />
      
      {/* INFO DERECHA */}
      <div className="p-2.5 flex flex-col justify-between flex-1">
        <div>
          <span className="text-[9px] font-extrabold text-slate-400 tracking-widest uppercase block mb-0.5">
            {place.type}
          </span>
          <h3 className="text-sm font-bold text-slate-800 leading-tight truncate">
            {place.name}
          </h3>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5">
            ⭐ {place.rating} · {place.price}
          </p>
        </div>
        <span className="text-[10px] font-semibold text-slate-400 self-end mt-1">
          {place.barrio}
        </span>
      </div>
    </div>
  );

  return L.divIcon({
    html: htmlString,
    className: "", // Quita las clases y fondos blancos por defecto de Leaflet
    iconSize: [240, 96], // w-60 (240px), h-24 (96px)
    iconAnchor: [120, 48], // Centramos el ancla en el medio exacto de la tarjeta
  });
};

export default function ExploreCardsView() {
  const center: [number, number] = [-34.5850, -58.4300];

  return (
    <div className="relative flex flex-col h-screen bg-slate-50">
      <div className="flex-1 w-full h-full relative z-0 pb-20">
        <MapContainer center={center} zoom={14} zoomControl={false} style={{ height: "100%", width: "100%" }}>
          <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
          {places.map((place) => (
            <Marker key={place.id} position={place.position} icon={createCardIcon(place)} />
          ))}
        </MapContainer>
      </div>
    </div>
  );
}