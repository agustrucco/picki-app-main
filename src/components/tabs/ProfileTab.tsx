import { User, MapPin, Award, Heart, Star } from "lucide-react";

const placesVisited = [
  { name: "La Trattoria", visits: 5 },
  { name: "Green Fit", visits: 3 },
  { name: "Sushi Safe", visits: 2 },
];

const badges = [
  { emoji: "🥇", label: "Explorador" },
  { emoji: "🛡️", label: "Verificador" },
  { emoji: "⭐", label: "Reseñador" },
  { emoji: "💚", label: "Comunidad" },
  { emoji: "🔥", label: "Streak 7 días" },
  { emoji: "🎯", label: "Precisión" },
];

const favorites = [
  { name: "Pizza Sin TACC", place: "La Trattoria" },
  { name: "Bowl Energía", place: "Green Fit" },
];

export default function ProfileTab() {
  return (
    <div className="pb-24 px-5 pt-5">
      {/* User card */}
      <div className="bg-card rounded-2xl p-5 shadow-sm mb-6 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
          <User className="w-7 h-7 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">María García</h2>
          <p className="text-sm text-muted-foreground">Celíaca · Sin lácteos</p>
        </div>
      </div>

      {/* Places visited */}
      <h3 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
        <MapPin className="w-5 h-5 text-secondary" />
        Lugares visitados
      </h3>
      <div className="flex flex-col gap-2 mb-6">
        {placesVisited.map((p) => (
          <div key={p.name} className="bg-card rounded-xl p-3.5 shadow-sm flex justify-between items-center">
            <span className="text-sm font-medium text-foreground">{p.name}</span>
            <span className="text-xs text-muted-foreground">{p.visits} visitas</span>
          </div>
        ))}
      </div>

      {/* Badges */}
      <h3 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
        <Award className="w-5 h-5 text-amber" />
        Insignias y Recompensas
      </h3>
      <div className="grid grid-cols-3 gap-3 mb-6">
        {badges.map((b) => (
          <div key={b.label} className="bg-card rounded-xl p-3 shadow-sm flex flex-col items-center gap-1.5">
            <span className="text-2xl">{b.emoji}</span>
            <span className="text-xs font-medium text-foreground text-center">{b.label}</span>
          </div>
        ))}
      </div>

      {/* Favorites */}
      <h3 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
        <Heart className="w-5 h-5 text-destructive" />
        Favoritos
      </h3>
      <div className="flex flex-col gap-2">
        {favorites.map((f) => (
          <div key={f.name} className="bg-card rounded-xl p-3.5 shadow-sm flex items-center gap-3">
            <Star className="w-4 h-4 text-amber fill-current" />
            <div>
              <p className="text-sm font-medium text-foreground">{f.name}</p>
              <p className="text-xs text-muted-foreground">{f.place}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
