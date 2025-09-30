import { useEffect, useMemo, useState } from "react";

import api from "@/lib/axios";

import { getEventKey, splitEventsByDate } from "../eventos/eventManagement.utils";
import { EventCard } from "./EventCard";

const FALLBACK_IMAGE = "/brazos.png";

const formatEventDate = (value) => {
  if (!value) {
    return "Fecha por confirmar";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const buildEventLocation = (event) => {
  if (event?.nombreLugar) {
    return event.nombreLugar;
  }

  const direccion = event?.direccion;
  if (direccion && typeof direccion === "object") {
    const calleNumero = [direccion.calle, direccion.numero]
      .filter(Boolean)
      .join(" ");
    const ciudadProvincia = [direccion.ciudad, direccion.provincia]
      .filter(Boolean)
      .join(", ");

    const location = [calleNumero, ciudadProvincia]
      .filter(Boolean)
      .join(", ");

    if (location) {
      return location;
    }
  }

  return "Lugar por confirmar";
};

export default function UpcomingEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchUpcomingEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get("/eventos");
        if (!isMounted) {
          return;
        }
        const fetched = Array.isArray(response?.data?.data)
          ? response.data.data
          : [];
        setEvents(fetched);
      } catch (err) {
        if (!isMounted) {
          return;
        }
        const message =
          err?.response?.data?.message ||
          "No pudimos obtener los eventos proximos.";
        setError(message);
        setEvents([]);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchUpcomingEvents();

    return () => {
      isMounted = false;
    };
  }, []);

  const upcomingEvents = useMemo(() => {
    const { upcomingEvents: sortedUpcoming } = splitEventsByDate(events);
    return sortedUpcoming.slice(0, 3).map((event, index) => {
      const fallbackKey = [
        event?.nombreEvento,
        event?._id,
        event?.id,
        event?.fecha,
      ]
        .filter(Boolean)
        .join("-") || `upcoming-${index}`;

      return {
        key: getEventKey(event) || fallbackKey,
        title: event?.nombreEvento || "Evento sin titulo",
        date: formatEventDate(event?.fecha),
        time: event?.hora || null,
        location: buildEventLocation(event),
        image: event?.imagenPrincipal || FALLBACK_IMAGE,
      };
    });
  }, [events]);

  return (
    <section>
      <div className="container px-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">
          Proximos eventos
        </h2>

        {loading && (
          <p className="text-slate-600">Cargando eventos...</p>
        )}

        {!loading && error && (
          <p className="text-destructive">{error}</p>
        )}

        {!loading && !error && (
          upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <EventCard
                  key={event.key}
                  title={event.title}
                  date={event.date}
                  time={event.time}
                  location={event.location}
                  image={event.image}
                />
              ))}
            </div>
          ) : (
            <p className="text-slate-600">
              No hay eventos programados proximamente. Vuelve mas tarde.
            </p>
          )
        )}
      </div>
    </section>
  );
}
