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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-3">
          <img src={logo} alt="2D Sviluppo Immobiliare" className="h-10 w-auto" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            to="/"
            className={`text-sm font-bold uppercase tracking-wider transition-colors hover:text-primary ${
              isActive("/") ? "text-primary" : "text-foreground"
            }`}
          >
            Blog
          </Link>
          <Link
            to="/chi-siamo"
            className={`text-sm font-bold uppercase tracking-wider transition-colors hover:text-primary ${
              isActive("/chi-siamo") ? "text-primary" : "text-foreground"
            }`}
          >
            Chi Siamo
          </Link>
          <Link
            to="/contatti"
            className={`text-sm font-bold uppercase tracking-wider transition-colors hover:text-primary ${
              isActive("/contatti") ? "text-primary" : "text-foreground"
            }`}
          >
            Contatti
          </Link>
          {user ? (
            <>
              <Link
                to="/admin"
                className={`text-sm font-bold uppercase tracking-wider transition-colors hover:text-primary ${
                  isActive("/admin") ? "text-primary" : "text-foreground"
                }`}
              >
                Dashboard
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="uppercase"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <Link to="/login">
              <Button variant="default" size="sm" className="uppercase font-bold">
                Login
              </Button>
            </Link>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="container flex flex-col space-y-4 py-4">
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
