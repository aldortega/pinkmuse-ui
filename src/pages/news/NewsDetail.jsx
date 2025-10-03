import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import Header from "@/components/home/Header";
import Footer from "@/components/landing/Footer";
import ArticleHeader from "@/components/noticias/AticleHeader";

import ArticleImage from "@/components/noticias/ArticleImage";
import ArticleContent from "@/components/noticias/ArticleContent";
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

const splitDescription = (text) => {
  if (!text) {
    return [];
  }

  return text
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
};

export default function NewsDetailPage() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    if (!slug) {
      setError("Articulo no encontrado");
      setLoading(false);
      return () => {};
    }

    const fetchArticle = async () => {
      setLoading(true);
      setError(null);

      try {
        let decodedSlug = slug;
        try {
          decodedSlug = decodeURIComponent(slug);
        } catch {
          decodedSlug = slug;
        }
        const requestId = encodeURIComponent(decodedSlug);
        const response = await api.get(`/noticias/${requestId}`);
        if (!active) {
          return;
        }

        const data = response?.data?.data;
        if (!data) {
          setError("Articulo no encontrado");
          setArticle(null);
          return;
        }

        setArticle(data);
      } catch (err) {
        if (!active) {
          return;
        }
        const message =
          err?.response?.data?.message ||
          err?.message ||
          "No fue posible cargar la noticia.";
        setError(message);
        setArticle(null);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchArticle();

    return () => {
      active = false;
    };
  }, [slug]);

  const formattedDate = useMemo(
    () => formatDate(article?.fecha),
    [article?.fecha]
  );

  const descriptionParagraphs = useMemo(
    () => splitDescription(article?.descripcion),
    [article?.descripcion]
  );

  const galleryImages = useMemo(() => {
    if (!article) {
      return [];
    }

    const collection = Array.isArray(article.imagenes) ? article.imagenes : [];
    return collection.filter((url) => url && url !== article.imagenPrincipal);
  }, [article]);

  const renderBody = () => {
    if (loading) {
      return (
        <main className="mx-auto flex w-full max-w-4xl flex-1 items-center justify-center px-4 py-16 sm:px-6 sm:py-24">
          <p className="text-center text-base text-slate-600 sm:text-lg">
            Cargando noticia...
          </p>
        </main>
      );
    }

    if (error || !article) {
      return (
        <main className="mx-auto flex w-full max-w-4xl flex-1 items-center justify-center px-4 py-16 sm:px-6 sm:py-24">
          <div className="text-center">
            <h1 className="mb-4 font-serif text-3xl font-bold text-gray-900 sm:text-4xl">
              Articulo no encontrado
            </h1>
            <p className="text-base text-gray-600 sm:text-lg">
              {error || "La noticia que estas buscando no existe."}
            </p>
          </div>
        </main>
      );
    }

    const author = article.autor || article.author;

    return (
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6 sm:py-12">
        <ArticleHeader
          title={article.titulo}
          publishedDate={formattedDate || article.fecha}
          author={author}
        />

        <ArticleImage src={article.imagenPrincipal} alt={article.titulo} />

        <ArticleContent>
          {descriptionParagraphs.length > 0 ? (
            descriptionParagraphs.map((paragraph, index) => (
              <p key={index} className="text-gray-800">
                {paragraph}
              </p>
            ))
          ) : (
            <p className="text-gray-800">{article.descripcion}</p>
          )}

          {galleryImages.map((image, index) => (
            <ArticleImage
              key={index}
              src={image}
              alt={`${article.titulo} ${index + 1}`}
            />
          ))}
        </ArticleContent>
      </main>
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      {renderBody()}
      <Footer />
    </div>
  );
}
