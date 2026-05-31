import { useState, useRef, useEffect } from "react";
import { Bot, Send, Store, MapPin, MessageCircle, Star, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AgentTabProps {
  onSwitchMode?: () => void;
}

type CardData = {
  name: string;
  image: string;
  rating: number;
  type: string;
  address: string;
  phone: string;
};

type Message = {
  sender: "bot" | "user";
  text: string;
  card?: CardData;
  options?: string[];
};

export default function AgentTab({ onSwitchMode }: AgentTabProps) {
  const userName = localStorage.getItem("picki_user_name") || "Agustín";
  const userDiet = localStorage.getItem("picki_user_diet") || "Libre de Gluten";
  
  // Avatar generado dinámicamente para el Agente con su característico fondo violeta
  const botAvatarUrl = "https://api.dicebear.com/7.x/bottts/svg?seed=Picki&backgroundColor=7c3aed";

  const [step, setStep] = useState(0);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  // Calculamos hora dinámica real del dispositivo
  const hour = new Date().getHours();
  const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  const isMerienda = hour >= 15 && hour < 19;
  const timeGreeting = isMerienda ? "ideal para algo calentito ☕" : "ideal para disfrutar algo rico 🍽️";
  
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: `¡Hola ${userName}! Veo que estás por Palermo 📍. Son las ${timeString}hs y hace 12°C, ${timeGreeting}. Teniendo en cuenta tu perfil (${userDiet}), ¿qué te gustaría hacer hoy?`,
      options: isMerienda ? [
        "☕ Cafetería y algo dulce",
        "🍵 Té y tostado salado",
        "🍕 No, prefiero cenar temprano",
        "🥗 Tengo otro antojo"
      ] : [
        "🍕 Antojo de pizza",
        "🍝 Pastas seguras",
        "🍻 Bar con opciones",
        "🥗 Algo sano y liviano"
      ]
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Ref para delimitar el área donde se puede arrastrar el botón flotante
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (textOverride?: string) => {
    // Si recibimos un texto por parámetro (click en respuesta rápida) usamos ese, sino el input.
    const textToSend = typeof textOverride === 'string' ? textOverride : input;
    if (!textToSend.trim()) return;
    
    // Agregar mensaje del usuario
    setMessages(prev => {
      const updated = [...prev];
      const lastMsgIdx = updated.length - 1;
      // Le quitamos las opciones al mensaje anterior del bot para que desaparezcan de la pantalla
      if (lastMsgIdx >= 0 && updated[lastMsgIdx].sender === "bot") {
        updated[lastMsgIdx] = { ...updated[lastMsgIdx], options: undefined };
      }
      return [...updated, { sender: "user", text: textToSend }];
    });
    setInput("");
    setIsTyping(true); // El bot empieza a "pensar"

    // Lógica conversacional por pasos
    if (step === 0) {
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, { 
          sender: "bot", 
          text: `¡Excelente elección! Para afinar la búsqueda y garantizar tu tranquilidad, ¿preferís un lugar tranquilo para sentarte a charlar o algo rápido al paso?`,
          options: ["🛋️ Sentarme tranquilo", "🚶‍♂️ Algo al paso"]
        }]);
        setStep(1);
      }, 1200);
    } else if (step === 1) {
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, { 
          sender: "bot", 
          text: `¡Entendido! Cruzando los protocolos de seguridad de los locales con tu perfil...` 
        }]);
        setIsTyping(true);
        
        // Simulamos que luego de pensar, envía el resultado final
        setTimeout(() => {
          setIsTyping(false);
          setMessages(prev => [...prev, { 
            sender: "bot", 
            text: `¡Encontré la opción perfecta! "Sintaxis Palermo" tiene certificación verificada. ¿Te reservo una mesa?`,
            card: {
              name: "Sintaxis Palermo",
              image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80",
              rating: 4.8,
              type: "100% Libre de Gluten",
              address: "Nicaragua 4849, Palermo",
              phone: "5491156535755" // Número formateado para WhatsApp (con 549 y sin el 0)
            }
          }]);
          setStep(2);
        }, 2000);
      }, 1000);
    } else {
      // Para cualquier mensaje posterior a la reserva
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, { 
          sender: "bot", 
          text: `¡Hecho! Avisame si necesitas algo más.` 
        }]);
      }, 1000);
    }
  };

  const switchToClassic = () => {
    if (onSwitchMode) onSwitchMode();
  };

  return (
    <div ref={containerRef} className="flex flex-col h-[calc(100dvh-70px)] bg-slate-50 font-sans relative overflow-hidden">
      {/* Usamos 100dvh para que la altura sea dinámica en móviles y no se pise con el teclado o Safari */}
      {/* HEADER */}
      <div className="pt-[calc(env(safe-area-inset-top)+1rem)] px-6 pb-4 bg-white shadow-sm flex items-center gap-3 shrink-0 z-10">
        <img src={botAvatarUrl} alt="Picki Agent" className="w-10 h-10 rounded-2xl shadow-sm border border-slate-100 object-cover" />
        <div>
          <h2 className="font-black text-slate-900 text-lg leading-none">Picki Agent</h2>
          <span className="text-[10px] font-bold text-[#009688] uppercase tracking-widest">En línea</span>
        </div>
      </div>

      {/* ÁREA DE MENSAJES */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
        {messages.map((msg, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={i} 
            className={`flex gap-3 max-w-[85%] ${msg.sender === "user" ? "self-end flex-row-reverse" : "self-start"}`}
          >
            {/* Avatar del Bot al lado del mensaje */}
            {msg.sender === "bot" && (
              <img src={botAvatarUrl} alt="Picki" className="w-8 h-8 rounded-full shadow-sm border border-slate-100 flex-shrink-0 mt-1 object-cover" />
            )}

            <div className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"} w-full`}>
              <div className={`p-4 rounded-2xl shadow-sm ${
                msg.sender === "user" 
                  ? "bg-[#009688] text-white rounded-tr-none" 
                  : "bg-white border border-slate-100 text-slate-700 rounded-tl-none"
              }`}>
                <p className="text-sm font-medium whitespace-pre-wrap">{msg.text}</p>
              </div>

            {/* RENDERIZADO DE LA TARJETA DEL RESTAURANTE */}
            {msg.card && (
              <div className="mt-2 bg-white border border-slate-100 rounded-[20px] overflow-hidden shadow-md w-[260px]">
                <img src={msg.card.image} alt={msg.card.name} className="w-full h-28 object-cover bg-slate-100" />
                <div className="p-3.5 pb-4">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-slate-900 leading-tight">{msg.card.name}</h3>
                    <div className="flex items-center gap-1 bg-amber-50 px-1.5 py-0.5 rounded text-amber-600 shrink-0">
                      <Star className="w-3 h-3 fill-current" />
                      <span className="text-[10px] font-bold">{msg.card.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[#009688] mb-4">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold tracking-wide">{msg.card.type}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <a 
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(msg.card.name + " " + msg.card.address)}`}
                      target="_blank" rel="noopener noreferrer"
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Llegar</span>
                    </a>
                    <a 
                      href={`https://wa.me/${msg.card.phone}?text=${encodeURIComponent(`¡Hola! Encontré su local por Picki y quería hacer una consulta/reserva para personas con dieta ${userDiet}.`)}`}
                      target="_blank" rel="noopener noreferrer"
                      className="flex-1 bg-violet-600 hover:bg-violet-700 text-white py-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-lg shadow-violet-600/30"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Reservar</span>
                    </a>
                  </div>
                </div>
              </div>
            )}
            
            {/* OPCIONES INTEGRADAS ESTILO CLAUDE */}
            {msg.options && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-2 mt-3 w-full min-w-[220px]">
                {msg.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(opt)}
                    className="bg-white border border-violet-200 text-violet-700 px-4 py-3 rounded-2xl text-xs font-bold text-left shadow-sm hover:bg-violet-50 active:scale-95 transition-all flex items-center justify-between"
                  >
                    {opt}
                  </button>
                ))}
              </motion.div>
            )}
            </div>
          </motion.div>
        ))}
        
        {/* INDICADOR DE "ESCRIBIENDO..." */}
        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 max-w-[85%] self-start items-start">
            <img src={botAvatarUrl} alt="Picki" className="w-8 h-8 rounded-full shadow-sm border border-slate-100 flex-shrink-0 mt-1 object-cover" />
            <div className="bg-white px-4 py-4 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 flex items-center gap-1.5 h-[48px]">
              <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></span>
              <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* BOTÓN FLOTANTE ARRASTRABLE: VOLVER A EXPLORAR */}
        <motion.button
          drag
          dragConstraints={containerRef}
          dragMomentum={false}
          dragElastic={0.1}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={switchToClassic}
          className="absolute bottom-24 right-6 z-[5000] w-14 h-14 bg-white border border-slate-200 rounded-full shadow-2xl flex flex-col items-center justify-center gap-0.5 active:bg-slate-50 transition-all text-slate-600 cursor-grab active:cursor-grabbing"
        >
          {/* pointer-events-none para que el drag y el click funcionen bien en toda el área */}
          <Store className="w-5 h-5 text-[#009688] pointer-events-none" />
          <span className="text-[8px] font-bold uppercase tracking-wider pointer-events-none">Explorar</span>
        </motion.button>

      {/* INPUT */}
      {/* Quitamos el mb-4 para que quede perfecto con la barra inferior y reducimos a p-3 */}
      <div className="p-3 bg-white border-t border-slate-100 shrink-0">
        <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-100 focus-within:border-[#009688]/50 transition-colors">
          {/* text-base (16px) es OBLIGATORIO en móviles para que Safari/iOS no haga zoom automático al tipear */}
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="¿Qué quieres comer hoy?" 
            className="flex-1 bg-transparent px-3 py-2 text-base font-medium outline-none text-slate-800 placeholder:text-slate-400" 
          />
          <button onClick={() => handleSend()} className="w-10 h-10 bg-slate-900 hover:bg-violet-600 rounded-xl flex items-center justify-center text-white active:scale-90 transition-all">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}