import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Building2, Leaf, Award, Users } from "lucide-react";

const ChiSiamo = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    checkUser();
  }, []);

  const valori = [
    {
      icon: Building2,
      title: "Innovazione",
      description: "Utilizziamo le tecnologie più avanzate per creare soluzioni all'avanguardia nel settore immobiliare."
    },
    {
      icon: Leaf,
      title: "Sostenibilità",
      description: "Ogni nostro progetto è pensato per minimizzare l'impatto ambientale e massimizzare l'efficienza energetica."
    },
    {
      icon: Award,
      title: "Qualità",
      description: "La cura dei dettagli e l'eccellenza nei materiali sono al centro di ogni nostra realizzazione."
    },
    {
      icon: Users,
      title: "Trasparenza",
      description: "Crediamo in una comunicazione chiara e onesta con tutti i nostri stakeholder."
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
                Chi Siamo
              </h1>
              <p className="text-lg md:text-xl lg:text-2xl opacity-90 leading-relaxed">
                La nostra storia, la nostra visione per il futuro dell'edilizia
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 md:py-24 bg-card">
          <div className="container px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <Card className="p-6 md:p-10 lg:p-12 shadow-lg border-0">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold uppercase mb-6 text-card-foreground">
                  La Nostra Missione
                </h2>
                <div className="space-y-4 text-base md:text-lg leading-relaxed text-muted-foreground">
                  <p>
                    2D Sviluppo Immobiliare nasce dalla passione per l'innovazione nel settore edilizio e dalla volontà di creare spazi che migliorino la qualità della vita delle persone.
                  </p>
                  <p>
                    Con "Materia Prima" vogliamo condividere la nostra visione, le nostre esperienze e le tendenze più innovative del settore immobiliare, promuovendo un approccio sostenibile e tecnologicamente avanzato allo sviluppo urbano.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold uppercase text-foreground">
                I Nostri Valori
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-6xl mx-auto">
              {valori.map((valore, index) => (
                <Card key={index} className="p-6 md:p-8 text-center hover:shadow-xl transition-shadow duration-300 border-0 bg-card">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-accent/20 flex items-center justify-center">
                    <valore.icon className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold uppercase mb-3 text-card-foreground">
                    {valore.title}
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    {valore.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 md:py-24 bg-card">
          <div className="container px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <Card className="p-6 md:p-10 lg:p-12 shadow-lg border-0">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold uppercase mb-6 text-card-foreground">
                  Il Nostro Team
                </h2>
                <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
                  Il nostro team è composto da professionisti con competenze diverse ma complementari: architetti, ingegneri, designer e esperti di marketing lavorano insieme per trasformare ogni progetto in realtà, dalla concezione alla realizzazione finale.
                </p>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ChiSiamo;
