import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Eye, Calendar } from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import heroImage from "@/assets/hero-construction.jpg";

const Index = () => {
  const [user, setUser] = useState<any>(null);
  const [articles, setArticles] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("recent");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    fetchCategories();
    fetchTags();
    fetchArticles();
  }, [selectedCategory, selectedTag, sortBy]);

  const fetchCategories = async () => {
    const { data } = await supabase.from("categories").select("*").order("name");
    if (data) setCategories(data);
  };

  const fetchTags = async () => {
    const { data } = await supabase.from("tags").select("*").order("name");
    if (data) setTags(data);
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
      .eq("status", "published");

    if (selectedCategory !== "all") {
      query = query.eq("category_id", selectedCategory);
    }

    if (sortBy === "recent") {
      query = query.order("published_at", { ascending: false });
    } else if (sortBy === "popular") {
      query = query.order("views_count", { ascending: false });
    } else if (sortBy === "alphabetical") {
      query = query.order("title");
    }

    const { data } = await query;

    let filtered = data || [];
    
    if (selectedTag !== "all") {
      filtered = filtered.filter((article) =>
        article.article_tags?.some((at: any) => at.tags.slug === selectedTag)
      );
    }

    setArticles(filtered);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} />
      
      <main className="flex-1 pt-24 md:pt-28">
        {/* Hero Section */}
        <section className="relative h-screen -mt-24 md:-mt-28 flex items-center justify-center overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroImage})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/60 to-primary/90"></div>
          </div>
          <div className="container relative z-10 text-primary-foreground px-4">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold uppercase mb-6 drop-shadow-2xl tracking-tight">
              Materia Prima
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl max-w-4xl drop-shadow-lg font-normal leading-relaxed">
              Il blog di 2D Sviluppo Immobiliare: innovazione, sostenibilità e visione nel settore edilizio
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="bg-card py-8">
          <div className="container">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Tutte le categorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tutte le categorie</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedTag} onValueChange={setSelectedTag}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Tutti i tag" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tutti i tag</SelectItem>
                  {tags.map((tag) => (
                    <SelectItem key={tag.id} value={tag.slug}>
                      {tag.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Più recenti</SelectItem>
                <SelectItem value="popular">Più letti</SelectItem>
                <SelectItem value="alphabetical">Alfabetico</SelectItem>
              </SelectContent>
            </Select>
          </div>
          </div>
        </section>

        {/* Articles Grid */}
        <section className="container py-12 bg-background">
          {loading ? (
            <div className="text-center py-12">Caricamento articoli...</div>
          ) : articles.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">Nessun articolo trovato con i filtri selezionati.</p>
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

export default Index;
