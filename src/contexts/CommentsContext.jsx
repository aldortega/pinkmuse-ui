import { createContext, useCallback, useContext, useMemo, useState } from "react";
import api from "@/lib/axios";
import { useUser } from "@/contexts/UserContext";
import { DEFAULT_REACTION_COUNTS, REACTION_MAP } from "@/constants/reactions";

const CommentsContext = createContext(null);

const DEFAULT_ENTRY = Object.freeze({
  items: [],
  loading: false,
  submitting: false,
  error: "",
  lastFetchedAt: null,
});


const createDefaultReactionSummary = () => ({
  counts: { ...DEFAULT_REACTION_COUNTS },
  total: 0,
  userReaction: null,
});

const normalizeReactionSummary = (value) => {
  const summary = createDefaultReactionSummary();

  if (!value || typeof value !== "object") {
    return summary;
  }

  const rawCounts = value.counts && typeof value.counts === "object" ? value.counts : null;

  if (rawCounts) {
    for (const key of Object.keys(summary.counts)) {
      const raw = rawCounts[key];
      summary.counts[key] = typeof raw === "number" && Number.isFinite(raw) && raw >= 0 ? raw : 0;
    }
  }

  const total = value.total;
  if (typeof total === "number" && Number.isFinite(total) && total >= 0) {
    summary.total = total;
  } else {
    summary.total = Object.values(summary.counts).reduce((acc, count) => acc + count, 0);
  }

  const reaction = typeof value.userReaction === "string" ? value.userReaction : "";
  summary.userReaction = REACTION_MAP[reaction] ? reaction : null;

  return summary;
};

const toKey = (value) => {
  if (value === null || value === undefined) {
    return "";
  }
  if (typeof value === "string") {
    return value;
  }
  try {
    return String(value);
  } catch {
    return "";
  }
};

const parseDate = (value) => {
  if (!value || (typeof value === "string" && value.trim() === "")) {
    return null;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
};

const computeInitials = (value) => {
  if (!value || typeof value !== "string") {
    return "UP";
  }

  const parts = value
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "");

  const initials = parts.join("");
  return initials.length > 0 ? initials : "UP";
};

const normalizeCommentUser = (rawUser) => {
  if (!rawUser || typeof rawUser !== "object") {
    return null;
  }

  const id =
    (typeof rawUser.id === "string" && rawUser.id) ||
    (typeof rawUser._id === "string" && rawUser._id) ||
    (typeof rawUser.usuario_id === "string" && rawUser.usuario_id) ||
    "";
  const nombre = typeof rawUser.nombre === "string" ? rawUser.nombre : "";
  const apellido = typeof rawUser.apellido === "string" ? rawUser.apellido : "";
  const displayName =
    (typeof rawUser.displayName === "string" && rawUser.displayName.trim()) ||
    [nombre, apellido].filter(Boolean).join(" ").trim() ||
    (typeof rawUser.username === "string" && rawUser.username.trim()) ||
    (typeof rawUser.correo === "string" && rawUser.correo.trim()) ||
    "Usuario PinkMuse";

  return {
    id,
    nombre,
    apellido,
    displayName,
    correo: typeof rawUser.correo === "string" ? rawUser.correo : "",
    avatar: typeof rawUser.avatar === "string" ? rawUser.avatar : "",
    rol: typeof rawUser.rol === "string" ? rawUser.rol : "",
    initials: computeInitials(displayName),
  };
};

const buildUserSummaryFromContext = (user) => {
  if (!user || typeof user !== "object") {
    return null;
  }

  return normalizeCommentUser({
    id:
      (typeof user._id === "string" && user._id) ||
      (typeof user.id === "string" && user.id) ||
      (typeof user.usuario_id === "string" && user.usuario_id) ||
      "",
    nombre: typeof user.nombre === "string" ? user.nombre : "",
    apellido: typeof user.apellido === "string" ? user.apellido : "",
    displayName: typeof user.displayName === "string" ? user.displayName : undefined,
    correo: typeof user.correo === "string" ? user.correo : "",
    avatar: typeof user.avatar === "string" ? user.avatar : "",
    rol: typeof user.rol === "string" ? user.rol : "",
  });
};

const normalizeComment = (comment, fallbackUserSummary) => {
  if (!comment || typeof comment !== "object") {
    return null;
  }

  const id =
    (typeof comment.id === "string" && comment.id) ||
    (typeof comment._id === "string" && comment._id) ||
    (comment._id && typeof comment._id === "object" && typeof comment._id.$oid === "string" && comment._id.$oid) ||
    "";
  const referenceId =
    (typeof comment.referencia_id === "string" && comment.referencia_id) ||
    (typeof comment.reference_id === "string" && comment.reference_id) ||
    (typeof comment.referenceId === "string" && comment.referenceId) ||
    "";
  const tipo =
    (typeof comment.tipoReferencia === "string" && comment.tipoReferencia) ||
    (typeof comment.tipo_referencia === "string" && comment.tipo_referencia) ||
    (typeof comment.type === "string" && comment.type) ||
    "noticia";
  const rawText =
    (typeof comment.texto === "string" && comment.texto) ||
    (typeof comment.text === "string" && comment.text) ||
    "";
  const meta =
    comment.meta && typeof comment.meta === "object" && !Array.isArray(comment.meta)
      ? { ...comment.meta }
      : {};

  const rawDate =
    comment.fecha ?? comment.created_at ?? comment.createdAt ?? comment.rawDate ?? comment.created ?? null;
  const parsedDate = parseDate(rawDate);
  const createdAt = parsedDate ? parsedDate.toISOString() : typeof rawDate === "string" ? rawDate : null;

  const userSummary =
    normalizeCommentUser(comment.usuario ?? comment.user) || fallbackUserSummary || normalizeCommentUser(comment.autor);

  const text = rawText.trim();
  const reactionSummary = normalizeReactionSummary(comment.reactions);

  return {
    id: id || `${referenceId || "comentario"}-${createdAt || Date.now()}`,
    referenceId,
    type: tipo,
    text,
    createdAt,
    createdAtDate: parsedDate,
    rawDate: createdAt || rawDate || null,
    meta,
    reactions: reactionSummary,
    user: userSummary,
  };
};

export function CommentsProvider({ children }) {
  const { user } = useUser();
  const [store, setStore] = useState({});
  const [pendingDeletes, setPendingDeletes] = useState({});

  const currentUserSummary = useMemo(() => buildUserSummaryFromContext(user), [user]);

  const resolveUserId = useCallback(() => {
    if (!currentUserSummary) {
      return "";
    }
    return currentUserSummary.id || "";
  }, [currentUserSummary]);

  const getEntry = useCallback(
    (referenceId) => {
      const key = toKey(referenceId);
      return store[key] ?? DEFAULT_ENTRY;
    },
    [store]
  );

  const fetchCommentsForNews = useCallback(
    async (referenceId, { force = false } = {}) => {
      const key = toKey(referenceId);
      if (!key) {
        const error = new Error("Se requiere el identificador de la noticia para cargar los comentarios.");
        error.code = "missingReference";
        throw error;
      }

      setStore((prev) => {
        const entry = prev[key] ?? DEFAULT_ENTRY;
        if (!force && entry.loading) {
          return prev;
        }

        return {
          ...prev,
          [key]: {
            ...entry,
            loading: true,
            error: "",
          },
        };
      });

      try {
        const params = {};
        const currentUserId = resolveUserId();
        if (currentUserId) {
          params.usuario_id = currentUserId;
        }

        const response = await api.get(`/noticias/${encodeURIComponent(referenceId)}/comentarios`, { params });
        const rawComments = Array.isArray(response?.data?.data) ? response.data.data : [];
        const normalized = rawComments
          .map((item) => normalizeComment(item))
          .filter(Boolean);

        setStore((prev) => {
          const entry = prev[key] ?? DEFAULT_ENTRY;
          return {
            ...prev,
            [key]: {
              ...entry,
              items: normalized,
              loading: false,
              error: "",
              lastFetchedAt: Date.now(),
            },
          };
        });

        return normalized;
      } catch (err) {
        const message =
          err?.response?.data?.message || err?.message || "No fue posible cargar los comentarios.";

        setStore((prev) => {
          const entry = prev[key] ?? DEFAULT_ENTRY;
          return {
            ...prev,
            [key]: {
              ...entry,
              loading: false,
              error: message,
            },
          };
        });

        const error = new Error(message);
        error.status = err?.response?.status;
        error.details = err?.response?.data?.errors;
        throw error;
      }
    },
    [resolveUserId]
  );

  const createCommentForNews = useCallback(
    async (referenceId, payload) => {
      const key = toKey(referenceId);
      if (!key) {
        const error = new Error("Se requiere la noticia para publicar un comentario.");
        error.code = "missingReference";
        throw error;
      }

      const userId = resolveUserId();
      if (!userId) {
        const error = new Error("Debes iniciar sesi?n para publicar un comentario.");
        error.code = "unauthenticated";
        throw error;
      }

      const textInput =
        (payload && typeof payload === "object" && typeof payload.texto === "string" && payload.texto) ||
        (payload && typeof payload === "object" && typeof payload.text === "string" && payload.text) ||
        (typeof payload === "string" ? payload : "");
      const text = textInput.trim();

      if (!text) {
        const error = new Error("El comentario no puede estar vac?o.");
        error.code = "validation";
        throw error;
      }

      const meta =
        payload && typeof payload === "object" && payload.meta && typeof payload.meta === "object"
          ? payload.meta
          : undefined;

      const requestBody = {
        texto: text,
        usuario_id: userId,
        fecha: new Date().toISOString(),
      };

      if (meta) {
        requestBody.meta = meta;
      }

      setStore((prev) => {
        const entry = prev[key] ?? DEFAULT_ENTRY;
        return {
          ...prev,
          [key]: {
            ...entry,
            submitting: true,
            error: "",
          },
        };
      });

      try {
        const response = await api.post(
          `/noticias/${encodeURIComponent(referenceId)}/comentarios`,
          requestBody
        );

        const created = normalizeComment(response?.data?.data ?? response?.data, currentUserSummary);

        setStore((prev) => {
          const entry = prev[key] ?? DEFAULT_ENTRY;
          const existing = Array.isArray(entry.items) ? entry.items : [];
          const filtered = created?.id
            ? existing.filter((item) => item.id !== created.id)
            : existing;
          const items = created ? [created, ...filtered] : existing;

          return {
            ...prev,
            [key]: {
              ...entry,
              items,
              submitting: false,
              error: "",
            },
          };
        });

        return created;
      } catch (err) {
        const message =
          err?.response?.data?.message || err?.message || "No fue posible publicar el comentario.";

        setStore((prev) => {
          const entry = prev[key] ?? DEFAULT_ENTRY;
          return {
            ...prev,
            [key]: {
              ...entry,
              submitting: false,
              error: message,
            },
          };
        });

        const error = new Error(message);
        error.status = err?.response?.status;
        error.details = err?.response?.data?.errors;
        throw error;
      }
    },
    [currentUserSummary, resolveUserId]
  );

  const deleteComment = useCallback(async (referenceId, commentId) => {
    const key = toKey(referenceId);
    const commentKey = toKey(commentId);

    if (!key || !commentKey) {
      const error = new Error("Faltan datos para eliminar el comentario.");
      error.code = "missingData";
      throw error;
    }

    setPendingDeletes((prev) => ({ ...prev, [commentKey]: true }));

    try {
      await api.delete(`/comentarios/${encodeURIComponent(commentId)}`);

      setStore((prev) => {
        const entry = prev[key] ?? DEFAULT_ENTRY;
        const existing = Array.isArray(entry.items) ? entry.items : [];
        const items = existing.filter((item) => toKey(item.id) !== commentKey);

        return {
          ...prev,
          [key]: {
            ...entry,
            items,
            error: "",
          },
        };
      });

      return true;
    } catch (err) {
      const message =
        err?.response?.data?.message || err?.message || "No fue posible eliminar el comentario.";

      setStore((prev) => {
        const entry = prev[key] ?? DEFAULT_ENTRY;
        return {
          ...prev,
          [key]: {
            ...entry,
            error: message,
          },
        };
      });

      const error = new Error(message);
      error.status = err?.response?.status;
      error.details = err?.response?.data?.errors;
      throw error;
    } finally {
      setPendingDeletes((prev) => {
        const next = { ...prev };
        delete next[commentKey];
        return next;
      });
    }
  }, []);

  const clearCommentsForNews = useCallback((referenceId) => {
    const key = toKey(referenceId);
    if (!key) {
      return;
    }

    setStore((prev) => {
      if (!Object.prototype.hasOwnProperty.call(prev, key)) {
        return prev;
      }
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  const isDeletingComment = useCallback(
    (commentId) => {
      const key = toKey(commentId);
      return Boolean(key && pendingDeletes[key]);
    },
    [pendingDeletes]
  );

  const value = useMemo(() => {
    const getState = (referenceId) => {
      const entry = getEntry(referenceId);
      const items = Array.isArray(entry.items) ? entry.items : [];

      const enhancedItems = items.map((item) => ({
        ...item,
        isOwner:
          Boolean(currentUserSummary?.id) &&
          Boolean(item?.user?.id) &&
          toKey(item.user.id) === toKey(currentUserSummary.id),
      }));

      return {
        comments: enhancedItems,
        loading: Boolean(entry.loading),
        submitting: Boolean(entry.submitting),
        error: entry.error || "",
        lastFetchedAt: entry.lastFetchedAt ?? null,
      };
    };

    return {
      getState,
      fetchCommentsForNews,
      createCommentForNews,
      deleteComment,
      clearCommentsForNews,
      isDeletingComment,
      currentUserSummary,
    };
  }, [
    clearCommentsForNews,
    createCommentForNews,
    currentUserSummary,
    deleteComment,
    fetchCommentsForNews,
    getEntry,
    isDeletingComment,
  ]);

  return <CommentsContext.Provider value={value}>{children}</CommentsContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useComments() {
  const context = useContext(CommentsContext);
  if (!context) {
    throw new Error("useComments debe utilizarse dentro de un CommentsProvider");
  }
  return context;
}
