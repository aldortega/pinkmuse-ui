import ArticleImage from "@/components/noticias/ArticleImage";
import ArticleContent from "@/components/noticias/ArticleContent";
import ArticleShareBar from "@/components/noticias/ArticleShareBar";
import CommentsSection from "@/components/noticias/comments/CommentsSection";
import { CommentsProvider } from "@/contexts/CommentsContext";

export default function NewsDetailBody({
  article,
  descriptionParagraphs,
  galleryImages,
  articleSlug,
  sidebar,
}) {
  if (!article) {
    return null;
  }

  const hasParagraphs = descriptionParagraphs && descriptionParagraphs.length > 0;
  const hasGallery = Array.isArray(galleryImages) && galleryImages.length > 0;

  return (
    <>
      <ArticleImage
        src={article.imagenPrincipal}
        alt={article.titulo}
        className="my-0"
        frameClassName="rounded-3xl"
        imageClassName="max-h-[480px] w-full object-cover"
      />

      <div className="rounded-3xl border border-slate-100 bg-white/90 p-6 shadow-sm ring-1 ring-black/5 backdrop-blur-sm sm:p-10">
        <ArticleContent
          className="px-0"
          contentClassName="text-base leading-7 text-slate-700 sm:text-lg sm:leading-8"
        >
          {hasParagraphs ? (
            descriptionParagraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)
          ) : (
            <p>{article.descripcion}</p>
          )}
        </ArticleContent>

        {hasGallery && (
          <div className="mt-10 space-y-4">
            <h2 className="text-lg font-semibold text-slate-800">Galeria</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {galleryImages.map((image, index) => (
                <ArticleImage
                  key={image}
                  src={image}
                  alt={`${article.titulo} ${index + 1}`}
                  className="my-0"
                  frameClassName="rounded-2xl"
                  imageClassName="h-48 w-full object-cover"
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-8">
        <ArticleShareBar url={articleSlug ? `/noticias/${articleSlug}` : undefined} />
      </div>

      {sidebar}

      <CommentsProvider>
        <CommentsSection
          articleId={article?._id || article?.id}
          articleTitle={article?.titulo}
          isEnabled={Boolean(article?.habilitacionComentarios)}
        />
      </CommentsProvider>
    </>
  );
}
