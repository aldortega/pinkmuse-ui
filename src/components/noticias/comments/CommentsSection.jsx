import { useEffect, useMemo, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useComments } from "@/contexts/CommentsContext";
import { Trash2 } from "lucide-react";

const MAX_COMMENT_LENGTH = 600;
const relativeTimeFormatter = new Intl.RelativeTimeFormat("es", {
  numeric: "auto",
});
const absoluteTimeFormatter = new Intl.DateTimeFormat("es-ES", {
  dateStyle: "long",
  timeStyle: "short",
});

const TIME_THRESHOLDS = [
  { limit: 60, divisor: 1, unit: "second" },
  { limit: 3600, divisor: 60, unit: "minute" },
  { limit: 86400, divisor: 3600, unit: "hour" },
  { limit: 604800, divisor: 86400, unit: "day" },
  { limit: 2629800, divisor: 604800, unit: "week" },
  { limit: 31557600, divisor: 2629800, unit: "month" },
  { limit: Infinity, divisor: 31557600, unit: "year" },
];

const toDate = (value) => {
  if (!value) {
    return null;
  }
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return date;
};

const formatRelativeTime = (value) => {
  const date = toDate(value);
  if (!date) {
    return "";
  }
  const now = Date.now();
  const diffInSeconds = Math.round((date.getTime() - now) / 1000);
  const absDiff = Math.abs(diffInSeconds);

  for (const threshold of TIME_THRESHOLDS) {
    if (absDiff < threshold.limit) {
      const relativeValue = Math.round(diffInSeconds / threshold.divisor);
      return relativeTimeFormatter.format(relativeValue, threshold.unit);
    }
  }

  return absoluteTimeFormatter.format(date);
};

const formatAbsoluteTime = (value) => {
  const date = toDate(value);
  if (!date) {
    return "";
  }
  return absoluteTimeFormatter.format(date);
};

function CommentComposer({
  value,
  onChange,
  onSubmit,
  disabled,
  submitting,
  error,
}) {
  const remaining = MAX_COMMENT_LENGTH - value.length;

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-slate-100 bg-white/90 p-4 shadow-sm ring-1 ring-slate-900/5 backdrop-blur-sm"
    >
      <div className="space-y-3">
        <Textarea
          value={value}
          onChange={onChange}
          maxLength={MAX_COMMENT_LENGTH}
          disabled={disabled || submitting}
          placeholder="Comparte tu opiniÃ³n sobre esta noticia..."
          className="min-h-[120px] resize-y rounded-xl border-slate-200 bg-white/60 text-sm text-slate-800 placeholder:text-slate-500 focus-visible:border-red-400 focus-visible:ring-red-400"
        />
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            {remaining >= 0 ? `${remaining} caracteres disponibles` : ""}
          </p>
          <div className="flex items-center gap-3">
            {error && <span className="text-sm text-red-600">{error}</span>}
            <Button
              type="submit"
              disabled={disabled || submitting || value.trim().length === 0}
              className="bg-red-400 hover:bg-rose-600"
            >
              {submitting ? "Publicando..." : "Publicar comentario"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}

function CommentCard({ comment, onDelete, canDelete, isDeleting }) {
  const paragraphs = useMemo(() => {
    if (!comment?.text) {
      return [];
    }
    return comment.text
      .split(/\n+/)
      .map((entry) => entry.trim())
      .filter(Boolean);
  }, [comment?.text]);

  const relativeDate = useMemo(
    () => formatRelativeTime(comment?.createdAt ?? comment?.rawDate),
    [comment?.createdAt, comment?.rawDate]
  );

  const absoluteDate = useMemo(
    () => formatAbsoluteTime(comment?.createdAt ?? comment?.rawDate),
    [comment?.createdAt, comment?.rawDate]
  );

  const displayName = comment?.user?.displayName || "Usuario PinkMuse";
  const avatarFallback =
    comment?.user?.initials || displayName.slice(0, 2).toUpperCase();

  return (
    <article className="rounded-2xl border border-slate-100 bg-white/90 p-4 shadow-sm ring-1 ring-slate-900/5 backdrop-blur-sm sm:p-6">
      <div className="flex items-start gap-4">
        <Avatar className="size-10">
          {comment?.user?.avatar ? (
            <AvatarImage src={comment.user.avatar} alt={displayName} />
          ) : null}
          <AvatarFallback className="bg-gradient-to-br from-rose-500 via-red-400 to-red-500 text-white">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-800">
                {displayName}
              </p>
              <p className="text-xs text-slate-500" title={absoluteDate}>
                {relativeDate}
              </p>
            </div>
            {canDelete ? (
              <Button
                variant="ghost"
                size="icon"
                className="size-8 text-red-400 hover:text-red-500 cursor-pointer"
                disabled={isDeleting}
                onClick={() => onDelete(comment)}
              >
                {isDeleting ? (
                  <Ellipsis className="size-4 animate-pulse" />
                ) : (
                  <Trash2 className="size-4" />
                )}
                <span className="sr-only">Eliminar comentario</span>
              </Button>
            ) : null}
          </div>
          <div className="space-y-2">
            {paragraphs.length > 0 ? (
              paragraphs.map((line, index) => (
                <p
                  key={`${comment.id}-line-${index}`}
                  className="text-sm leading-6 text-slate-700"
                >
                  {line}
                </p>
              ))
            ) : (
              <p className="text-sm leading-6 text-slate-700">
                {comment?.text}
              </p>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export default function CommentsSection({
  articleId,
  articleTitle,
  isEnabled,
}) {
  const {
    getState,
    fetchCommentsForNews,
    createCommentForNews,
    deleteComment,
    clearCommentsForNews,
    isDeletingComment,
    currentUserSummary,
  } = useComments();

  const [message, setMessage] = useState("");
  const [submitError, setSubmitError] = useState("");
  // const [refreshing, setRefreshing] = useState(false);

  const { comments, loading, submitting, error, lastFetchedAt } = useMemo(
    () => getState(articleId),
    [getState, articleId]
  );

  useEffect(() => {
    if (!articleId || isEnabled) {
      return;
    }

    clearCommentsForNews(articleId);
  }, [articleId, isEnabled, clearCommentsForNews]);

  useEffect(() => {
    if (!articleId || !isEnabled) {
      return;
    }

    if (lastFetchedAt || loading) {
      return;
    }

    fetchCommentsForNews(articleId).catch(() => {
      // Error already handled by context state
    });
  }, [articleId, isEnabled, fetchCommentsForNews, lastFetchedAt, loading]);

  useEffect(() => {
    setMessage("");
    setSubmitError("");
  }, [articleId]);

  const handleChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!articleId) {
      setSubmitError("No se pudo identificar la noticia para comentar.");
      return;
    }

    setSubmitError("");
    try {
      await createCommentForNews(articleId, { texto: message });
      setMessage("");
    } catch (err) {
      setSubmitError(err?.message || "No fue posible publicar el comentario.");
    }
  };

  const handleDelete = async (comment) => {
    if (!articleId || !comment?.id) {
      return;
    }
    try {
      await deleteComment(articleId, comment.id);
    } catch (err) {
      // Context already stores error state, optional local feedback
      setSubmitError(err?.message || "No fue posible eliminar el comentario.");
    }
  };

  // const handleRefresh = async () => {
  //   if (!articleId) {
  //     return;
  //   }
  //   setSubmitError("");
  //   setRefreshing(true);
  //   try {
  //     await fetchCommentsForNews(articleId, { force: true });
  //   } catch (err) {
  //     setSubmitError(
  //       err?.message || "No fue posible recargar los comentarios."
  //     );
  //   } finally {
  //     setRefreshing(false);
  //   }
  // };

  const canSubmit = Boolean(isEnabled && articleId && currentUserSummary?.id);
  const disableFormReason = !isEnabled
    ? "Los comentarios estÃ¡n deshabilitados para esta noticia."
    : !currentUserSummary?.id
    ? "Debes iniciar sesiÃ³n para comentar."
    : !articleId
    ? "No se encontrÃ³ esta noticia."
    : "";

  return (
    <section className="mt-12">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Comentarios</h2>
          <p className="text-sm text-slate-600">
            {articleTitle
              ? `ConversaciÃ³n sobre "${articleTitle}".`
              : "Comparte tus ideas y participa en la conversaciÃ³n."}
          </p>
        </div>
        {/* <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={!articleId || loading || refreshing}
            className="border-slate-200 text-slate-600 hover:border-rose-200 hover:text-rose-600"
          >
            {refreshing ? "Actualizando..." : "Actualizar"}
          </Button>
        </div> */}
      </div>

      {disableFormReason && !canSubmit ? (
        <div className="mb-6 rounded-2xl border border-amber-200/70 bg-amber-50/70 px-4 py-3 text-sm text-amber-800">
          {disableFormReason}
        </div>
      ) : (
        <CommentComposer
          value={message}
          onChange={handleChange}
          onSubmit={handleSubmit}
          disabled={!canSubmit}
          submitting={submitting}
          error={submitError}
        />
      )}

      {submitError && !canSubmit && (
        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {submitError}
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {loading && comments.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-slate-100 bg-white/60 px-4 py-6 text-center text-sm text-slate-600">
          Cargando comentarios...
        </div>
      ) : null}

      {!loading && comments.length === 0 && !error && isEnabled ? (
        <div className="mt-6 rounded-2xl border border-slate-100 bg-white/60 px-4 py-6 text-center text-sm text-slate-600">
          SÃ© la primera persona en comentar esta noticia.
        </div>
      ) : null}

      <div className="mt-6 space-y-4">
        {comments.map((comment) => (
          <CommentCard
            key={comment.id}
            comment={comment}
            onDelete={handleDelete}
            canDelete={Boolean(comment?.isOwner)}
            isDeleting={isDeletingComment(comment?.id)}
          />
        ))}
      </div>
    </section>
  );
}

