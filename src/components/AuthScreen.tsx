import pickilogo from "@/assets/picki-logo.png";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

interface AuthScreenProps {
  onSignIn: () => void;
}

export default function AuthScreen({ onSignIn }: AuthScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-6 relative overflow-hidden">
      {/* Círculos decorativos de fondo borrosos (para darle un toque moderno) */}
      <div className="absolute top-[-10%] -left-10 w-72 h-72 bg-[#009688]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] -right-10 w-72 h-72 bg-[#3F51B5]/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center relative z-10"
      >
        <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-slate-100">
          <img src={pickilogo} alt="Picki" className="w-12 h-12" />
        </div>
        
        <h1 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Bienvenido a Picki</h1>
        <div className="flex items-center gap-1.5 mb-8 text-[#009688] bg-[#009688]/10 px-3 py-1 rounded-full">
          <ShieldCheck className="w-4 h-4" />
          <span className="text-xs font-bold">Comer seguro sin fronteras</span>
        </div>

        <button
          onClick={onSignIn}
          className="w-full py-4 px-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center gap-3 font-bold text-slate-700 hover:bg-slate-50 active:scale-[0.98] transition-all mb-4"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continuar con Google
        </button>

        <p className="text-[11px] text-slate-400 text-center font-medium leading-relaxed px-4 mt-2">
          Al continuar, aceptas nuestros <br/>
          <a href="#" className="text-[#009688] underline underline-offset-2">Términos de Servicio</a> y <a href="#" className="text-[#009688] underline underline-offset-2">Política de Privacidad</a>.
        </p>
      </motion.div>
    </div>
  );
}
