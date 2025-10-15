import { Link } from "react-router-dom";
import { useNews } from "@/contexts/NewsContext";

const MAX_ITEMS = 3;
const DESCRIPTION_LIMIT = 180;

const truncate = (text, limit) => {
  if (!text) {
    return "";
  }
  if (text.length <= limit) {
    return text;
  }
  return `${text.slice(0, limit - 1)}...`;
};

export default function NewsUpdates() {
  const { news, loading, error } = useNews();

  const items = news.slice(0, MAX_ITEMS);

  return (
    <section className="py-16">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="mb-10 flex flex-col items-start gap-3 sm:mb-12 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">
              Ultimas noticias
            </h2>
            <p className="text-sm text-slate-600">
              Enterate de lo mas reciente en lanzamientos y novedades.
            </p>
          </div>
          <Link
            to="/noticias"
            className="text-sm font-semibold text-[#E74C3C] transition-colors hover:text-[#C0392B]"
          >
            Ver todas
          </Link>
        </div>

        {loading && (
          <p className="text-center text-slate-600 sm:text-left">
            Cargando noticias...
          </p>
        )}

        {!loading && error && (
          <p className="text-center text-destructive sm:text-left">{error}</p>
        )}

        {!loading &&
          !error &&
          (items.length > 0 ? (
            <div className="space-y-10">
              {items.map((article) => (
                <article key={article.id || article.slug} className="space-y-3">
                  {article.date && (
                    <p className="text-xs font-medium uppercase tracking-wide text-[#E74C3C]">
                      {article.date}
                    </p>
                  )}
                  <h3 className="text-lg font-semibold text-slate-800 sm:text-xl">
                    <Link
                      to={article.link}
                      className="transition-colors hover:text-[#E74C3C]"
                    >
                      {article.title}
                    </Link>
                  </h3>
                  {article.description && (
                    <p className="mx-auto max-w-2xl text-sm leading-relaxed text-slate-600 sm:mx-0 sm:text-base">
                      {truncate(article.description, DESCRIPTION_LIMIT)}
                    </p>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <p className="text-center text-slate-600 sm:text-left">
              Todavia no hay noticias publicadas. Vuelve pronto.
            </p>
          ))}
      </div>
    </section>
  );
}
