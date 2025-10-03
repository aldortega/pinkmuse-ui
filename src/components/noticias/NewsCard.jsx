import { Link } from "react-router-dom";

export default function NewsCard({ title, description, image, link, date }) {
  if (!link) {
    return null;
  }

  return (
    <article className="group h-full">
      <Link to={link} className="flex h-full flex-col">
        <div className="mb-4 overflow-hidden rounded-lg bg-gray-100">
          <img
            src={image || "/placeholder.svg"}
            alt={title}
            className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105 sm:h-56 lg:h-60"
          />
        </div>
        {date && (
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:text-sm">
            {date}
          </p>
        )}
        <h3 className="mb-3 text-xl font-bold text-slate-800 transition-colors group-hover:text-[#E74C3C]">
          {title}
        </h3>
        {description && (
          <p className="text-base leading-relaxed text-slate-600">
            {description.length > 170
              ? `${description.slice(0, 167)}...`
              : description}
          </p>
        )}
        <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#E74C3C] opacity-0 transition-opacity group-hover:opacity-100">
          Leer mas
          <span aria-hidden="true">-&gt;</span>
        </span>
      </Link>
    </article>
  );
}
