import { Link } from "react-router-dom";
import { useNews } from "@/contexts/NewsContext";

import NewsCard from "./NewsCard";

const MAX_ITEMS = 3;

export default function NewsUpdates() {
  const { news, loading, error } = useNews();

  const items = news.slice(0, MAX_ITEMS);

  return (
    <section className="py-16">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="mb-10 flex flex-col items-start gap-3 sm:mb-12 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link to="/noticias">
              <h2 className="text-3xl font-bold text-slate-800  hover:text-red-400 transition-colors">
                Ultimas noticias
              </h2>
            </Link>
            <p className="text-sm text-slate-600">
              Enterate de lo mas reciente en lanzamientos y novedades.
            </p>
          </div>
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
            <div className="flex flex-col gap-8">
              {items.map((article) => (
                <NewsCard key={article.id || article.slug} article={article} />
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
