import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

export const Footer = () => {
  return (
    <footer className="border-t border-border mt-20" style={{ background: 'linear-gradient(135deg, hsl(42 90% 60%) 0%, hsl(42 80% 70%) 100%)' }}>
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <img src={logo} alt="2D Sviluppo Immobiliare" className="h-12 w-auto mb-4" />
            <p className="text-sm text-muted-foreground">
              Innovazione e qualità nello sviluppo immobiliare.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold uppercase text-sm mb-3 text-primary">Navigazione</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-primary hover:text-primary-foreground transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/chi-siamo" className="text-sm text-primary hover:text-primary-foreground transition-colors">
                  Chi Siamo
                </Link>
              </li>
              <li>
                <Link to="/contatti" className="text-sm text-primary hover:text-primary-foreground transition-colors">
                  Contatti
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold uppercase text-sm mb-3 text-primary">Contatti</h3>
            <ul className="space-y-2 text-sm text-primary">
              <li>info@2dsviluppoimmobiliare.it</li>
              <li>Tel: +39 000 000 0000</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-primary/20 text-center text-sm text-primary">
          © {new Date().getFullYear()} 2D Sviluppo Immobiliare - Materia Prima. Tutti i diritti riservati.
        </div>
      </div>
    </footer>
  );
};
