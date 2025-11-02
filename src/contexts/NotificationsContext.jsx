import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import api from "@/lib/axios";
import { useUser } from "@/contexts/UserContext";

const NotificationsContext = createContext(null);

const SUPPORTED_TYPES = ["evento", "producto", "noticia"];
const POLL_INTERVAL_MS = 30_000;
const MAX_NOTIFICATIONS = 20;

const parseDate = (value) => {
  if (!value) {
    return null;
  }

  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const formatDate = (value) => {
  const date = parseDate(value);
  if (!date) {
    return "";
  }

  try {
    return new Intl.DateTimeFormat("es-AR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch {
    return date.toISOString();
  }
};

const normalizeType = (value) => {
  if (typeof value !== "string") {
    return "general";
  }
  const normalized = value.trim().toLowerCase();
  return SUPPORTED_TYPES.includes(normalized) ? normalized : "general";
};

const pickString = (...values) => {
  for (const value of values) {
    if (typeof value !== "string") {
      continue;
    }
    const trimmed = value.trim();
    if (trimmed !== "") {
      return trimmed;
    }
  }
  return null;
};

const normalizeNotification = (raw) => {
  if (!raw || typeof raw !== "object") {
    return null;
  }

  const idCandidate =
    (typeof raw._id === "string" && raw._id) ||
    (raw._id && typeof raw._id === "object" && typeof raw._id.$oid === "string" && raw._id.$oid) ||
    (typeof raw.id === "string" && raw.id) ||
    (typeof raw.referencia_id === "string" && raw.referencia_id) ||
    null;

  const datos = raw.datos && typeof raw.datos === "object" ? raw.datos : {};

  const createdAt =
    raw.fecha ??
    raw.created_at ??
    raw.updated_at ??
    datos?.fecha ??
    datos?.createdAt ??
    null;

  const normalizedDate = parseDate(createdAt);

  const baseType = normalizeType(raw.tipo);
  const referenceType = normalizeType(
    pickString(
      raw.referencia_tipo,
      raw.reference_type,
      raw.referenciaTipo,
      raw.referenceType,
      datos?.referencia_tipo,
      datos?.reference_type,
      datos?.referenciaTipo
    ) ?? raw.tipo
  );

  const referenceId = pickString(
    raw.referencia_id,
    raw.referenciaId,
    raw.reference_id,
    raw.referenceId,
    datos?.referencia_id,
    datos?.referenciaId,
    datos?.reference_id,
    datos?.referenceId
  );

  const referenceSlug = pickString(
    datos?.slug,
    datos?.slugEvento,
    datos?.slugNoticia,
    datos?.slugProducto,
    datos?.slugReferencia,
    raw.slug,
    raw.slugReferencia,
    raw.referencia_slug,
    raw.reference_slug
  );

  const rawLink = pickString(datos?.link, raw.link, raw.url);

  const fallbackLink = (() => {
    const buildPath = (basePath, value) => {
      if (!value) {
        return null;
      }
      return basePath + "/" + encodeURIComponent(value);
    };

    switch (referenceType) {
      case "evento":
        return buildPath("/eventos", referenceSlug ?? referenceId);
      case "noticia":
        return buildPath("/noticias", referenceSlug ?? referenceId);
      case "producto":
        return buildPath("/merch", referenceSlug ?? referenceId);
      default:
        return null;
    }
  })();

  const baseTitle =
    typeof raw.titulo === "string" && raw.titulo.trim() !== ""
      ? raw.titulo.trim()
      : "Nueva notificaciA3n";

  const baseMessage =
    typeof raw.mensaje === "string" && raw.mensaje.trim() !== ""
      ? raw.mensaje.trim()
      : "";

  const fallbackId =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : "notif-" + Math.random().toString(36).slice(2, 10);

  return {
    id: idCandidate ?? fallbackId,
    type: baseType,
    referenceType,
    referenceId: referenceId ?? null,
    title: baseTitle,
    message: baseMessage,
    link: rawLink ?? fallbackLink,
    image:
      typeof datos.imagen === "string" && datos.imagen.trim() !== ""
        ? datos.imagen
        : null,
    read: Boolean(raw.leida),
    createdAt: normalizedDate ? normalizedDate.toISOString() : null,
    formattedDate: normalizedDate ? formatDate(normalizedDate) : "",
    raw,
  };
};

const mergeNotifications = (previous = [], incoming = []) => {
  if (!Array.isArray(previous) || previous.length === 0) {
    return Array.isArray(incoming) ? [...incoming] : [];
  }

  if (!Array.isArray(incoming) || incoming.length === 0) {
    return [];
  }

  const incomingMap = new Map();

  for (const item of incoming) {
    if (item && item.id) {
      incomingMap.set(item.id, item);
    }
  }

  const seen = new Set();
  const mergedExisting = [];

  for (const item of previous) {
    if (!item || !item.id) {
      continue;
    }

    const nextItem = incomingMap.get(item.id);
    if (nextItem) {
      mergedExisting.push(nextItem);
      seen.add(nextItem.id);
      incomingMap.delete(item.id);
    } else {
      mergedExisting.push(item);
      seen.add(item.id);
    }
  }

  const newItems = incoming.filter((item) => item && item.id && !seen.has(item.id));

  return [...newItems, ...mergedExisting];
};

export function NotificationsProvider({ children }) {
  const { isAuthenticated } = useUser();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const abortControllerRef = useRef(null);
  const latestStateRef = useRef({ items: [], unread: 0 });

  const normalizeResponse = useCallback((payload) => {
    const items = Array.isArray(payload?.items) ? payload.items : [];
    const normalized = items
      .map(normalizeNotification)
      .filter((item) => item !== null);

    const unread = Number.parseInt(payload?.unread ?? 0, 10);

    return {
      items: normalized,
      unread: Number.isNaN(unread) ? 0 : unread,
    };
  }, []);

  const fetchNotifications = useCallback(
    async ({ onlyUnread = false, signal } = {}) => {
      if (!isAuthenticated) {
        setNotifications([]);
        setUnreadCount(0);
        setError("");
        latestStateRef.current = { items: [], unread: 0 };
        return { items: [], unread: 0 };
      }

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      const requestSignal = signal ?? controller.signal;

      setLoading(true);
      setError("");

      try {
        const params = { limit: 20 };
        if (onlyUnread) {
          params.solo_no_leidas = "1";
        }

        const response = await api.get("/notificaciones", {
          params,
          signal: requestSignal,
        });

        const data = normalizeResponse(response?.data?.data ?? {});
        const mergedItems =
          onlyUnread || latestStateRef.current.items.length === 0
            ? data.items
            : mergeNotifications(latestStateRef.current.items, data.items);

        const limitedItems = mergedItems.slice(0, MAX_NOTIFICATIONS);

        setNotifications(limitedItems);
        setUnreadCount(data.unread);
        latestStateRef.current = { items: limitedItems, unread: data.unread };

        return { items: limitedItems, unread: data.unread };
      } catch (err) {
        if (err?.name === "CanceledError" || err?.name === "AbortError") {
          return latestStateRef.current;
        }

        const message =
          err?.response?.data?.message ||
          err?.message ||
          "No pudimos obtener tus notificaciones.";
        setError(message);
        setNotifications([]);
        setUnreadCount(0);
        latestStateRef.current = { items: [], unread: 0 };
        throw err;
      } finally {
        setLoading(false);
        if (abortControllerRef.current === controller) {
          abortControllerRef.current = null;
        }
      }
    },
    [isAuthenticated, normalizeResponse]
  );

  const markAsRead = useCallback(async (id) => {
    if (!id) {
      return null;
    }

    await api.patch(`/notificaciones/${encodeURIComponent(id)}/marcar-leida`);

    let shouldDecrease = false;
    setNotifications((prev) =>
      prev.map((item) => {
        if (item.id !== id) {
          return item;
        }
        if (!item.read) {
          shouldDecrease = true;
        }
        return { ...item, read: true };
      })
    );

    if (shouldDecrease) {
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }

    return true;
  }, []);

  const markAllAsRead = useCallback(async () => {
    if (!notifications.length) {
      setUnreadCount(0);
      return true;
    }

    await api.post("/notificaciones/marcar-todas-leidas");

    setNotifications((prev) =>
      prev.map((item) => ({ ...item, read: true }))
    );
    setUnreadCount(0);
    return true;
  }, [notifications.length]);

  const deleteNotification = useCallback(async (id) => {
    if (!id || (typeof id === "string" && id.trim() === "")) {
      return false;
    }

    const normalizedId = typeof id === "string" ? id.trim() : String(id);

    await api.delete(`/notificaciones/${encodeURIComponent(normalizedId)}`);

    const snapshot = latestStateRef.current;
    const removedItem = snapshot.items.find((item) => item.id === normalizedId);
    const wasUnread = removedItem ? !removedItem.read : false;

    const filteredItems = snapshot.items.filter((item) => item.id !== normalizedId);

    latestStateRef.current = {
      items: filteredItems,
      unread: Math.max(0, snapshot.unread - (wasUnread ? 1 : 0)),
    };

    setNotifications(filteredItems);
    if (wasUnread) {
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }

    return true;
  }, []);

  useEffect(() => {
    latestStateRef.current = { items: notifications, unread: unreadCount };
  }, [notifications, unreadCount]);

  useEffect(() => {
    if (!isAuthenticated) {
      setNotifications([]);
      setUnreadCount(0);
      setError("");
      return undefined;
    }

    const controller = new AbortController();
    fetchNotifications({ signal: controller.signal }).catch(() => {
      // el estado de error ya se maneja en fetchNotifications
    });

    const intervalId = window.setInterval(() => {
      fetchNotifications().catch(() => {
        // el estado de error ya se maneja en fetchNotifications
      });
    }, POLL_INTERVAL_MS);

    return () => {
      controller.abort();
      window.clearInterval(intervalId);
    };
  }, [isAuthenticated, fetchNotifications]);
  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      loading,
      error,
      refetch: fetchNotifications,
      markAsRead,
      markAllAsRead,
      deleteNotification,
    }),
    [
      notifications,
      unreadCount,
      loading,
      error,
      fetchNotifications,
      markAsRead,
      markAllAsRead,
      deleteNotification,
    ]
  );

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error(
      "useNotifications debe utilizarse dentro de un NotificationsProvider"
    );
  }
  return context;
}





