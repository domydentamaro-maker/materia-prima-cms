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
import { Mail, Phone, MapPin, Clock } from "lucide-react";
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

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      content: "info@2dsviluppoimmobiliare.it"
    },
    {
      icon: Phone,
      title: "Telefono",
      content: "+39 000 000 0000"
    },
    {
      icon: MapPin,
      title: "Indirizzo",
      content: "Via Esempio 123, 00100 Roma, Italia"
    },
    {
      icon: Clock,
      title: "Orari",
      content: "Lun - Ven: 9:00 - 18:00"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header user={user} />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-primary text-primary-foreground pt-32 pb-20 md:pt-40 md:pb-28">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold uppercase mb-6">
                Contatti
              </h1>
              <p className="text-lg md:text-xl lg:text-2xl opacity-90 leading-relaxed">
                Siamo qui per ascoltarti e rispondere alle tue domande
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 md:py-24 bg-card">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 max-w-6xl mx-auto">
              {/* Contact Info */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold uppercase mb-8 text-card-foreground">
                    Informazioni di Contatto
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                    {contactInfo.map((info, index) => (
                      <Card key={index} className="p-5 md:p-6 border-0 shadow-md hover:shadow-lg transition-shadow">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                            <info.icon className="h-5 w-5 text-accent" />
                          </div>
                          <div>
                            <p className="font-bold text-card-foreground mb-1">{info.title}</p>
                            <p className="text-muted-foreground text-sm md:text-base">{info.content}</p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <Card className="p-6 md:p-8 lg:p-10 border-0 shadow-lg">
                <h2 className="text-2xl md:text-3xl font-bold uppercase mb-8 text-card-foreground">
                  Inviaci un Messaggio
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-semibold">Nome *</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Il tuo nome"
                      required
                      maxLength={100}
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-semibold">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tua@email.it"
                      required
                      maxLength={255}
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-sm font-semibold">Messaggio *</Label>
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Scrivi qui il tuo messaggio..."
                      rows={6}
                      required
                      maxLength={1000}
                      className="resize-none"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full uppercase font-bold h-12 text-base"
                    disabled={loading}
                  >
                    {loading ? "Invio in corso..." : "Invia Messaggio"}
                  </Button>
                </form>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contatti;
