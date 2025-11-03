import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Email non valida").max(255),
  password: z.string().min(6, "La password deve contenere almeno 6 caratteri").max(100),
});

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = () => {
    // Bypass authentication - redirect directly to admin
    toast({
      title: "Accesso effettuato",
      description: "Benvenuto nella dashboard (modalità demo)",
    });
    navigate("/admin");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12 px-4 pt-32 md:pt-36">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold uppercase">Login Admin</CardTitle>
            <CardDescription>
              Accedi alla dashboard per gestire gli articoli
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-center text-muted-foreground">
                Modalità Demo - Accesso diretto alla dashboard
              </p>
              <Button 
                onClick={handleLogin} 
                className="w-full uppercase font-bold" 
                disabled={loading}
              >
                {loading ? "Accesso in corso..." : "Accedi alla Dashboard"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
