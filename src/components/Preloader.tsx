import { useEffect, useState } from "react";
import logo from "@/assets/logo.png";

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader = ({ onComplete }: PreloaderProps) => {
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, 800);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 1000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div 
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-500 ${
        isFading ? 'bg-transparent' : 'bg-primary'
      }`}
    >
      <div className="animate-pulse flex items-center gap-4 md:gap-6 lg:gap-8">
        <span className="text-3xl md:text-4xl lg:text-5xl font-bold text-white uppercase tracking-wider">
          Materia
        </span>
        <img 
          src={logo} 
          alt="2D Sviluppo Immobiliare" 
          className="h-32 md:h-40 lg:h-48 w-auto opacity-90"
        />
        <span className="text-3xl md:text-4xl lg:text-5xl font-bold text-white uppercase tracking-wider">
          Prima
        </span>
      </div>
    </div>
  );
};
