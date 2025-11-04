import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logo.png";

interface HeaderProps {
  user?: any;
}

export const Header = ({ user }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { toast } = useToast();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Errore",
        description: "Impossibile effettuare il logout",
        variant: "destructive",
      });
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 z-50 w-full bg-transparent transition-all">
      <div className="container flex h-24 md:h-28 items-center justify-between gap-4">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="2D Sviluppo Immobiliare" className="h-20 md:h-24 w-auto" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
          <Link
            to="/"
            className={`text-sm font-bold uppercase tracking-wider transition-colors hover:text-accent ${
              isActive("/") ? "text-accent" : "text-primary-foreground"
            }`}
          >
            Blog
          </Link>
          <Link
            to="/chi-siamo"
            className={`text-sm font-bold uppercase tracking-wider transition-colors hover:text-accent ${
              isActive("/chi-siamo") ? "text-accent" : "text-primary-foreground"
            }`}
          >
            Chi Siamo
          </Link>
          <Link
            to="/contatti"
            className={`text-sm font-bold uppercase tracking-wider transition-colors hover:text-accent ${
              isActive("/contatti") ? "text-accent" : "text-primary-foreground"
            }`}
          >
            Contatti
          </Link>
          <Link
            to="/archivio"
            className={`text-sm font-bold uppercase tracking-wider transition-colors hover:text-accent ${
              isActive("/archivio") ? "text-accent" : "text-primary-foreground"
            }`}
          >
            Archivio
          </Link>
          {user ? (
            <>
              <Link
                to="/admin"
                className={`text-sm font-bold uppercase tracking-wider transition-colors hover:text-accent ${
                  isActive("/admin") ? "text-accent" : "text-primary-foreground"
                }`}
              >
                Dashboard
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="uppercase text-primary-foreground hover:text-accent hover:bg-accent/10"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <Link to="/login">
              <Button variant="secondary" size="sm" className="uppercase font-bold">
                Login
              </Button>
            </Link>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-primary-foreground"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-accent/20 bg-primary/95 backdrop-blur-md">
          <nav className="container flex flex-col space-y-4 py-6 text-primary-foreground">
            <Link
              to="/"
              className="text-sm font-bold uppercase tracking-wider"
              onClick={() => setIsMenuOpen(false)}
            >
              Blog
            </Link>
            <Link
              to="/chi-siamo"
              className="text-sm font-bold uppercase tracking-wider"
              onClick={() => setIsMenuOpen(false)}
            >
              Chi Siamo
            </Link>
            <Link
              to="/contatti"
              className="text-sm font-bold uppercase tracking-wider"
              onClick={() => setIsMenuOpen(false)}
            >
              Contatti
            </Link>
            <Link
              to="/archivio"
              className="text-sm font-bold uppercase tracking-wider"
              onClick={() => setIsMenuOpen(false)}
            >
              Archivio
            </Link>
            {user ? (
              <>
                <Link
                  to="/admin"
                  className="text-sm font-bold uppercase tracking-wider"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="uppercase justify-start"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                <Button variant="default" size="sm" className="uppercase font-bold w-full">
                  Login
                </Button>
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};
