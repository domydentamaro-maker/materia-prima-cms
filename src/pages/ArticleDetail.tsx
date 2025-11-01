import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Eye, User } from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import DOMPurify from "dompurify";

const ArticleDetail = () => {
  const { slug } = useParams();
  const [user, setUser] = useState<any>(null);
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    checkUser();
  }, []);

  useEffect(() => {
    if (slug) {
      fetchArticle();
    }
  }, [slug]);

  const fetchArticle = async () => {
    setLoading(true);
    
    const { data, error } = await supabase
      .from("articles")
      .select(`
        *,
        profiles:author_id (full_name, email),
        categories (name, slug),
        article_tags (
          tags (name, slug)
        )
      `)
      .eq("slug", slug)
      .eq("status", "published")
      .single();

    if (data && !error) {
      setArticle(data);
      
      // Increment view count
      await supabase
        .from("articles")
        .update({ views_count: data.views_count + 1 })
        .eq("id", data.id);
    }
    
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header user={user} />
        <main className="flex-1 container py-12 pt-32 md:pt-36 text-center">
          <p>Caricamento articolo...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header user={user} />
        <main className="flex-1 container py-12 pt-32 md:pt-36 text-center">
          <h1 className="text-4xl font-bold mb-4">Articolo non trovato</h1>
          <Link to="/">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Torna al blog
            </Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} />
      
      <main className="flex-1 pt-24 md:pt-28">
        <article className="container max-w-4xl py-12">
          <Link to="/" className="inline-block mb-8">
            <Button variant="ghost" className="uppercase">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Torna al blog
            </Button>
          </Link>

          {article.categories && (
            <Badge variant="secondary" className="uppercase mb-4">
              {article.categories.name}
            </Badge>
          )}

          <h1 className="text-4xl md:text-5xl font-bold uppercase mb-4">
            {article.title}
          </h1>

          {article.subtitle && (
            <p className="text-xl text-muted-foreground mb-6">
              {article.subtitle}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8 pb-8 border-b">
            <span className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {article.profiles?.full_name || article.profiles?.email}
            </span>
            <span className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {format(new Date(article.published_at), "dd MMMM yyyy", { locale: it })}
            </span>
            <span className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              {article.views_count} visualizzazioni
            </span>
          </div>

          {article.cover_image && (
            <img
              src={article.cover_image}
              alt={article.title}
              className="w-full aspect-video object-cover rounded-lg mb-8"
            />
          )}

          <div 
            className="prose prose-lg max-w-none mb-8"
            dangerouslySetInnerHTML={{ 
              __html: DOMPurify.sanitize(article.content, {
                ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a', 'img', 'ul', 'ol', 'li', 'blockquote', 'code', 'pre'],
                ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'target', 'rel']
              })
            }}
          />

          {article.article_tags && article.article_tags.length > 0 && (
            <div className="pt-8 border-t">
              <h3 className="text-sm font-bold uppercase mb-3">Tag</h3>
              <div className="flex flex-wrap gap-2">
                {article.article_tags.map((at: any, idx: number) => (
                  <Badge key={idx} variant="outline">
                    {at.tags.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default ArticleDetail;
