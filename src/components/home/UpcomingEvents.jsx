import { useMemo } from "react";

import { useEvents } from "@/contexts/EventContext";
import { getEventKey, splitEventsByDate } from "../eventos/eventManagement.utils";
import { EventCard } from "./EventCard";
import { buildImageUrl } from "@/lib/imageService";

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
  const { events, loading, error } = useEvents();

  const upcomingEvents = useMemo(() => {
    const { upcomingEvents: sortedUpcoming } = splitEventsByDate(events);
    return sortedUpcoming.slice(0, 3).map((event, index) => {
      const fallbackKey =
        getEventKey(event) ||
        [event?.nombreEvento, event?._id, event?.fecha].filter(Boolean).join("-") ||
        `upcoming-${index}`;

      const imageUrl = buildImageUrl(event?.imagenPrincipal);

      return {
        key: fallbackKey,
        title: event?.nombreEvento || "Evento sin titulo",
        date: formatEventDate(event?.fecha),
        time: event?.hora || null,
        location: buildEventLocation(event),
        image: imageUrl || FALLBACK_IMAGE,
      };
    });
  }, [events]);

  return (
    <section className="py-10">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <h2 className="mb-6 text-center text-2xl font-bold text-slate-800 sm:text-left">
          Proximos eventos
        </h2>

        {loading && (
          <p className="text-center text-slate-600 sm:text-left">
            Cargando eventos...
          </p>
        )}

        {!loading && error && (
          <p className="text-center text-destructive sm:text-left">{error}</p>
        )}

        {!loading && !error && (
          upcomingEvents.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
            <p className="text-center text-slate-600 sm:text-left">
              No hay eventos programados proximamente. Vuelve mas tarde.
            </p>
          )
        )}
      </div>
    </section>
  );
}
