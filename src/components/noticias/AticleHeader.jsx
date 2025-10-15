import { Link } from "react-router-dom";

export default function ArticleHeader({ title }) {
  return (
    <div className="mb-8 space-y-6">
      <div className="flex justify-center sm:justify-start">
        <Link
          to="/noticias"
          className="inline-flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-gray-900"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Volver a noticias
        </Link>
      </div>

      <h1 className="text-center text-3xl font-bold leading-tight text-slate-900 sm:text-left sm:text-4xl md:text-5xl md:leading-tight">
        {title}
      </h1>
    </div>
  );
}
