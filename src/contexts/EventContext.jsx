import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import api from "@/lib/axios";
import { getEventKey } from "@/components/eventos/eventManagement.utils";

const EventContext = createContext(null);

const normalizeName = (value) => {
  if (!value) {
    return "";
  }
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

export function EventProvider({ children }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/eventos");
      const fetched = Array.isArray(response?.data?.data)
        ? response.data.data
        : [];
      setEvents(fetched);
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "No pudimos obtener los eventos.";
      setError(message);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const upsertEvent = useCallback((incoming) => {
    if (!incoming) {
      return;
    }
    setEvents((prev) => {
      const key = getEventKey(incoming);
      const name = incoming?.nombreEvento;
      const slug = name ? encodeURIComponent(name) : null;

      const existsIndex = prev.findIndex((event) => {
        if (key && getEventKey(event) === key) {
          return true;
        }
        if (name && event?.nombreEvento === name) {
          return true;
        }
        if (slug && encodeURIComponent(event?.nombreEvento ?? "") === slug) {
          return true;
        }
        return false;
      });

      if (existsIndex >= 0) {
        const updated = [...prev];
        updated[existsIndex] = incoming;
        return updated;
      }

      return [...prev, incoming];
    });
  }, []);

  const removeEvent = useCallback((identifier) => {
    if (!identifier) {
      return;
    }

    setEvents((prev) =>
      prev.filter((event) => {
        if (typeof identifier === "string") {
          const normalized = normalizeName(identifier);
          if (event?.nombreEvento === normalized) {
            return false;
          }
          const slug = encodeURIComponent(event?.nombreEvento ?? "");
          if (slug === identifier) {
            return false;
          }
          return getEventKey(event) !== identifier;
        }

        return getEventKey(event) !== getEventKey(identifier);
      })
    );
  }, []);

  const getEventBySlug = useCallback(
    (slug) => {
      if (!slug) {
        return null;
      }
      const decoded = normalizeName(slug);
      return (
        events.find((event) => event?.nombreEvento === decoded) ||
        events.find(
          (event) => encodeURIComponent(event?.nombreEvento ?? "") === slug
        )
      );
    },
    [events]
  );

  const value = useMemo(
    () => ({
      events,
      loading,
      error,
      refetch: fetchEvents,
      upsertEvent,
      removeEvent,
      getEventBySlug,
    }),
    [events, loading, error, fetchEvents, upsertEvent, removeEvent, getEventBySlug]
  );

  return <EventContext.Provider value={value}>{children}</EventContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useEvents() {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error("useEvents debe utilizarse dentro de un EventProvider");
  }
  return context;
}
