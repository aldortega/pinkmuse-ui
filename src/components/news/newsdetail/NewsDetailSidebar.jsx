import RelatedArticles from "@/components/noticias/RelatedArticles";

export default function NewsDetailSidebar({ article, relatedArticles }) {
  const sourceValue = article?.fuente || article?.source;
  const isSourceLink =
    sourceValue && typeof sourceValue === "string" && /^https?:\/\//i.test(sourceValue);
  const hasRelated = Array.isArray(relatedArticles) && relatedArticles.length > 0;
  const hasSidebarContent = hasRelated || Boolean(sourceValue);

  if (!hasSidebarContent) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6">
      {hasRelated && <RelatedArticles items={relatedArticles} />}
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
    </div>
  );
}
