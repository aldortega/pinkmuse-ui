import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import Header from "@/components/home/Header";
import Footer from "@/components/landing/Footer";
import NewsForm from "@/components/noticias/NewsForm";
import { useNews } from "@/contexts/NewsContext";

const buildSlug = (titulo) => encodeURIComponent(titulo ?? "");

export default function NewsCreatePage() {
  const navigate = useNavigate();
  const { createArticle } = useNews();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  const handleSubmit = async (payload) => {
    setIsSubmitting(true);
    setApiError(null);
    try {
      const created = await createArticle(payload);
      if (created?.titulo) {
        navigate(`/noticias/${buildSlug(created.titulo)}`);
      } else {
        navigate("/noticias");
      }
    } catch (err) {
      setApiError(err?.message || "No fue posible crear la noticia.");
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Header />
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 ">
          <section className="py-12 sm:py-16">
            <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
              <div className="mb-8 space-y-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="inline-flex items-center gap-2 text-sm font-medium text-rose-600 transition hover:text-rose-500"
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  Volver a noticias
                </button>
                <div>
                  <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
                    Nueva noticia
                  </h1>
                  <p className="mt-2 max-w-3xl text-sm text-slate-600 sm:text-base">
                    Completa la informacion para publicar una noticia y
                    compartirla con la comunidad PinkMuse.
                  </p>
                </div>
              </div>
              <div>
                <NewsForm
                  onSubmit={handleSubmit}
                  isSubmitting={isSubmitting}
                  apiError={apiError}
                />
              </div>
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
}
