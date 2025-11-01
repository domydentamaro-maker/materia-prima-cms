import { useEffect, useState } from "react";
import logo from "@/assets/logo.png";

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader = ({ onComplete }: PreloaderProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 300); // Wait for fade out animation
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] bg-primary flex items-center justify-center animate-fade-in">
      <div className="animate-scale-in">
        <img 
          src={logo} 
          alt="2D Sviluppo Immobiliare" 
          className="h-32 md:h-48 lg:h-64 w-auto opacity-90"
        />
      </div>
    </div>
  );
};
