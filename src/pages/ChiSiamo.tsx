import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";

const ChiSiamo = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    checkUser();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} />
      
      <main className="flex-1">
        <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-20">
          <div className="container">
            <h1 className="text-4xl md:text-6xl font-bold uppercase mb-4">
              Chi Siamo
            </h1>
            <p className="text-xl md:text-2xl max-w-2xl">
              La nostra storia, la nostra visione
            </p>
          </div>
        </section>

        <section className="container py-20">
          <div className="max-w-4xl mx-auto space-y-12">
            <Card className="p-8">
              <h2 className="text-3xl font-bold uppercase mb-6">La Nostra Missione</h2>
              <p className="text-lg leading-relaxed mb-4">
                2D Sviluppo Immobiliare nasce dalla passione per l'innovazione nel settore edilizio e dalla volontà di creare spazi che migliorino la qualità della vita delle persone.
              </p>
              <p className="text-lg leading-relaxed">
                Con "Materia Prima" vogliamo condividere la nostra visione, le nostre esperienze e le tendenze più innovative del settore immobiliare, promuovendo un approccio sostenibile e tecnologicamente avanzato allo sviluppo urbano.
              </p>
            </Card>

            <Card className="p-8">
              <h2 className="text-3xl font-bold uppercase mb-6">I Nostri Valori</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-bold uppercase mb-2 text-primary">Innovazione</h3>
                  <p className="text-muted-foreground">
                    Utilizziamo le tecnologie più avanzate per creare soluzioni all'avanguardia nel settore immobiliare.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold uppercase mb-2 text-primary">Sostenibilità</h3>
                  <p className="text-muted-foreground">
                    Ogni nostro progetto è pensato per minimizzare l'impatto ambientale e massimizzare l'efficienza energetica.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold uppercase mb-2 text-primary">Qualità</h3>
                  <p className="text-muted-foreground">
                    La cura dei dettagli e l'eccellenza nei materiali sono al centro di ogni nostra realizzazione.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold uppercase mb-2 text-primary">Trasparenza</h3>
                  <p className="text-muted-foreground">
                    Crediamo in una comunicazione chiara e onesta con tutti i nostri stakeholder.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-8">
              <h2 className="text-3xl font-bold uppercase mb-6">Il Nostro Team</h2>
              <p className="text-lg leading-relaxed">
                Il nostro team è composto da professionisti con competenze diverse ma complementari: architetti, ingegneri, designer e esperti di marketing lavorano insieme per trasformare ogni progetto in realtà, dalla concezione alla realizzazione finale.
              </p>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ChiSiamo;
