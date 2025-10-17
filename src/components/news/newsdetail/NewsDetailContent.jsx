import ArticleLayout from "@/components/noticias/ArticleLayout";
import NewsDetailBody from "./NewsDetailBody";
import NewsDetailHeader from "./NewsDetailHeader";
import NewsDetailSidebar from "./NewsDetailSidebar";

export default function NewsDetailContent({
  article,
  formattedDate,
  readingTime,
  descriptionParagraphs,
  galleryImages,
  relatedArticles,
  articleSlug,
  canEdit,
  canDelete,
  isDeleting,
  onEdit,
  onDelete,
  actionError,
}) {
  return (
    <ArticleLayout
      header={
        <NewsDetailHeader
          article={article}
          formattedDate={formattedDate}
          readingTime={readingTime}
          canEdit={canEdit}
          canDelete={canDelete}
          isDeleting={isDeleting}
          onEdit={onEdit}
          onDelete={onDelete}
          actionError={actionError}
        />
      }
    >
      <NewsDetailBody
        article={article}
        descriptionParagraphs={descriptionParagraphs}
        galleryImages={galleryImages}
        articleSlug={articleSlug}
      />
      <NewsDetailSidebar
        article={article}
        relatedArticles={relatedArticles}
      />
    </ArticleLayout>
  );
}
