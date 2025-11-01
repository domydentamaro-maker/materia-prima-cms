import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin } from "lucide-react";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Il nome è obbligatorio").max(100),
  email: z.string().trim().email("Email non valida").max(255),
  message: z.string().trim().min(1, "Il messaggio è obbligatorio").max(1000),
});

const Contatti = () => {
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    checkUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      contactSchema.parse({ name, email, message });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Errore di validazione",
          description: error.errors[0].message,
          variant: "destructive",
        });
        return;
      }
    }

    setLoading(true);

    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Messaggio inviato",
        description: "Ti risponderemo al più presto!",
      });
      setName("");
      setEmail("");
      setMessage("");
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} />
      
      <main className="flex-1 pt-24 md:pt-28">
        <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-20">
          <div className="container">
            <h1 className="text-4xl md:text-6xl font-bold uppercase mb-4">
              Contatti
            </h1>
            <p className="text-xl md:text-2xl max-w-2xl">
              Siamo qui per ascoltarti
            </p>
          </div>
        </section>

        <section className="container py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div className="space-y-8">
              <Card className="p-6">
                <h2 className="text-2xl font-bold uppercase mb-6">Informazioni di Contatto</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <Mail className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="font-bold">Email</p>
                      <p className="text-muted-foreground">info@2dsviluppoimmobiliare.it</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Phone className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="font-bold">Telefono</p>
                      <p className="text-muted-foreground">+39 000 000 0000</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <MapPin className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="font-bold">Indirizzo</p>
                      <p className="text-muted-foreground">
                        Via Esempio 123<br />
                        00100 Roma, Italia
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-bold uppercase mb-4">Orari di Apertura</h3>
                <div className="space-y-2 text-muted-foreground">
                  <p>Lunedì - Venerdì: 9:00 - 18:00</p>
                  <p>Sabato: Su appuntamento</p>
                  <p>Domenica: Chiuso</p>
                </div>
              </Card>
            </div>

            <Card className="p-6">
              <h2 className="text-2xl font-bold uppercase mb-6">Inviaci un Messaggio</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Il tuo nome"
                    required
                    maxLength={100}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tua@email.it"
                    required
                    maxLength={255}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Messaggio *</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Scrivi qui il tuo messaggio..."
                    rows={6}
                    required
                    maxLength={1000}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full uppercase font-bold"
                  disabled={loading}
                >
                  {loading ? "Invio in corso..." : "Invia Messaggio"}
                </Button>
              </form>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contatti;
