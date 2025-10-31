import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Calendar } from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";

const Archive = () => {
  const { year, month } = useParams();
  const [user, setUser] = useState<any>(null);
  const [articles, setArticles] = useState<any[]>([]);
  const [years, setYears] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>(year || "");
  const [selectedMonth, setSelectedMonth] = useState<string>(month || "");
  const [loading, setLoading] = useState(true);

  const months = [
    { value: "01", label: "Gennaio" },
    { value: "02", label: "Febbraio" },
    { value: "03", label: "Marzo" },
    { value: "04", label: "Aprile" },
    { value: "05", label: "Maggio" },
    { value: "06", label: "Giugno" },
    { value: "07", label: "Luglio" },
    { value: "08", label: "Agosto" },
    { value: "09", label: "Settembre" },
    { value: "10", label: "Ottobre" },
    { value: "11", label: "Novembre" },
    { value: "12", label: "Dicembre" },
  ];

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    checkUser();
  }, []);

  useEffect(() => {
    fetchYears();
  }, []);

  useEffect(() => {
    if (selectedYear) {
      fetchArticles();
    }
  }, [selectedYear, selectedMonth]);

  const fetchYears = async () => {
    const { data } = await supabase
      .from("articles")
      .select("published_at")
      .eq("status", "published")
      .order("published_at", { ascending: false });

    if (data) {
      const uniqueYears = [...new Set(
        data.map((article) => new Date(article.published_at).getFullYear().toString())
      )];
      setYears(uniqueYears);
      if (uniqueYears.length > 0 && !selectedYear) {
        setSelectedYear(uniqueYears[0]);
      }
    }
  };

  const fetchArticles = async () => {
    setLoading(true);

    let query = supabase
      .from("articles")
      .select(`
        *,
        profiles:author_id (full_name, email),
        categories (name, slug),
        article_tags (
          tags (name, slug)
        )
      `)
      .eq("status", "published")
      .order("published_at", { ascending: false });

    const { data } = await query;

    let filtered = data || [];

    if (selectedYear) {
      filtered = filtered.filter((article) => {
        const articleYear = new Date(article.published_at).getFullYear().toString();
        return articleYear === selectedYear;
      });
    }

    if (selectedMonth) {
      filtered = filtered.filter((article) => {
        const articleMonth = String(new Date(article.published_at).getMonth() + 1).padStart(2, "0");
        return articleMonth === selectedMonth;
      });
    }

    setArticles(filtered);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} />
      
      <main className="flex-1">
        <section className="bg-primary text-primary-foreground py-16">
          <div className="container">
            <h1 className="text-4xl md:text-5xl font-bold uppercase mb-4">
              Archivio Articoli
            </h1>
            <p className="text-xl">
              Sfoglia gli articoli per mese e anno
            </p>
          </div>
        </section>

        <section className="container py-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Seleziona anno" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Tutti i mesi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tutti i mesi</SelectItem>
                {months.map((month) => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="text-center py-12">Caricamento articoli...</div>
          ) : articles.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">Nessun articolo trovato per il periodo selezionato.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <Link key={article.id} to={`/blog/${article.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow overflow-hidden group">
                    {article.cover_image && (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={article.cover_image}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-6 space-y-3">
                      {article.categories && (
                        <Badge variant="secondary" className="uppercase text-xs">
                          {article.categories.name}
                        </Badge>
                      )}
                      <h3 className="text-xl font-bold uppercase line-clamp-2 group-hover:text-primary transition-colors">
                        {article.title}
                      </h3>
                      {article.subtitle && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {article.subtitle}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(article.published_at), "dd MMM yyyy", { locale: it })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {article.views_count}
                        </span>
                      </div>
                      {article.article_tags && article.article_tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-2">
                          {article.article_tags.slice(0, 3).map((at: any, idx: number) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {at.tags.name}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Archive;
