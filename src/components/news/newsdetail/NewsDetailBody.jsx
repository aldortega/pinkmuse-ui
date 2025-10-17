import { useEffect } from "react";
import ArticleImage from "@/components/noticias/ArticleImage";
import ArticleContent from "@/components/noticias/ArticleContent";
import ArticleShareBar from "@/components/noticias/ArticleShareBar";
import ReactionSelector from "@/components/reactions/ReactionSelector";
import { useReactions } from "@/contexts/ReactionsContext";
import CommentsSection from "@/components/noticias/comments/CommentsSection";
import { CommentsProvider } from "@/contexts/CommentsContext";

export default function NewsDetailBody({
  article,
  descriptionParagraphs,
  galleryImages,
  articleSlug,
  sidebar,
}) {
  const { getSummary, fetchSummary, primeSummary } = useReactions();
  const referenceId = article?._id || article?.id || null;
  const initialNewsSummary = article?.reactions;
  const newsReactionSummary = getSummary("noticia", referenceId);
  const newsSummaryLastFetched = newsReactionSummary.lastFetchedAt;

  useEffect(() => {
    if (!referenceId || !initialNewsSummary) {
      return;
    }

    primeSummary("noticia", referenceId, initialNewsSummary);
  }, [initialNewsSummary, primeSummary, referenceId]);

  useEffect(() => {
    if (!referenceId) {
      return;
    }

    if (newsSummaryLastFetched) {
      return;
    }

    fetchSummary("noticia", referenceId).catch(() => {
      // handled by context
    });
  }, [fetchSummary, newsSummaryLastFetched, referenceId]);

  if (!article) {
    return null;
  }

  const hasParagraphs =
    descriptionParagraphs && descriptionParagraphs.length > 0;
  const hasGallery = Array.isArray(galleryImages) && galleryImages.length > 0;
  const rawActionsConfig = article?.habilitacionAcciones;
  const reactionsEnabled = (() => {
    if (rawActionsConfig === undefined || rawActionsConfig === null) {
      return true;
    }

    if (typeof rawActionsConfig === "boolean") {
      return rawActionsConfig;
    }

    if (typeof rawActionsConfig === "string") {
      const value = rawActionsConfig.trim().toLowerCase();
      return value === "si" || value === "true";
    }

    return true;
  })();

  const reactionDisabledReason = reactionsEnabled
    ? ""
    : "Las reacciones estan deshabilitadas para esta noticia.";

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
            descriptionParagraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))
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
        <ReactionSelector
          referenceId={referenceId}
          referenceType="noticia"
          disabled={!reactionsEnabled}
          disabledReason={reactionDisabledReason}
          className="rounded-2xl border border-slate-100 bg-white/90 p-4 shadow-sm ring-1 ring-black/5 backdrop-blur-sm sm:p-6"
          initialSummary={initialNewsSummary}
        />
      </div>
      <div className="mt-8">
        <ArticleShareBar
          url={articleSlug ? `/noticias/${articleSlug}` : undefined}
        />
      </div>

      {sidebar}

      <CommentsProvider>
        <CommentsSection
          articleId={referenceId}
          articleTitle={article?.titulo}
          isEnabled={Boolean(article?.habilitacionComentarios)}
        />
      </CommentsProvider>
    </>
  );
}
