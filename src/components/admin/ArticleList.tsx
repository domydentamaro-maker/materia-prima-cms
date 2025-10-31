import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { it } from "date-fns/locale";

interface ArticleListProps {
  onEdit: (article: any) => void;
}

export const ArticleList = ({ onEdit }: ArticleListProps) => {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("articles")
      .select(`
        *,
        profiles:author_id (full_name, email),
        categories (name),
        article_tags (
          tags (name)
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Errore",
        description: "Impossibile caricare gli articoli",
        variant: "destructive",
      });
    } else {
      setArticles(data || []);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Sei sicuro di voler eliminare questo articolo?")) return;

    const { error } = await supabase.from("articles").delete().eq("id", id);

    if (error) {
      toast({
        title: "Errore",
        description: "Impossibile eliminare l'articolo",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Successo",
        description: "Articolo eliminato",
      });
      fetchArticles();
    }
  };

  if (loading) {
    return <div className="text-center py-12">Caricamento articoli...</div>;
  }

  if (articles.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground">Nessun articolo trovato. Crea il tuo primo articolo!</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {articles.map((article) => (
        <Card key={article.id} className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {article.cover_image && (
              <img
                src={article.cover_image}
                alt={article.title}
                className="w-full md:w-48 h-32 object-cover rounded"
              />
            )}
            <div className="flex-1 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold uppercase">{article.title}</h3>
                  {article.subtitle && (
                    <p className="text-sm text-muted-foreground">{article.subtitle}</p>
                  )}
                </div>
                <Badge variant={article.status === "published" ? "default" : "secondary"}>
                  {article.status === "published" ? "Pubblicato" : "Bozza"}
                </Badge>
              </div>
              
              <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                {article.categories && (
                  <span className="font-semibold">{article.categories.name}</span>
                )}
                <span>•</span>
                <span>{format(new Date(article.created_at), "dd MMM yyyy", { locale: it })}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {article.views_count}
                </span>
              </div>

              {article.article_tags && article.article_tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {article.article_tags.map((at: any, idx: number) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {at.tags.name}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(article)}
                  className="uppercase"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Modifica
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(article.id)}
                  className="uppercase"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Elimina
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
