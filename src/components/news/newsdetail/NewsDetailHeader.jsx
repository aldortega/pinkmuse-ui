import ArticleHeader from "@/components/noticias/AticleHeader";
import ArticleMeta from "@/components/noticias/ArticleMeta";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function NewsDetailHeader({
  article,
  formattedDate,
  readingTime,
  canEdit,
  canDelete,
  isDeleting,
  onEdit,
  onDelete,
  actionError,
}) {
  if (!article) {
    return null;
  }

  const author = article.autor || article.author;
  const category = article.categoria || article.category;
  const tags =
    article.etiquetas || article.tags || article.temas || article.keywords;

  return (
    <>
      <ArticleHeader
        title={article.titulo}
        publishedDate={formattedDate || article.fecha}
        author={author}
      />
      <div className="mt-4 flex flex-col gap-4 sm:mt-6">
        <div className="flex w-full flex-col items-center gap-3 sm:flex-row sm:items-start sm:justify-center">
          <ArticleMeta
            className="w-full"
            date={formattedDate || article.fecha}
            author={author}
            readTime={readingTime}
            category={category}
            tags={tags}
            menu={
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={onEdit}
                    disabled={!canEdit || isDeleting}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Pencil className="h-4 w-4" />
                    <span>Editar</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={onDelete}
                    disabled={!canDelete || isDeleting}
                    className="flex items-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>{isDeleting ? "Eliminando..." : "Eliminar"}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            }
          />
        </div>
        {actionError && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
            {actionError}
          </div>
        )}
      </div>
    </>
  );
}
