import { useState } from "react";
import { List, Map as MapIcon, MapPin, Star, Navigation } from "lucide-react";
import { toast } from "sonner";

const restaurants = [
  { id: 1, name: "La Trattoria", type: "Italiana · Sin TACC", rating: 4.8, distance: "350m", x: 35, y: 40 },
  { id: 2, name: "Green Fit", type: "Saludable · Vegano", rating: 4.6, distance: "500m", x: 60, y: 55 },
  { id: 3, name: "Sushi Safe", type: "Japonesa · Sin Gluten", rating: 4.9, distance: "800m", x: 45, y: 70 },
  { id: 4, name: "Burger Free", type: "Americana · Celíacos", rating: 4.5, distance: "1.2km", x: 75, y: 30 },
];

export default function ExploreTab() {
  const [view, setView] = useState<"list" | "map">("list");
  const [selectedPin, setSelectedPin] = useState<number | null>(null);

  const handleImGoing = (name: string) => {
    setSelectedPin(null);
    toast.success("¡Notificación enviada al restaurante!", {
      description: `${name} te está esperando. ¡Buen provecho!`,
    });
  };

  return (
    <div className="pb-24 min-h-screen">
      {/* Toggle */}
      <div className="px-5 pt-5 pb-4 flex items-center gap-2">
        <button
          onClick={() => setView("list")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            view === "list" ? "bg-primary text-primary-foreground shadow-md" : "bg-card text-foreground"
          }`}
        >
          <List className="w-4 h-4" /> Lista
        </button>
        <button
          onClick={() => setView("map")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            view === "map" ? "bg-primary text-primary-foreground shadow-md" : "bg-card text-foreground"
          }`}
        >
          <MapIcon className="w-4 h-4" /> Mapa
        </button>
      </div>

      {view === "list" ? (
        <div className="px-5">
          {/* Carousel header */}
          <div className="flex items-center gap-2 mb-3">
            <Navigation className="w-4 h-4 text-secondary" />
            <h3 className="text-base font-bold text-foreground">Tu próxima comida está cerca</h3>
          </div>

          {/* Horizontal carousel */}
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-none mb-4">
            {restaurants.slice(0, 3).map((r) => (
              <div
                key={r.id}
                className="min-w-[200px] bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-4 shadow-sm"
              >
                <p className="font-bold text-foreground text-sm">{r.name}</p>
                <p className="text-xs text-muted-foreground mb-2">{r.type}</p>
                <div className="flex items-center gap-1 text-amber">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="text-xs font-semibold">{r.rating}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Full list */}
          <h3 className="text-base font-bold text-foreground mb-3">Restaurantes asociados</h3>
          <div className="flex flex-col gap-3">
            {restaurants.map((r) => (
              <div key={r.id} className="bg-card rounded-xl p-4 shadow-sm flex justify-between items-center">
                <div>
                  <p className="font-semibold text-foreground text-sm">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{r.type}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-amber justify-end">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="text-xs font-semibold">{r.rating}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{r.distance}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Map View */
        <div className="relative mx-5 rounded-2xl overflow-hidden shadow-lg" style={{ height: "calc(100vh - 220px)" }}>
          {/* Mock map background */}
          <div className="absolute inset-0 bg-gradient-to-br from-muted to-accent/10">
            {/* Grid lines for map feel */}
            <div className="absolute inset-0 opacity-10">
              {[...Array(10)].map((_, i) => (
                <div key={`h-${i}`} className="absolute w-full border-t border-foreground/20" style={{ top: `${i * 10}%` }} />
              ))}
              {[...Array(10)].map((_, i) => (
                <div key={`v-${i}`} className="absolute h-full border-l border-foreground/20" style={{ left: `${i * 10}%` }} />
              ))}
            </div>

            {/* Pins */}
            {restaurants.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelectedPin(selectedPin === r.id ? null : r.id)}
                className="absolute -translate-x-1/2 -translate-y-full transition-transform hover:scale-110"
                style={{ left: `${r.x}%`, top: `${r.y}%` }}
              >
                <div className={`flex flex-col items-center ${selectedPin === r.id ? "scale-125" : ""} transition-transform`}>
                  <MapPin className="w-8 h-8 text-primary fill-primary/20" />
                </div>
              </button>
            ))}
          </div>

          {/* Selected pin card */}
          {selectedPin && (() => {
            const r = restaurants.find((r) => r.id === selectedPin)!;
            return (
              <div className="absolute bottom-4 left-4 right-4 bg-card rounded-2xl p-4 shadow-xl">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-bold text-foreground">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.type}</p>
                  </div>
                  <div className="flex items-center gap-1 text-amber">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-bold">{r.rating}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleImGoing(r.name)}
                  className="w-full py-3 rounded-xl bg-secondary text-secondary-foreground font-semibold active:scale-[0.98] transition-transform"
                >
                  ¡Voy para allá!
                </button>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
