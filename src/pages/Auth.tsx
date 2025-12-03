import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

// Validation schemas
const loginSchema = z.object({
  email: z.string().trim().email("Email non valida").max(255),
  password: z.string().min(6, "La password deve avere almeno 6 caratteri"),
});

const signUpSchema = z.object({
  email: z.string().trim().email("Email non valida").max(255),
  password: z.string().min(6, "La password deve avere almeno 6 caratteri"),
  fullName: z.string().trim().max(100).optional(),
});

export default function Auth() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, isLoading, isDemoMode, signIn, signUp } = useAuth();

  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpName, setSignUpName] = useState("");

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate("/admin");
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const validatedData = loginSchema.parse({
        email: loginEmail,
        password: loginPassword,
      });

      const { error } = await signIn(validatedData.email, validatedData.password);

      if (error) {
        let errorMessage = "Errore durante il login";
        if (error.message.includes("Invalid login credentials")) {
          errorMessage = "Email o password non corretti";
        } else if (error.message.includes("Email not confirmed")) {
          errorMessage = "Conferma la tua email prima di accedere";
        }
        
        toast({
          variant: "destructive",
          title: "Errore",
          description: errorMessage,
        });
        return;
      }

      toast({
        title: "Accesso effettuato",
        description: "Benvenuto!",
      });

      navigate("/admin");
    } catch (err) {
      if (err instanceof z.ZodError) {
        toast({
          variant: "destructive",
          title: "Errore di validazione",
          description: err.errors[0].message,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const validatedData = signUpSchema.parse({
        email: signUpEmail,
        password: signUpPassword,
        fullName: signUpName || undefined,
      });

      const { error } = await signUp(
        validatedData.email,
        validatedData.password,
        validatedData.fullName
      );

      if (error) {
        let errorMessage = "Errore durante la registrazione";
        if (error.message.includes("User already registered")) {
          errorMessage = "Questo indirizzo email è già registrato";
        }
        
        toast({
          variant: "destructive",
          title: "Errore",
          description: errorMessage,
        });
        return;
      }

      toast({
        title: "Registrazione completata",
        description: "Controlla la tua email per confermare l'account.",
      });

      setActiveTab("login");
    } catch (err) {
      if (err instanceof z.ZodError) {
        toast({
          variant: "destructive",
          title: "Errore di validazione",
          description: err.errors[0].message,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoAccess = () => {
    toast({
      title: "Modalità Demo",
      description: "Accesso diretto alla dashboard",
    });
    navigate("/admin");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-foreground">Caricamento...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 flex items-center justify-center p-4 pt-32">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-foreground">
              Area Riservata
            </CardTitle>
            <CardDescription>
              Accedi o registrati per gestire i contenuti
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "login" | "signup")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Accedi</TabsTrigger>
                <TabsTrigger value="signup">Registrati</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4 mt-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="email@esempio.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Accesso in corso..." : "Accedi"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4 mt-4">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Nome (opzionale)</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Mario Rossi"
                      value={signUpName}
                      onChange={(e) => setSignUpName(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="email@esempio.com"
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Registrazione..." : "Registrati"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {isDemoMode && (
              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground text-center mb-3">
                  Modalità sviluppo attiva
                </p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleDemoAccess}
                >
                  Accesso Demo (solo sviluppo)
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
}
