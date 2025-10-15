import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Newspaper, Plus } from "lucide-react";
import Header from "@/components/home/Header";
import NewsHero from "@/components/noticias/NewsHero";
import NewsGrid from "@/components/noticias/NewsGrid";
import LoadMoreButton from "@/components/noticias/LoadMoreButton";
import { Button } from "@/components/ui/button";
import Footer from "@/components/landing/Footer";
import { useNews } from "@/contexts/NewsContext";

export default function NewsPage() {
  const navigate = useNavigate();
  const { news: allNews, loading, error } = useNews();
  const [visibleCount, setVisibleCount] = useState(4);

  const featuredNews = allNews.length > 0 ? allNews[0] : null;

  const remainingNews = useMemo(
    () => (featuredNews ? allNews.slice(1) : allNews),
    [featuredNews, allNews]
  );

  const visibleNews = useMemo(() => {
    if (remainingNews.length === 0) {
      return [];
    }
    const limit = Math.min(visibleCount, remainingNews.length);
    return remainingNews.slice(0, limit);
  }, [remainingNews, visibleCount]);

  const canLoadMore = remainingNews.length > visibleNews.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) =>
      Math.min(prev + 2, remainingNews.length || prev + 2)
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-1 items-center justify-center py-16 sm:py-24">
          <p className="text-center text-base text-slate-600 sm:text-lg">
            Cargando noticias...
          </p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-1 items-center justify-center py-16 sm:py-24">
          <p className="text-center text-base text-red-600 sm:text-lg">{error}</p>
        </div>
      );
    }

    if (allNews.length === 0) {
      return (
        <div className="flex flex-1 items-center justify-center py-16 sm:py-24">
          <p className="text-center text-base text-slate-600 sm:text-lg">
            Aun no hay noticias publicadas.
          </p>
        </div>
      );
    }

    return (
      <>
        {featuredNews && (
          <NewsHero
            title={featuredNews.title}
            description={featuredNews.description}
            image={featuredNews.image}
            link={featuredNews.link}
            date={featuredNews.date}
          />
        )}

        {visibleNews.length > 0 && <NewsGrid news={visibleNews} />}

        {canLoadMore && <LoadMoreButton onClick={handleLoadMore} />}
      </>
    );
  };

  return (
    <div>
      <Header />

      <div className="container mx-auto mt-1 px-4 py-4">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-gradient-to-br from-rose-500 via-red-400 to-red-500 p-2">
              <Newspaper className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Noticias y actualizaciones
              </h1>
              <p className="text-sm text-slate-700">
                Mantente al dia con los lanzamientos, eventos y novedades de nuestra comunidad.
              </p>
            </div>
          </div>
          <Button
            className="gap-2 bg-gradient-to-br from-rose-500 via-red-400 to-red-500 hover:from-rose-500 hover:via-red-400 hover:to-red-500"
            onClick={() => navigate("/noticias/crear")}
          >
            <Plus className="h-4 w-4" />
            Crear noticia
          </Button>
        </div>

        {renderContent()}
      </div>

      <Footer />
    </div>
  );
}
