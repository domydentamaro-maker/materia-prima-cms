import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Plus, LogOut } from "lucide-react";
import { ArticleList } from "@/components/admin/ArticleList";
import { ArticleEditor } from "@/components/admin/ArticleEditor";
import { useAuth } from "@/hooks/useAuth";

const Admin = () => {
  const { user, isAdmin, isLoading, isAuthenticated, isDemoMode, signOut } = useAuth();
  const [showEditor, setShowEditor] = useState(false);
  const [editingArticle, setEditingArticle] = useState<any>(null);
  const navigate = useNavigate();

  // Redirect to auth if not authenticated and not in demo mode
  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isDemoMode) {
      navigate("/auth");
    }
  }, [isLoading, isAuthenticated, isDemoMode, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-lg text-foreground">Caricamento...</p>
      </div>
    );
  }

  // In demo mode, allow access even without authentication
  const canAccess = isAuthenticated ? isAdmin : isDemoMode;

  if (!canAccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <p className="text-lg text-foreground mb-4">Accesso non autorizzato</p>
        <Button onClick={() => navigate("/auth")}>Vai al login</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container py-8 pt-32 md:pt-36">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold uppercase text-foreground">Dashboard Admin</h1>
            {isDemoMode && !isAuthenticated && (
              <p className="text-sm text-muted-foreground mt-1">
                Modalità demo attiva
              </p>
            )}
            {isAuthenticated && user && (
              <p className="text-sm text-muted-foreground mt-1">
                {user.email}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            {isAuthenticated && (
              <Button
                variant="outline"
                onClick={handleSignOut}
                className="uppercase font-bold"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Esci
              </Button>
            )}
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
