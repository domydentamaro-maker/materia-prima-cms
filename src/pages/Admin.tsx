import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ArticleList } from "@/components/admin/ArticleList";
import { ArticleEditor } from "@/components/admin/ArticleEditor";
import { useToast } from "@/hooks/use-toast";

const Admin = () => {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingArticle, setEditingArticle] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Bypass authentication - demo mode
    setUser({ id: "demo-user", email: "demo@materiaprim.com" });
    setIsAdmin(true);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Caricamento...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} />
      <main className="flex-1 container py-8 pt-32 md:pt-36">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold uppercase">Dashboard Admin</h1>
          <Button
            onClick={() => {
              setEditingArticle(null);
              setShowEditor(true);
            }}
            className="uppercase font-bold"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nuovo Articolo
          </Button>
        </div>

        {showEditor ? (
          <ArticleEditor
            article={editingArticle}
            onClose={() => {
              setShowEditor(false);
              setEditingArticle(null);
            }}
            onSave={() => {
              setShowEditor(false);
              setEditingArticle(null);
            }}
          />
        ) : (
          <ArticleList
            onEdit={(article) => {
              setEditingArticle(article);
              setShowEditor(true);
            }}
          />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
