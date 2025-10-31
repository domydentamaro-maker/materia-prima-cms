import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

export const Footer = () => {
  return (
    <footer className="border-t bg-muted/30 mt-20">
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <img src={logo} alt="2D Sviluppo Immobiliare" className="h-12 w-auto mb-4" />
            <p className="text-sm text-muted-foreground">
              Innovazione e qualità nello sviluppo immobiliare.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold uppercase text-sm mb-3">Navigazione</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/chi-siamo" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Chi Siamo
                </Link>
              </li>
              <li>
                <Link to="/contatti" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Contatti
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold uppercase text-sm mb-3">Contatti</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>info@2dsviluppoimmobiliare.it</li>
              <li>Tel: +39 000 000 0000</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} 2D Sviluppo Immobiliare - Materia Prima. Tutti i diritti riservati.
        </div>
      </div>
    </footer>
  );
};
