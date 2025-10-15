import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import api from "@/lib/axios";

const NewsContext = createContext(null);

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
  const summary = noticia.resumen || noticia.descripcion;

  return {
    id: noticia._id || noticia.id || slug,
    slug,
    title: noticia.titulo,
    description: summary,
    image,
    date: formatDate(noticia.fecha),
    rawDate: noticia.fecha,
    link: `/noticias/${slug}`,
    author: noticia.autor,
    category: noticia.categoria,
    tags: noticia.etiquetas,
  };
};

const handleApiError = (err, fallbackMessage) => {
  const message =
    err?.response?.data?.message || err?.message || fallbackMessage;
  const error = new Error(message);
  error.status = err?.response?.status;
  error.details = err?.response?.data?.errors;
  error.original = err;
  throw error;
};

export function NewsProvider({ children }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/noticias");
      const fetched = Array.isArray(response?.data?.data)
        ? response.data.data
        : [];
      setArticles(fetched);
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "No fue posible cargar las noticias.";
      setError(message);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const news = useMemo(() => {
    const normalized = articles
      .map((item) => normalizeNoticia(item))
      .filter(Boolean);

    return normalized.sort((a, b) => {
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
  }, [articles]);

  const getArticleBySlug = useCallback(
    (slug) => {
      if (!slug) {
        return null;
      }

      let decoded = slug;
      try {
        decoded = decodeURIComponent(slug);
      } catch {
        decoded = slug;
      }

      return (
        articles.find((item) => item?.titulo === decoded) ||
        articles.find((item) => encodeURIComponent(item?.titulo ?? "") === slug)
      );
    },
    [articles]
  );

  const createArticle = useCallback(
    async (payload) => {
      try {
        const response = await api.post("/noticias", payload);
        const created = response?.data?.data;

        if (created) {
          setArticles((prev) => {
            if (!Array.isArray(prev) || prev.length === 0) {
              return [created];
            }
            const filtered = prev.filter((item) => item?.titulo !== created.titulo);
            return [created, ...filtered];
          });
        }

        return created;
      } catch (err) {
        handleApiError(err, "No fue posible crear la noticia.");
      }
    },
    []
  );

  const value = useMemo(
    () => ({
      articles,
      news,
      loading,
      error,
      refetch: fetchNews,
      getArticleBySlug,
      createArticle,
    }),
    [articles, news, loading, error, fetchNews, getArticleBySlug, createArticle]
  );

  return <NewsContext.Provider value={value}>{children}</NewsContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useNews() {
  const context = useContext(NewsContext);
  if (!context) {
    throw new Error("useNews debe utilizarse dentro de un NewsProvider");
  }
  return context;
}
