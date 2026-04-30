import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, BookOpen, AlertTriangle, ChevronRight, ChevronLeft } from "lucide-react";
import pickilogo from "../assets/picki-logo.png";

interface OnboardingProps {
  onComplete: () => void;
}

const slides = [
  {
    id: "celiac",
    icon: ShieldCheck,
    title: "¿Eres celíaco/a?",
    description: "Queremos asegurarnos de que cada comida sea segura para ti.",
    options: ["Sí", "No", "No estoy seguro/a"],
    multi: false,
  },
  {
    id: "religion",
    icon: BookOpen,
    title: "¿Restricciones religiosas?",
    description: "Respetamos tus creencias y te ayudamos a encontrar opciones adecuadas.",
    options: ["Kosher", "Halal", "Vegetariano/Vegano", "Ninguna"],
    multi: false,
  },
  {
    id: "allergies",
    icon: AlertTriangle,
    title: "¿Alergias alimentarias?",
    description: "Tu seguridad es lo primero. Cuéntanos tus alergias.",
    options: ["Frutos secos", "Lácteos", "Mariscos", "Gluten", "Ninguna"],
    multi: true,
  },
];

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [selections, setSelections] = useState<string[][]>([[], [], []]);

  const next = () => {
    if (step < slides.length - 1) setStep(step + 1);
    else onComplete();
  };

  const prev = () => {
    if (step > 0) setStep(step - 1);
  };

  const toggleOption = (option: string) => {
    const isMulti = slides[step].multi;
    
    setSelections((prevSels) => {
      const current = [...prevSels];
      if (isMulti) {
        const stepSel = current[step];
        current[step] = stepSel.includes(option)
          ? stepSel.filter((o) => o !== option)
          : [...stepSel, option];
      } else {
        current[step] = [option];
      }
      return current;
    });

    if (!isMulti) {
      setTimeout(() => {
        next();
      }, 400);
    }
  };

  const slide = slides[step];
  const Icon = slide.icon;

  return (
    <div className="min-h-screen flex flex-col bg-background relative">
      <div className="flex flex-col items-center pt-10 pb-4">
        <img src={pickilogo} alt="Picki" className="w-16 h-16 mb-2" />
        <p className="text-sm text-muted-foreground font-medium text-center">Comer seguro sin fronteras</p>
      </div>

      <div className="px-6 mb-6">
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                i <= step ? "bg-[#009688]" : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 px-6 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
              <Icon className="w-8 h-8 text-[#009688]" />
            </div>
            <h2 className="text-2xl font-bold text-foreground text-center mb-2">{slide.title}</h2>
            <p className="text-muted-foreground text-center mb-8 text-sm">{slide.description}</p>

            <div className="w-full flex flex-col gap-3">
              {slide.options.map((opt) => {
                const selected = selections[step].includes(opt);
                return (
                  <button
                    key={opt}
                    onClick={() => toggleOption(opt)}
                    className={`w-full py-4 px-5 rounded-xl text-left font-medium transition-all duration-200 ${
                      selected
                        ? "bg-[#009688] text-white shadow-lg shadow-[#009688]/20"
                        : "bg-card text-foreground border border-transparent shadow-sm"
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="p-6 flex gap-3">
        {/* Botón Volver: solo aparece si ya avanzamos de la primera pregunta */}
        {step > 0 && (
          <button
            onClick={prev}
            className={`${slide.multi ? "flex-1" : "w-full"} py-4 rounded-xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-all`}
          >
            Volver
          </button>
        )}

        {/* Botón Siguiente/Comenzar: solo aparece si la pregunta permite selección múltiple */}
        {slide.multi && (
          <button
            onClick={next}
            disabled={selections[step].length === 0}
            className={`${step > 0 ? "flex-[2]" : "w-full"} py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 transition-all ${
              selections[step].length > 0 
              ? "bg-[#3F51B5] text-white shadow-lg" 
              : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
          >
            {step < slides.length - 1 ? "Siguiente" : "Comenzar"}
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
