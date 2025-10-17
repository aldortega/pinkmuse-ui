import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

import api from "@/lib/axios";
import { useUser } from "@/contexts/UserContext";
import { DEFAULT_REACTION_COUNTS, REACTION_MAP, REACTION_TYPES } from "@/constants/reactions";

const ReactionsContext = createContext(null);

const normalizeId = (value) => {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "string") {
    return value.trim();
  }

  if (typeof value === "number" || typeof value === "bigint") {
    return String(value);
  }

  if (typeof value === "object") {
    if (typeof value.$oid === "string") {
      return value.$oid;
    }

    if (typeof value._id === "string") {
      return value._id;
    }

    if (value._id && typeof value._id === "object") {
      const nested = normalizeId(value._id);
      if (nested) {
        return nested;
      }
    }

    if (typeof value.id === "string") {
      return value.id;
    }

    if (typeof value.toString === "function") {
      const stringValue = `${value}`.trim();
      if (stringValue && stringValue !== "[object Object]") {
        return stringValue;
      }
    }
  }

  return "";
};

const createEmptyCounts = () => ({
  ...DEFAULT_REACTION_COUNTS,
});

const mergeCounts = (counts) => {
  const base = createEmptyCounts();

  if (counts && typeof counts === "object") {
    for (const key of Object.keys(base)) {
      const value = counts[key];
      base[key] = typeof value === "number" && Number.isFinite(value) ? value : 0;
    }
  }

  return base;
};

const formatSummary = (summary) => {
  const counts = mergeCounts(summary?.counts);
  const providedTotal = summary?.total;
  const total =
    typeof providedTotal === "number" && Number.isFinite(providedTotal)
      ? providedTotal
      : Object.values(counts).reduce((acc, value) => acc + value, 0);
  const userReaction =
    typeof summary?.userReaction === "string" && REACTION_MAP[summary.userReaction]
      ? summary.userReaction
      : null;

  return {
    counts,
    total,
    userReaction,
  };
};

const toKey = (type, referenceId) => {
  const id = normalizeId(referenceId);
  if (!type || !id) {
    return "";
  }
  return `${type}:${id}`;
};

const extractUserId = (user) => {
  if (!user || typeof user !== "object") {
    return "";
  }

  const candidates = [user.id, user._id, user.usuario_id, user.user_id, user.userId];

  for (const candidate of candidates) {
    const normalized = normalizeId(candidate);
    if (normalized) {
      return normalized;
    }
  }

  if (user._id && typeof user._id === "object" && typeof user._id.$oid === "string") {
    const normalized = normalizeId(user._id.$oid);
    if (normalized) {
      return normalized;
    }
  }

  return "";
};

export function ReactionsProvider({ children }) {
  const { user } = useUser();

  const currentUserId = useMemo(() => normalizeId(extractUserId(user)), [user]);
  const [store, setStore] = useState({});
  const [pending, setPending] = useState({});
  const storeRef = useRef(store);

  useEffect(() => {
    storeRef.current = store;
  }, [store]);

  const getSummary = useCallback((type, referenceId) => {
    const key = toKey(type, referenceId);
    if (!key) {
      return {
        counts: mergeCounts(),
        total: 0,
        userReaction: null,
        loading: false,
        error: "",
        lastFetchedAt: null,
      };
    }

    const source = store[key] ?? storeRef.current[key];
    if (!source) {
      return {
        counts: mergeCounts(),
        total: 0,
        userReaction: null,
        loading: false,
        error: "",
        lastFetchedAt: null,
      };
    }

    const summary = formatSummary(source);

    return {
      ...summary,
      loading: Boolean(source.loading),
      error: typeof source.error === "string" ? source.error : "",
      lastFetchedAt: source.lastFetchedAt ?? null,
    };
  }, [store]);

  const fetchSummary = useCallback(
    async (type, referenceId, options = {}) => {
      const key = toKey(type, referenceId);
      if (!key) {
        return null;
      }

      const { force = false, userId: overrideUserId } = options ?? {};
      const entry = storeRef.current[key];

      if (!force && entry && entry.loading) {
        return formatSummary(entry);
      }

      setStore((prev) => ({
        ...prev,
        [key]: {
          ...(prev[key] ?? {
            counts: mergeCounts(),
            total: 0,
            userReaction: null,
          }),
          loading: true,
          error: "",
        },
      }));

      const [typeName] = key.split(":");
      const id = key.substring(typeName.length + 1);

      try {
        const params = {};
        const effectiveUserId = normalizeId(overrideUserId ?? currentUserId);
        if (effectiveUserId) {
          params.usuario_id = effectiveUserId;
        }

        const endpoint =
          typeName === "noticia"
            ? `/noticias/${encodeURIComponent(id)}/reacciones`
            : `/comentarios/${encodeURIComponent(id)}/reacciones`;

        const response = await api.get(endpoint, { params });
        const summary = formatSummary(response?.data?.data ?? {});

        setStore((prev) => ({
          ...prev,
          [key]: {
            counts: summary.counts,
            total: summary.total,
            userReaction: summary.userReaction,
            loading: false,
            error: "",
            lastFetchedAt: new Date().toISOString(),
          },
        }));

        return summary;
      } catch (err) {
        const message =
          err?.response?.data?.message ||
          err?.message ||
          "No fue posible obtener las reacciones.";

        setStore((prev) => ({
          ...prev,
          [key]: {
            ...(prev[key] ?? {
              counts: mergeCounts(),
              total: 0,
              userReaction: null,
            }),
            loading: false,
            error: message,
            lastFetchedAt: prev[key]?.lastFetchedAt ?? null,
          },
        }));

        const error = new Error(message);
        error.status = err?.response?.status;
        error.details = err?.response?.data?.errors;
        throw error;
      }
    },
    [currentUserId]
  );


  const primeSummary = useCallback((type, referenceId, summary, options = {}) => {
    const key = toKey(type, referenceId);
    if (!key) {
      return;
    }

    const formatted = formatSummary(summary ?? {});
    const force = Boolean(options.force);
    const timestamp = new Date().toISOString();

    setStore((prev) => {
      const existing = prev[key] ?? null;
      if (!force && existing && existing.lastFetchedAt) {
        return prev;
      }

      return {
        ...prev,
        [key]: {
          counts: formatted.counts,
          total: formatted.total,
          userReaction: formatted.userReaction,
          loading: false,
          error: '',
          lastFetchedAt: timestamp,
        },
      };
    });
  }, []);
  const toggleReaction = useCallback(
    async ({ type, referenceId, reaction }) => {
      const key = toKey(type, referenceId);
      if (!key) {
        throw new Error("Referencia de reaccion invalida.");
      }

      const reactionCode = typeof reaction === "string" ? reaction : "";
      if (!REACTION_MAP[reactionCode]) {
        throw new Error("Tipo de reaccion no admitido.");
      }

      if (!currentUserId) {
        throw new Error("Debes iniciar sesion para reaccionar.");
      }

      const previousEntry = storeRef.current[key] ?? null;
      const previousSummary = formatSummary(previousEntry ?? {});
      const snapshot = previousEntry
        ? {
            ...previousEntry,
            counts: {
              ...mergeCounts(previousEntry.counts ?? previousSummary.counts),
            },
          }
        : null;

      const optimisticCounts = { ...previousSummary.counts };
      const hadReaction =
        typeof previousSummary.userReaction === "string" && previousSummary.userReaction !== "";
      const removingCurrent = previousSummary.userReaction === reactionCode;

      let nextUserReaction = previousSummary.userReaction;
      let nextTotal = previousSummary.total;

      if (removingCurrent) {
        if (typeof optimisticCounts[reactionCode] === "number" && optimisticCounts[reactionCode] > 0) {
          optimisticCounts[reactionCode] -= 1;
        }
        nextUserReaction = null;
        nextTotal = Math.max(0, nextTotal - 1);
      } else {
        if (
          hadReaction &&
          REACTION_MAP[previousSummary.userReaction] &&
          typeof optimisticCounts[previousSummary.userReaction] === "number" &&
          optimisticCounts[previousSummary.userReaction] > 0
        ) {
          optimisticCounts[previousSummary.userReaction] -= 1;
        }
        optimisticCounts[reactionCode] = (optimisticCounts[reactionCode] ?? 0) + 1;
        if (!hadReaction) {
          nextTotal += 1;
        }
        nextUserReaction = reactionCode;
      }

      const optimisticEntry = {
        counts: optimisticCounts,
        total: nextTotal,
        userReaction: nextUserReaction,
        loading: false,
        error: "",
        lastFetchedAt: previousEntry?.lastFetchedAt ?? null,
      };

      setPending((prev) => ({ ...prev, [key]: true }));
      setStore((prev) => ({
        ...prev,
        [key]: optimisticEntry,
      }));

      const [typeName] = key.split(":");
      const id = key.substring(typeName.length + 1);

      try {
        const payload = {
          tipo: reactionCode,
          tipoReferencia: typeName,
          referencia_id: id,
          usuario_id: currentUserId,
        };

        const response = await api.post("/reacciones", payload);
        const rawData = response?.data?.data ?? {};
        const summary = formatSummary(rawData.summary ?? {});
        const resolvedReaction =
          typeof rawData.userReaction === "string" && REACTION_MAP[rawData.userReaction]
            ? rawData.userReaction
            : summary.userReaction;

        setStore((prev) => ({
          ...prev,
          [key]: {
            counts: summary.counts,
            total: summary.total,
            userReaction: resolvedReaction,
            loading: false,
            error: "",
            lastFetchedAt: new Date().toISOString(),
          },
        }));

        return {
          counts: summary.counts,
          total: summary.total,
          userReaction: resolvedReaction,
          message: response?.data?.message || "",
        };
      } catch (err) {
        const message =
          err?.response?.data?.message ||
          err?.message ||
          "No fue posible actualizar la reaccion.";

        setStore((prev) => ({
          ...prev,
          [key]: {
            ...(snapshot ?? {
              counts: mergeCounts(),
              total: 0,
              userReaction: null,
              lastFetchedAt: null,
            }),
            loading: false,
            error: message,
          },
        }));

        const error = new Error(message);
        error.status = err?.response?.status;
        error.details = err?.response?.data?.errors;
        throw error;
      } finally {
        setPending((prev) => {
          const next = { ...prev };
          delete next[key];
          return next;
        });
      }
    },
    [currentUserId]
  );

  const isProcessing = useCallback(
    (type, referenceId) => {
      const key = toKey(type, referenceId);
      return Boolean(key && pending[key]);
    },
    [pending]
  );

  const contextValue = useMemo(
    () => ({
      reactionTypes: REACTION_TYPES,
      getSummary,
      fetchSummary,
      primeSummary,
      toggleReaction,
      isProcessing,
      canReact: Boolean(currentUserId),
    }),
    [currentUserId, fetchSummary, getSummary, isProcessing, primeSummary, toggleReaction]
  );

  return <ReactionsContext.Provider value={contextValue}>{children}</ReactionsContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useReactions() {
  const context = useContext(ReactionsContext);
  if (!context) {
    throw new Error("useReactions debe utilizarse dentro de un ReactionsProvider");
  }
  return context;
}

