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
};

export default function AgentTab({ onSwitchMode }: AgentTabProps) {
  const userName = localStorage.getItem("picki_user_name") || "Agustín";
  const userDiet = localStorage.getItem("picki_user_diet") || "Libre de Gluten";
  
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
      text: `¡Hola ${userName}! Veo que estás por Palermo 📍. Son las ${timeString}hs y hace 12°C, ${timeGreeting}. Teniendo en cuenta tu perfil (${userDiet}), ¿qué te gustaría hacer hoy?`
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showQuickReplies, setShowQuickReplies] = useState(true);

  const [quickReplies, setQuickReplies] = useState(
    isMerienda ? [
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
  );

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
    setMessages(prev => [...prev, { sender: "user", text: textToSend }]);
    setInput("");
    setShowQuickReplies(false); // Ocultamos las sugerencias
    setIsTyping(true); // El bot empieza a "pensar"

    // Lógica conversacional por pasos
    if (step === 0) {
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, { 
          sender: "bot", 
          text: `¡Excelente elección! Para afinar la búsqueda y garantizar tu tranquilidad, ¿preferís un lugar tranquilo para sentarte a charlar o algo rápido al paso?` 
        }]);
        // Actualizamos las respuestas rápidas para la nueva pregunta
        setQuickReplies(["🛋️ Sentarme tranquilo", "🚶‍♂️ Algo al paso"]);
        setShowQuickReplies(true);
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
    <div className="flex flex-col h-[calc(100dvh-70px)] bg-slate-50 font-sans">
      {/* Usamos 100dvh para que la altura sea dinámica en móviles y no se pise con el teclado o Safari */}
      {/* HEADER */}
      <div className="pt-[calc(env(safe-area-inset-top)+1rem)] px-6 pb-4 bg-white shadow-sm flex items-center gap-3 shrink-0 z-10">
        <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center">
          <Bot className="w-6 h-6 text-violet-400" />
        </div>
        <div>
          <h2 className="font-black text-slate-900 text-lg leading-none">Picki Agent</h2>
          <span className="text-[10px] font-bold text-[#009688] uppercase tracking-widest">En línea</span>
        </div>
        <div className="flex-1" />
        <button 
          onClick={switchToClassic}
          className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-all"
        >
          <Store className="w-3.5 h-3.5" /> Clásico
        </button>
      </div>

      {/* ÁREA DE MENSAJES */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
        {messages.map((msg, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={i} 
            className={`flex flex-col max-w-[85%] ${msg.sender === "user" ? "self-end items-end" : "self-start items-start"}`}
          >
            <div className={`p-4 rounded-2xl shadow-sm ${
              msg.sender === "user" 
                ? "bg-[#009688] text-white rounded-tr-none" 
                : "bg-white border border-slate-100 text-slate-700 rounded-tl-none"
            }`}>
              <p className="text-sm font-medium">{msg.text}</p>
            </div>

            {/* RENDERIZADO DE LA TARJETA DEL RESTAURANTE */}
            {msg.card && (
              <div className="mt-2 bg-white border border-slate-100 rounded-[20px] overflow-hidden shadow-md w-[260px] self-start">
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
          </motion.div>
        ))}
        
        {/* INDICADOR DE "ESCRIBIENDO..." */}
        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col max-w-[85%] self-start items-start">
            <div className="bg-white px-4 py-3.5 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 flex items-center gap-1.5 h-[52px]">
              <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></span>
              <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* RESPUESTAS RÁPIDAS */}
      <AnimatePresence>
        {showQuickReplies && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            className="flex gap-2 px-6 pb-2 overflow-x-auto [&::-webkit-scrollbar]:hidden shrink-0 mt-2"
          >
            {quickReplies.map((reply, i) => (
              <button
                key={i}
                onClick={() => handleSend(reply)}
                className="bg-white border border-violet-200 text-violet-700 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap shadow-sm hover:bg-violet-50 hover:border-violet-300 active:scale-95 transition-all"
              >
                {reply}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* INPUT */}
      {/* Quitamos el mb-4 para que quede perfecto con la barra inferior y reducimos a p-3 */}
      <div className="p-3 bg-white border-t border-slate-100 shrink-0">
        <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-100 focus-within:border-violet-300 transition-colors">
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