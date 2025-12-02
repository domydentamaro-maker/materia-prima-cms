import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Calendar, FileText } from "lucide-react";
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

    if (selectedMonth && selectedMonth !== "all") {
      filtered = filtered.filter((article) => {
        const articleMonth = String(new Date(article.published_at).getMonth() + 1).padStart(2, "0");
        return articleMonth === selectedMonth;
      });
    }

    setArticles(filtered);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header user={user} />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-primary text-primary-foreground pt-32 pb-20 md:pt-40 md:pb-28">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold uppercase mb-6">
                Archivio
              </h1>
              <p className="text-lg md:text-xl lg:text-2xl opacity-90 leading-relaxed">
                Sfoglia tutti gli articoli per mese e anno
              </p>
            </div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="py-8 md:py-12 bg-card border-b">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col sm:flex-row gap-4 max-w-md">
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-full sm:w-48 h-12">
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
                <SelectTrigger className="w-full sm:w-48 h-12">
                  <SelectValue placeholder="Tutti i mesi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tutti i mesi</SelectItem>
                  {months.map((month) => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Articles Section */}
        <section className="py-12 md:py-16 bg-background">
          <div className="container px-4 md:px-6">
            {loading ? (
              <div className="text-center py-16">
                <div className="animate-pulse text-muted-foreground">Caricamento articoli...</div>
              </div>
            ) : articles.length === 0 ? (
              <Card className="p-12 md:p-16 text-center border-0 shadow-lg bg-card">
                <FileText className="w-16 h-16 mx-auto mb-6 text-muted-foreground/50" />
                <p className="text-lg text-muted-foreground">
                  Nessun articolo trovato per il periodo selezionato.
                </p>
              </Card>
            ) : (
              <>
                <p className="text-sm text-muted-foreground mb-8">
                  {articles.length} articol{articles.length === 1 ? 'o' : 'i'} trovat{articles.length === 1 ? 'o' : 'i'}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {articles.map((article) => (
                    <Link key={article.id} to={`/blog/${article.slug}`}>
                      <Card className="h-full hover:shadow-xl transition-all duration-300 overflow-hidden group border-0 bg-card">
                        {article.cover_image && (
                          <div className="aspect-video overflow-hidden">
                            <img
                              src={article.cover_image}
                              alt={article.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        )}
                        <div className="p-5 md:p-6 space-y-3">
                          {article.categories && (
                            <Badge variant="secondary" className="uppercase text-xs font-semibold">
                              {article.categories.name}
                            </Badge>
                          )}
                          <h3 className="text-lg md:text-xl font-bold uppercase line-clamp-2 group-hover:text-accent transition-colors">
                            {article.title}
                          </h3>
                          {article.subtitle && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {article.subtitle}
                            </p>
                          )}
                          <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
                            <span className="flex items-center gap-1.5">
                              <Calendar className="h-3.5 w-3.5" />
                              {format(new Date(article.published_at), "dd MMM yyyy", { locale: it })}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Eye className="h-3.5 w-3.5" />
                              {article.views_count}
                            </span>
                          </div>
                          {article.article_tags && article.article_tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-2">
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
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Archive;
