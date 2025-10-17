import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Header from "@/components/home/Header";
import Footer from "@/components/landing/Footer";
import NewsForm from "@/components/noticias/NewsForm";
import api from "@/lib/axios";
import { useNews } from "@/contexts/NewsContext";

const decodeSlug = (value) => {
  if (!value) {
    return "";
  }
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

const buildSlug = (titulo) => (titulo ? encodeURIComponent(titulo) : "");

export default function NewsEditPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { getArticleBySlug, updateArticle, deleteArticle } = useNews();

  const articleFromContext = useMemo(
    () => (slug ? getArticleBySlug(slug) : null),
    [slug, getArticleBySlug]
  );

  const [article, setArticle] = useState(articleFromContext);
  const [isLoading, setIsLoading] = useState(!articleFromContext);
  const [loadError, setLoadError] = useState(null);
  const [formError, setFormError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (articleFromContext) {
      setArticle(articleFromContext);
      setIsLoading(false);
      setLoadError(null);
      return;
    }

    if (!slug) {
      setArticle(null);
      setIsLoading(false);
      setLoadError("Noticia no encontrada.");
      return;
    }

    let active = true;

    const fetchArticle = async () => {
      setIsLoading(true);
      setLoadError(null);
      try {
        const decoded = decodeSlug(slug);
        const response = await api.get(`/noticias/${encodeURIComponent(decoded)}`);
        if (!active) {
          return;
        }
        const data = response?.data?.data;
        if (data) {
          setArticle(data);
        } else {
          setArticle(null);
          setLoadError("Noticia no encontrada.");
        }
      } catch (err) {
        if (!active) {
          return;
        }
        const message =
          err?.response?.data?.message ||
          err?.message ||
          "No fue posible cargar la noticia.";
        setArticle(null);
        setLoadError(message);
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    fetchArticle();

    return () => {
      active = false;
    };
  }, [slug, articleFromContext]);

  const handleSubmit = async (payload) => {
    if (!article?.titulo) {
      return;
    }
    setIsSubmitting(true);
    setFormError(null);
    try {
      const updated = await updateArticle(article.titulo, payload);
      if (updated?.titulo) {
        navigate(`/noticias/${buildSlug(updated.titulo)}`);
      } else {
        navigate("/noticias");
      }
    } catch (err) {
      setFormError(err?.message || "No fue posible actualizar la noticia.");
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!article?.titulo) {
      return;
    }
    const confirmed = window.confirm("Seguro que deseas eliminar esta noticia?");
    if (!confirmed) {
      return;
    }
    setIsDeleting(true);
    setFormError(null);
    try {
      await deleteArticle(article.titulo);
      navigate("/noticias");
    } catch (err) {
      setFormError(err?.message || "No fue posible eliminar la noticia.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div>
        <Header />
        <main className="flex min-h-[60vh] items-center justify-center bg-gradient-to-b from-white via-rose-50/40 to-white">
          <p className="px-4 text-center text-base text-slate-600 sm:px-6 sm:text-lg">
            Cargando noticia para editar...
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!article || loadError) {
    return (
      <div>
        <Header />
        <main className="flex min-h-[60vh] items-center justify-center bg-gradient-to-b from-white via-rose-50/40 to-white">
          <div className="px-4 text-center sm:px-6">
            <h1 className="mb-4 text-3xl font-bold text-slate-900 sm:text-4xl">
              No pudimos cargar la noticia
            </h1>
            <p className="text-base text-gray-600 sm:text-lg">
              {loadError || "La noticia seleccionada no esta disponible."}
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
      <div className="flex min-h-screen flex-col">
        <main className="flex-1">
          <section className="py-12 sm:py-16">
            <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
              <div className="mb-8 space-y-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="inline-flex items-center gap-2 text-sm font-medium text-rose-600 transition hover:text-rose-500"
                >
                  <span aria-hidden="true">?</span>
                  Volver a noticias
                </button>
                <div>
                  <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
                    Editar noticia
                  </h1>
                  <p className="mt-2 max-w-3xl text-sm text-slate-600 sm:text-base">
                    Actualiza la informacion de la noticia y guarda los cambios para reflejarlos al instante.
                  </p>
                </div>
              </div>
              <NewsForm
                mode="edit"
                initialValues={article}
                onSubmit={handleSubmit}
                onDelete={handleDelete}
                isSubmitting={isSubmitting}
                isDeleting={isDeleting}
                apiError={formError}
              />
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
}
