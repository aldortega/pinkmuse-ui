import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Header from "@/components/home/Header";
import Footer from "@/components/landing/Footer";
import NewsDetailContent from "@/components/news/newsdetail/NewsDetailContent";
import api from "@/lib/axios";
import { useNews } from "@/contexts/NewsContext";

const formatDate = (value) => {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return new Intl.DateTimeFormat("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(parsed);
};

const splitDescription = (text) => {
  if (!text) return [];
  return text
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
};

const computeReadingTime = (text) => {
  if (!text || typeof text !== "string") return null;
  const words = text.split(/\s+/).filter(Boolean).length;
  if (words === 0) return null;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min de lectura`;
};

export default function NewsDetailPage() {
  const { slug } = useParams();
  const {
    news: normalizedNews,
    loading: newsLoading,
    error: newsError,
    getArticleBySlug,
    deleteArticle,
  } = useNews();

  const articleFromContext = useMemo(
    () => (slug ? getArticleBySlug(slug) : null),
    [slug, getArticleBySlug]
  );

  const [fallbackArticle, setFallbackArticle] = useState(null);
  const [fallbackError, setFallbackError] = useState(null);
  const [isFallbackLoading, setIsFallbackLoading] = useState(false);
  const [actionError, setActionError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    setFallbackArticle(null);
    setFallbackError(null);

    if (!slug) {
      setFallbackError("Articulo no encontrado");
      return () => {
        active = false;
      };
    }

    if (articleFromContext || newsLoading) {
      return () => {
        active = false;
      };
    }

    if (newsError) {
      setFallbackError(newsError);
      return () => {
        active = false;
      };
    }

    const fetchArticle = async () => {
      setIsFallbackLoading(true);
      try {
        let decodedSlug = slug;
        try {
          decodedSlug = decodeURIComponent(slug);
        } catch {
          decodedSlug = slug;
        }
        const response = await api.get(
          `/noticias/${encodeURIComponent(decodedSlug)}`
        );
        if (!active) {
          return;
        }

        const data = response?.data?.data;
        if (data) {
          setFallbackArticle(data);
        } else {
          setFallbackError("Articulo no encontrado");
        }
      } catch (err) {
        if (!active) {
          return;
        }
        const message =
          err?.response?.data?.message ||
          err?.message ||
          "No fue posible cargar la noticia.";
        setFallbackError(message);
      } finally {
        if (active) {
          setIsFallbackLoading(false);
        }
      }
    };

    fetchArticle();

    return () => {
      active = false;
    };
  }, [slug, articleFromContext, newsLoading, newsError]);

  const article = articleFromContext || fallbackArticle;
  const combinedLoading = newsLoading || isFallbackLoading;
  const combinedError = fallbackError;

  useEffect(() => {
    setActionError(null);
    setIsDeleting(false);
  }, [article?.titulo, article?._id]);

  const formattedDate = useMemo(
    () => formatDate(article?.fecha),
    [article?.fecha]
  );

  const descriptionParagraphs = useMemo(
    () => splitDescription(article?.descripcion),
    [article?.descripcion]
  );

  const readingTime = useMemo(
    () => computeReadingTime(article?.descripcion),
    [article?.descripcion]
  );

  const galleryImages = useMemo(() => {
    if (!article) return [];
    const collection = Array.isArray(article.imagenes) ? article.imagenes : [];
    const unique = [...new Set(collection.filter(Boolean))];
    return unique.filter((url) => url !== article.imagenPrincipal);
  }, [article]);

  const relatedArticles = useMemo(() => {
    if (!article || !normalizedNews?.length) return [];
    const currentId = article._id || article.id;
    return normalizedNews.filter((item) => item.id !== currentId).slice(0, 3);
  }, [article, normalizedNews]);

  const articleSlug = useMemo(() => {
    if (slug) return slug;
    if (article?.titulo) return encodeURIComponent(article.titulo);
    return "";
  }, [slug, article?.titulo]);

  const canEdit = Boolean(articleSlug);
  const canDelete = Boolean(article?.titulo);

  const handleEdit = () => {
    if (!canEdit) {
      return;
    }
    navigate(`/noticias/${articleSlug}/editar`);
  };

  const handleDelete = async () => {
    if (!canDelete || !article?.titulo) {
      return;
    }
    const confirmed = window.confirm(
      "Seguro que deseas eliminar esta noticia?"
    );
    if (!confirmed) {
      return;
    }
    setIsDeleting(true);
    setActionError(null);
    try {
      await deleteArticle(article.titulo);
      navigate("/noticias");
    } catch (err) {
      const message = err?.message || "No fue posible eliminar la noticia.";
      setActionError(message);
    } finally {
      setIsDeleting(false);
    }
  };

  if (combinedLoading) {
    return (
      <div>
        <Header />
        <main className="flex min-h-[60vh] items-center justify-center bg-gradient-to-b from-white via-rose-50/40 to-white">
          <p className="px-4 text-center text-base text-slate-600 sm:px-6 sm:text-lg">
            Cargando noticia...
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  if (combinedError || !article) {
    return (
      <div>
        <Header />
        <main className="flex min-h-[60vh] items-center justify-center bg-gradient-to-b from-white via-rose-50/40 to-white">
          <div className="px-4 text-center sm:px-6">
            <h1 className="mb-4 text-3xl font-bold text-slate-900 sm:text-4xl">
              Articulo no encontrado
            </h1>
            <p className="text-base text-gray-600 sm:text-lg">
              {combinedError || "La noticia que estas buscando no existe."}
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <main className="bg-gradient-to-b from-white via-rose-50/40 to-white">
        <NewsDetailContent
          article={article}
          formattedDate={formattedDate}
          readingTime={readingTime}
          descriptionParagraphs={descriptionParagraphs}
          galleryImages={galleryImages}
          relatedArticles={relatedArticles}
          articleSlug={articleSlug}
          canEdit={canEdit}
          canDelete={canDelete}
          isDeleting={isDeleting}
          onEdit={handleEdit}
          onDelete={handleDelete}
          actionError={actionError}
        />
      </main>
      <Footer />
    </div>
  );
}
