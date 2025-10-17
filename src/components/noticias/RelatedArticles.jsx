import { Link } from "react-router-dom";

export default function RelatedArticles({ items = [] }) {
  if (!items || items.length === 0) return null;

  return (
    <section className="rounded-2xl border border-red-100/60 bg-white/90 p-5 shadow-sm ring-1 ring-black/5 backdrop-blur-sm">
      <h2 className="text-sm font-semibold uppercase tracking-wide bg-gradient-to-br from-rose-500 via-red-400 to-red-500 bg-clip-text text-transparent">
        Tambien puede interesarte
      </h2>

      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <Link
            key={item.id || item.slug || item.link}
            to={item.link}
            className="group flex gap-3 rounded-xl border border-transparent p-3 transition hover:border-red-200 hover:bg-red-50/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-200"
          >
            <div className="relative h-16 w-24 overflow-hidden rounded-lg bg-gray-100 shadow-inner">
              <img
                src={item.image || "/placeholder.svg"}
                alt={item.title}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                loading="lazy"
              />
            </div>

            <div className="flex flex-1 flex-col justify-between">
              <div>
                <p className="line-clamp-2 text-sm font-semibold text-slate-800 transition-colors group-hover:text-red-400">
                  {item.title}
                </p>
                {item.description && (
                  <p className="line-clamp-2 text-xs text-slate-600 mt-1">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
