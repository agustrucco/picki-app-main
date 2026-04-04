import { useState } from "react";
import { Home, Compass, User } from "lucide-react";
import HomeTab from "./tabs/HomeTab";
import ExploreTab from "./tabs/ExploreTab";
import ProfileTab from "./tabs/ProfileTab";

const tabs = [
  { id: "home", label: "Inicio", icon: Home },
  { id: "explore", label: "Explorar", icon: Compass },
  { id: "profile", label: "Perfil", icon: User },
] as const;

type TabId = (typeof tabs)[number]["id"];

export default function MainApp() {
  const [activeTab, setActiveTab] = useState<TabId>("home");

  return (
    <div className="min-h-screen bg-background">
      {activeTab === "home" && <HomeTab />}
      {activeTab === "explore" && <ExploreTab />}
      {activeTab === "profile" && <ProfileTab />}

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="flex justify-around py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
          {tabs.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-colors ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <tab.icon className={`w-5 h-5 ${active ? "stroke-[2.5]" : ""}`} />
                <span className="text-[10px] font-semibold">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
