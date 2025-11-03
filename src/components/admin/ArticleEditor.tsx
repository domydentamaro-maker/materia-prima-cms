import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { X, Upload } from "lucide-react";
import { z } from "zod";

interface ArticleEditorProps {
  article?: any;
  onClose: () => void;
  onSave: () => void;
}

const articleSchema = z.object({
  title: z.string().trim().min(1, "Il titolo è obbligatorio").max(200),
  subtitle: z.string().trim().max(300).optional(),
  slug: z.string().trim().min(1, "Lo slug è obbligatorio").max(200),
  content: z.string().trim().min(1, "Il contenuto è obbligatorio"),
  coverImage: z.string().url("URL immagine non valido").optional().or(z.literal("")),
});

export const ArticleEditor = ({ article, onClose, onSave }: ArticleEditorProps) => {
  const [title, setTitle] = useState(article?.title || "");
  const [subtitle, setSubtitle] = useState(article?.subtitle || "");
  const [slug, setSlug] = useState(article?.slug || "");
  const [content, setContent] = useState(article?.content || "");
  const [coverImage, setCoverImage] = useState(article?.cover_image || "");
  const [categoryId, setCategoryId] = useState(article?.category_id || "");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [status, setStatus] = useState(article?.status || "draft");
  const [categories, setCategories] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
    fetchTags();
    if (article) {
      fetchArticleTags();
    }
  }, [article]);

  useEffect(() => {
    if (title && !article) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setSlug(generatedSlug);
    }
  }, [title, article]);

  const fetchCategories = async () => {
    const { data } = await supabase.from("categories").select("*").order("name");
    if (data) setCategories(data);
  };

  const fetchTags = async () => {
    const { data } = await supabase.from("tags").select("*").order("name");
    if (data) setTags(data);
  };

  const fetchArticleTags = async () => {
    const { data } = await supabase
      .from("article_tags")
      .select("tag_id")
      .eq("article_id", article.id);
    if (data) {
      setSelectedTags(data.map((t) => t.tag_id));
    }
  };

  const handleSave = async () => {
    try {
      articleSchema.parse({ title, subtitle, slug, content, coverImage });
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

    try {
      // Demo mode - use mock user
      const mockUserId = "demo-user-id";

      const articleData = {
        title: title.trim(),
        subtitle: subtitle.trim() || null,
        slug: slug.trim(),
        content: content.trim(),
        cover_image: coverImage.trim() || null,
        category_id: categoryId || null,
        status,
        published_at: status === "published" && !article?.published_at ? new Date().toISOString() : article?.published_at,
        author_id: mockUserId,
      };

      let articleId = article?.id;

      if (article) {
        const { error } = await supabase
          .from("articles")
          .update(articleData)
          .eq("id", article.id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("articles")
          .insert(articleData)
          .select()
          .single();
        if (error) throw error;
        articleId = data.id;
      }

      // Update tags
      await supabase.from("article_tags").delete().eq("article_id", articleId);
      if (selectedTags.length > 0) {
        await supabase.from("article_tags").insert(
          selectedTags.map((tagId) => ({
            article_id: articleId,
            tag_id: tagId,
          }))
        );
      }

      toast({
        title: "Successo",
        description: `Articolo ${article ? "aggiornato" : "creato"} con successo`,
      });

      onSave();
    } catch (error: any) {
      toast({
        title: "Errore",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold uppercase">
          {article ? "Modifica Articolo" : "Nuovo Articolo"}
        </h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titolo *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titolo dell'articolo"
              maxLength={200}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Permalink *</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="permalink-articolo"
              maxLength={200}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="subtitle">Sottotitolo</Label>
          <Input
            id="subtitle"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Breve descrizione"
            maxLength={300}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="coverImage">URL Immagine di Copertina</Label>
          <div className="flex gap-2">
            <Input
              id="coverImage"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://esempio.com/immagine.jpg"
            />
            <Button variant="outline" size="icon">
              <Upload className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Contenuto *</Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Scrivi qui il contenuto dell'articolo..."
            rows={15}
            className="font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground">
            Supporta HTML e Markdown per formattazione
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category">Categoria</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger>
                <SelectValue placeholder="Seleziona categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Stato</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Bozza</SelectItem>
                <SelectItem value="published">Pubblicato</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Tag</Label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Button
                key={tag.id}
                variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setSelectedTags((prev) =>
                    prev.includes(tag.id)
                      ? prev.filter((id) => id !== tag.id)
                      : [...prev, tag.id]
                  );
                }}
              >
                {tag.name}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={onClose}>
            Annulla
          </Button>
          <Button onClick={handleSave} disabled={loading} className="uppercase font-bold">
            {loading ? "Salvataggio..." : "Salva Articolo"}
          </Button>
        </div>
      </div>
    </Card>
  );
};
