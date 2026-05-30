import { useState, useRef, useEffect } from "react";
import { Bot, Send, Store } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AgentTab() {
  const userName = localStorage.getItem("picki_user_name") || "Agustín";
  const userDiet = localStorage.getItem("picki_user_diet") || "Libre de Gluten";
  
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: `¡Hola ${userName}! Conozco tu dieta (${userDiet}). Dime, ¿tienes algún antojo hoy o buscas recomendaciones por una zona específica?`
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showQuickReplies, setShowQuickReplies] = useState(true);

  const quickReplies = [
    "🍕 Antojo de pizza",
    "🍝 Pastas seguras",
    "☕ Cafetería linda",
    "🥗 Algo sano y liviano"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (textOverride?: string) => {
    // Si recibimos un texto por parámetro (click en respuesta rápida) usamos ese, sino el input.
    const textToSend = typeof textOverride === 'string' ? textOverride : input;
    if (!textToSend.trim()) return;
    
    // Agregar mensaje del usuario
    setMessages(prev => [...prev, { sender: "user", text: textToSend }]);
    setInput("");
    setShowQuickReplies(false); // Ocultamos las sugerencias

    // Simular respuesta de la IA basada en lo que pide el usuario
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        sender: "bot", 
        text: `¡Entendido! Buscando la mejor opción segura de ${userDiet} relacionada con "${textToSend}"... (Simulación: Aquí la IA devolvería una tarjeta de restaurante).` 
      }]);
    }, 1500);
  };

  const switchToClassic = () => {
    localStorage.setItem("picki_app_mode", "classic");
    window.location.reload(); // Recargamos para que MainApp lea la nueva preferencia
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-slate-50 font-sans">
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
          </motion.div>
        ))}
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
      <div className="p-4 bg-white border-t border-slate-100 shrink-0 mb-4">
        <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-100 focus-within:border-violet-300 transition-colors">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="¿Qué quieres comer hoy?" 
            className="flex-1 bg-transparent px-3 py-2 text-sm font-medium outline-none text-slate-800" 
          />
          <button onClick={() => handleSend()} className="w-10 h-10 bg-slate-900 hover:bg-violet-600 rounded-xl flex items-center justify-center text-white active:scale-90 transition-all">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}