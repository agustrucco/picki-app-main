import { useState } from "react";
import { ShieldCheck, Star, ArrowRight, ChevronLeft, CheckCircle2, Store } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface B2BRegisterProps {
  onComplete: () => void;
  onBack: () => void;
}

export default function B2BRegister({ onComplete, onBack }: B2BRegisterProps) {
  // Estados del formulario que se reflejarán en la vista previa
  const [name, setName] = useState("");
  const [type, setType] = useState("100% Libre de Gluten");
  const [image, setImage] = useState("");

  // Estado para controlar la pantalla de éxito
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = () => {
    // Guardamos el nombre y tipo para que el Dashboard los recupere
    localStorage.setItem("picki_b2b_name", name || "Tu Local");
    localStorage.setItem("picki_b2b_type", type);

    setShowSuccess(true);
    // Simulamos un tiempo de carga/procesamiento de 2 segundos antes de ir al dashboard
    setTimeout(() => {
      onComplete();
    }, 2000); 
  };

  // Imagen por defecto si el usuario aún no pone ninguna
  const previewImage = image || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
      
      {/* --- MITAD IZQUIERDA: FORMULARIO --- */}
      <div className="flex-1 p-8 md:p-12 flex flex-col justify-center bg-white border-r border-slate-200 z-10 relative">
        <button onClick={onBack} className="absolute top-8 left-8 text-slate-400 hover:text-slate-800 flex items-center gap-1 font-bold text-sm transition-colors">
          <ChevronLeft className="w-4 h-4" /> Volver
        </button>

        <div className="max-w-md mx-auto w-full mt-12">
          <div className="w-16 h-16 bg-violet-100 text-violet-600 rounded-2xl flex items-center justify-center mb-6">
            <Store className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Registra tu local</h1>
          <p className="text-slate-500 mb-8 font-medium">Completa los datos y mira cómo te verán miles de usuarios en Picki al instante.</p>

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Nombre del Local</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Ej: Sintaxis Palermo" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-medium outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Certificación principal</label>
              <select 
                value={type} 
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-medium outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all appearance-none"
              >
                <option>100% Libre de Gluten</option>
                <option>Vegano / Plant Based</option>
                <option>Kosher Certificado</option>
                <option>Sin Lácteos</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">URL de la Imagen (Opcional)</label>
              <input 
                type="text" 
                value={image} 
                onChange={(e) => setImage(e.target.value)} 
                placeholder="https://..." 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-medium outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
              />
            </div>

            <button onClick={handleSubmit} className="w-full mt-4 bg-violet-600 hover:bg-violet-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-violet-600/30 active:scale-[0.98] transition-all">
              Aceptar y Publicar <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* --- MITAD DERECHA: VISTA PREVIA (LIVE PREVIEW) --- */}
      <div className="flex-1 bg-slate-100 p-8 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Fondo decorativo */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        
        <div className="text-center mb-8 relative z-10">
          <span className="bg-violet-200 text-violet-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-3 inline-block">Live Preview</span>
          <h3 className="text-slate-800 font-bold text-lg">Así se verá tu tarjeta en la app</h3>
        </div>

        {/* TARJETA DE PICKI (Idéntica a la que ven los usuarios) */}
        <motion.div layout className="w-full max-w-[280px] bg-white rounded-3xl p-3 shadow-2xl shadow-slate-300/50 border border-slate-100 relative z-10">
          <div className="relative">
            <img src={previewImage} alt="Preview" className="w-full h-40 object-cover rounded-2xl mb-3 bg-slate-200" />
            <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-[11px] font-bold text-slate-700">5.0</span>
            </div>
          </div>
          <div className="px-1 pb-1">
            <h3 className="font-black text-slate-900 text-lg leading-tight mb-1 truncate">
              {name || "Nombre de tu Local"}
            </h3>
            <div className="flex items-center gap-1.5 text-[#009688]">
              <ShieldCheck className="w-4 h-4 flex-shrink-0" />
              <span className="text-xs font-bold truncate">{type}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* --- OVERLAY DE ÉXITO --- */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center px-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} 
              animate={{ scale: 1, y: 0 }} 
              className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">¡Local registrado!</h3>
              <p className="text-sm text-slate-500 font-medium">
                Estamos preparando tu panel de control...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}