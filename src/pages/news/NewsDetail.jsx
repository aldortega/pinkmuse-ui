import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import Header from "@/components/home/Header";
import Footer from "@/components/landing/Footer";
import ArticleHeader from "@/components/noticias/AticleHeader";
import ArticleLayout from "@/components/noticias/ArticleLayout";
import ArticleImage from "@/components/noticias/ArticleImage";
import ArticleContent from "@/components/noticias/ArticleContent";
import ArticleMeta from "@/components/noticias/ArticleMeta";
import ArticleShareBar from "@/components/noticias/ArticleShareBar";
import RelatedArticles from "@/components/noticias/RelatedArticles";
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
  } = useNews();

  const articleFromContext = useMemo(
    () => (slug ? getArticleBySlug(slug) : null),
    [slug, getArticleBySlug]
  );

  const [fallbackArticle, setFallbackArticle] = useState(null);
  const [fallbackError, setFallbackError] = useState(null);
  const [isFallbackLoading, setIsFallbackLoading] = useState(false);

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
        const response = await api.get(`/noticias/${encodeURIComponent(decodedSlug)}`);
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
    const currentSlug =
      slug || (article?.titulo ? encodeURIComponent(article.titulo) : "");
    return normalizedNews.filter((item) => item.slug !== currentSlug).slice(0, 3);
  }, [article, normalizedNews, slug]);

  const articleSlug = useMemo(() => {
    if (slug) return slug;
    if (article?.titulo) return encodeURIComponent(article.titulo);
    return "";
  }, [slug, article?.titulo]);

  const author = article?.autor || article?.author;
  const category = article?.categoria || article?.category;
  const tags = article?.etiquetas || article?.tags || article?.temas || article?.keywords;
  const sourceValue = article?.fuente || article?.source;
  const isSourceLink =
    sourceValue && typeof sourceValue === "string" && /^https?:\/\//i.test(sourceValue);
  const hasSidebarContent = relatedArticles.length > 0 || Boolean(sourceValue);

  const renderContent = () => (
    <ArticleLayout
      header={
        <>
          <ArticleHeader
            title={article.titulo}
            publishedDate={formattedDate || article.fecha}
            author={author}
          />
          <ArticleMeta
            date={formattedDate || article.fecha}
            author={author}
            readTime={readingTime}
            category={category}
            tags={tags}
          />
        </>
      }
      sidebar={
        hasSidebarContent ? (
          <>
            {relatedArticles.length > 0 && <RelatedArticles items={relatedArticles} />}
            {sourceValue && (
              <div className="rounded-2xl border border-rose-100/60 bg-white/90 p-5 text-sm text-slate-600 shadow-sm ring-1 ring-black/5 backdrop-blur-sm">
                <h2 className="text-sm font-semibold text-slate-800">Fuente</h2>
                {isSourceLink ? (
                  <a
                    href={sourceValue}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex text-sm font-semibold text-rose-600 hover:text-rose-500"
                  >
                    {sourceValue}
                  </a>
                ) : (
                  <p className="mt-2">{sourceValue}</p>
                )}
              </div>
            )}
          </>
        ) : null
      }
    >
      <ArticleImage
        src={article.imagenPrincipal}
        alt={article.titulo}
        className="my-0"
        frameClassName="rounded-3xl"
        imageClassName="max-h-[480px] w-full object-cover"
      />

      <div className="rounded-3xl border border-slate-100 bg-white/90 p-6 shadow-sm ring-1 ring-black/5 backdrop-blur-sm sm:p-10">
        <ArticleContent
          className="px-0"
          contentClassName="text-base leading-7 text-slate-700 sm:text-lg sm:leading-8"
        >
          {descriptionParagraphs.length > 0 ? (
            descriptionParagraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)
          ) : (
            <p>{article.descripcion}</p>
          )}
        </ArticleContent>

        {galleryImages.length > 0 && (
          <div className="mt-10 space-y-4">
            <h2 className="text-lg font-semibold text-slate-800">Galeria</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {galleryImages.map((image, index) => (
                <ArticleImage
                  key={image}
                  src={image}
                  alt={`${article.titulo} ${index + 1}`}
                  className="my-0"
                  frameClassName="rounded-2xl"
                  imageClassName="h-48 w-full object-cover"
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-8">
        <ArticleShareBar url={articleSlug ? `/noticias/${articleSlug}` : undefined} />
      </div>
    </ArticleLayout>
  );

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
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
}
