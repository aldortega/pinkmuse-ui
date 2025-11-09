import { useMemo } from "react";
import { Link } from "react-router-dom";

import { useEvents } from "@/contexts/EventContext";
import {
  getEventKey,
  splitEventsByDate,
} from "../eventos/eventManagement.utils";
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

    const location = [calleNumero, ciudadProvincia].filter(Boolean).join(", ");

    if (location) {
      return location;
    }
  }

  return "Lugar por confirmar";
};

export default function UpcomingEvents() {
  const { events, loading, error } = useEvents();

  const { upcomingEvents: allUpcoming } = useMemo(
    () => splitEventsByDate(events),
    [events]
  );

  const mainEvent = useMemo(() => {
    if (allUpcoming.length === 0) {
      return null;
    }
    const event = allUpcoming[0];
    const fallbackKey = getEventKey(event) || `main-event-${event?._id}`;
    const imageUrl = buildImageUrl(event?.imagenPrincipal);

    return {
      key: fallbackKey,
      title: event?.nombreEvento || "Evento sin titulo",
      date: formatEventDate(event?.fecha),
      time: event?.hora || null,
      location: buildEventLocation(event),
      image: imageUrl || FALLBACK_IMAGE,
      slug: event?.slug,
    };
  }, [allUpcoming]);

  const secondaryEvents = useMemo(() => {
    return allUpcoming.slice(1, 3).map((event, index) => {
      const fallbackKey =
        getEventKey(event) ||
        [event?.nombreEvento, event?._id, event?.fecha]
          .filter(Boolean)
          .join("-") ||
        `upcoming-${index}`;

      const imageUrl = buildImageUrl(event?.imagenPrincipal);

      return {
        key: fallbackKey,
        title: event?.nombreEvento || "Evento sin titulo",
        date: formatEventDate(event?.fecha),
        time: event?.hora || null,
        location: buildEventLocation(event),
        image: imageUrl || FALLBACK_IMAGE,
        slug: event?.slug,
      };
    });
  }, [allUpcoming]);

  return (
    <section className="overflow-hidden rounded-2xl bg-red-50/50 p-6 sm:p-8">
      <div className="mx-auto w-full max-w-6xl">
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

        {!loading &&
          !error &&
          (allUpcoming.length > 0 ? (
            <div className="flex flex-col gap-8">
              {mainEvent && (
                <Link to={`/eventos/${mainEvent.slug}`} className="group block">
                  <div className="grid grid-cols-1 items-center gap-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:border-red-300 hover:shadow-md md:grid-cols-2 md:gap-8">
                    <div className="aspect-video w-full overflow-hidden md:aspect-auto md:h-full">
                      <img
                        src={mainEvent.image}
                        alt={`Imagen de ${mainEvent.title}`}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex flex-col p-6 pt-0 md:p-6">
                      <p className="text-sm font-semibold text-red-500">
                        EVENTO DESTACADO
                      </p>
                      <h3 className="mt-2 text-2xl font-bold text-slate-800 group-hover:text-red-600">
                        {mainEvent.title}
                      </h3>
                      <p className="mt-3 text-sm text-slate-600">
                        {mainEvent.date}{" "}
                        {mainEvent.time ? `- ${mainEvent.time}` : ""}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        {mainEvent.location}
                      </p>
                      <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-red-500 transition-colors group-hover:text-red-700">
                        Ver detalles
                        <span className="transition-transform group-hover:translate-x-1">
                          →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              )}

              {secondaryEvents.length > 0 && (
                <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
                  {secondaryEvents.map((event) => (
                    <EventCard
                      key={event.key}
                      title={event.title}
                      date={event.date}
                      time={event.time}
                      location={event.location}
                      image={event.image}
                      slug={event.slug}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p className="text-center text-slate-600 sm:text-left">
              No hay eventos programados proximamente. Vuelve mas tarde.
            </p>
          ))}
      </div>
    </section>
  );
}
