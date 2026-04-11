import React, { useEffect } from "react";
import { motion } from "framer-motion";

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  useEffect(() => {
    // El splash screen durará exactamente 1 segundo (1000ms) antes de llamar a onFinish
    const timer = setTimeout(() => {
      onFinish();
    }, 1000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-zinc-950"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.4, ease: "easeInOut" } }}
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ 
          type: "spring", 
          damping: 15, 
          stiffness: 150, 
          mass: 0.8 
        }}
      >
        {/* Si tienes un logo en imagen, puedes cambiar este h1 por una etiqueta <img src="/logo.svg" /> */}
        <h1 className="text-6xl font-extrabold tracking-tighter text-zinc-900 dark:text-white">
          picki
        </h1>
      </motion.div>
    </motion.div>
  );
};