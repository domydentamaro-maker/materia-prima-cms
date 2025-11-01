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
    }, 1800);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 2300);

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
      <div className="animate-pulse">
        <img 
          src={logo} 
          alt="2D Sviluppo Immobiliare" 
          className="h-40 md:h-56 lg:h-72 w-auto opacity-90"
        />
      </div>
    </div>
  );
};
