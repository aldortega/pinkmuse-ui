import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Newspaper, Plus } from "lucide-react";
import Header from "@/components/home/Header";
import NewsHero from "@/components/noticias/NewsHero";
import NewsGrid from "@/components/noticias/NewsGrid";
import NewsFooter from "@/components/noticias/NewsFooter";
import LoadMoreButton from "@/components/noticias/LoadMoreButton";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";

const formatDate = (value) => {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(parsed);
};

const normalizeNoticia = (noticia) => {
  if (!noticia?.titulo) {
    return null;
  }

  const slug = encodeURIComponent(noticia.titulo);
  const image =
    noticia.imagenPrincipal ||
    (Array.isArray(noticia.imagenes) && noticia.imagenes.length > 0
      ? noticia.imagenes[0]
      : undefined);

  return {
    id: noticia._id || noticia.id || slug,
    slug,
    title: noticia.titulo,
    description: noticia.descripcion,
    image,
    date: formatDate(noticia.fecha),
    rawDate: noticia.fecha,
    link: `/noticias/${slug}`,
  };
};

export default function NewsPage() {
  const [news, setNews] = useState([]);
  const [visibleCount, setVisibleCount] = useState(4);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    const fetchNews = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await api.get("/noticias");
        if (!active) {
          return;
        }

        const fetched = Array.isArray(response?.data?.data)
          ? response.data.data
          : [];

        const normalized = fetched
          .map((item) => normalizeNoticia(item))
          .filter(Boolean);

        const sorted = normalized.sort((a, b) => {
          const dateA = new Date(a.rawDate || 0).getTime();
          const dateB = new Date(b.rawDate || 0).getTime();

          const invalidA = Number.isNaN(dateA);
          const invalidB = Number.isNaN(dateB);

          if (invalidA && invalidB) {
            return 0;
          }
          if (invalidA) {
            return 1;
          }
          if (invalidB) {
            return -1;
          }

          return dateB - dateA;
        });

        setNews(sorted);
      } catch (err) {
        const message =
          err?.response?.data?.message ||
          err?.message ||
          "No fue posible cargar las noticias.";
        setError(message);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchNews();

    return () => {
      active = false;
    };
  }, []);

  const featuredNews = news.length > 0 ? news[0] : null;

  const remainingNews = useMemo(
    () => (featuredNews ? news.slice(1) : news),
    [featuredNews, news]
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
          <p className="text-center text-base text-red-600 sm:text-lg">
            {error}
          </p>
        </div>
      );
    }

    if (news.length === 0) {
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
    <div className="flex min-h-screen flex-col bg-red-50">
      <Header />

      <main className="mx-auto -mt-6 w-full max-w-7xl flex-1 px-4 py-4 sm:px-6 sm:py-12">
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
                Mantente al dia con los lanzamientos, eventos y novedades de
                nuestra comunidad.
              </p>
            </div>
          </div>
          <Button className="gap-2 bg-gradient-to-br from-rose-500 via-red-400 to-red-500 hover:from-rose-500 hover:via-red-400 hover:to-red-500">
            <Plus className="h-4 w-4" />
            Crear noticia
          </Button>
        </div>

        {renderContent()}
      </main>

      <NewsFooter />
    </div>
  );
}
