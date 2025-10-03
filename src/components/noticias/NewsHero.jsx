import { Link } from "react-router-dom";

export default function NewsHero({ title, description, image, link, date }) {
  if (!link) {
    return null;
  }

  return (
    <article className="mb-16 rounded-2xl bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-6 overflow-hidden rounded-xl bg-gray-100">
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className="h-64 w-full object-cover sm:h-80 lg:h-[420px]"
        />
      </div>
      {date && (
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:text-sm">
          {date}
        </p>
      )}
      <h2 className="mb-4 text-2xl font-bold text-slate-800 sm:text-3xl">
        {title}
      </h2>
      {description && (
        <p className="mb-6 text-base leading-relaxed text-slate-600 sm:text-lg">
          {description}
        </p>
      )}
      <Link
        to={link}
        className="inline-flex items-center gap-2 font-medium text-[#E74C3C] transition-colors hover:text-[#C0392B]"
      >
        Leer mas
        <span aria-hidden="true">-&gt;</span>
      </Link>
    </article>
  );
}
