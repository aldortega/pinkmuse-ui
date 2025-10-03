export default function ArticleContent({ children }) {
  return (
    <article className="mx-auto max-w-none px-1 sm:px-0">
      <div className="space-y-5 text-base leading-relaxed text-gray-800 sm:space-y-6 sm:text-lg">
        {children}
      </div>
    </article>
  );
}
