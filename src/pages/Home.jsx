import React, { useEffect, useState } from "react";
import { Calendar, MapPin, Clock } from "lucide-react";
import api from "../lib/axios";

const formatDate = (value) => {
  if (!value) {
    return "Fecha por confirmar";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString("es-AR", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};

const buildLugar = (evento) => {
  if (evento?.nombreLugar) {
    return evento.nombreLugar;
  }

  const direccion = evento?.direccion;
  if (direccion && typeof direccion === "object") {
    const calleNumero = [direccion.calle, direccion.numero]
      .filter(Boolean)
      .join(" ");
    return [calleNumero, direccion.ciudad].filter(Boolean).join(", ");
  }

  return "Lugar por confirmar";
};

export default function HomePage() {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchEventos = async () => {
      try {
        const response = await api.get("/eventos");
        if (!isMounted) {
          return;
        }
        const data = Array.isArray(response?.data?.data)
          ? response.data.data
          : [];
        setEventos(data);
      } catch (err) {
        if (!isMounted) {
          return;
        }
        const message =
          err?.response?.data?.message || "No pudimos cargar los eventos.";
        setError(message);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchEventos();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="max-w-7xl mx-auto px-6 py-12 space-y-16">
      {/* Hero */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-800">
          Bienvenido a <span className="text-pink-600">PinkMuse</span>
        </h1>
        <p className="text-slate-600 text-lg">
          Descubre noticias, eventos y merchandising de tus artistas favoritos.
        </p>
      </section>

      {/* Seccion Eventos */}
      <section id="eventos" className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl md:text-3xl font-bold">Eventos</h2>
          <span className="text-sm text-slate-500">
            {eventos.length} evento{eventos.length === 1 ? "" : "s"}
          </span>
        </div>

        {loading && (
          <p className="text-slate-500">Cargando eventos...</p>
        )}

        {!loading && error && (
          <p className="text-red-500">{error}</p>
        )}

        {!loading && !error && eventos.length === 0 && (
          <p className="text-slate-500">
            Aun no hay eventos publicados. Vuelve pronto para descubrir nuevas fechas.
          </p>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {!loading && !error &&
            eventos.map((evento) => {
              const fechaFormateada = formatDate(evento.fecha);
              const lugar = buildLugar(evento);

              return (
                <article
                  key={evento._id || evento.id || evento.nombreEvento}
                  className="rounded-2xl border border-pink-200 bg-white shadow-md hover:shadow-lg transition overflow-hidden"
                >
                  {evento.imagenPrincipal ? (
                    <img
                      src={evento.imagenPrincipal}
                      alt={evento.nombreEvento}
                      className="w-full h-48 object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center text-pink-600 text-sm font-medium">
                      Imagen no disponible
                    </div>
                  )}
                  <div className="p-4 space-y-2">
                    <h3 className="font-semibold text-lg">
                      {evento.nombreEvento}
                    </h3>
                    <p className="flex items-center text-sm text-slate-600">
                      <Calendar className="h-4 w-4 mr-2 text-pink-500" />
                      {fechaFormateada}
                    </p>
                    {evento.hora && (
                      <p className="flex items-center text-sm text-slate-600">
                        <Clock className="h-4 w-4 mr-2 text-pink-500" />
                        {evento.hora}
                      </p>
                    )}
                    <p className="flex items-center text-sm text-slate-600">
                      <MapPin className="h-4 w-4 mr-2 text-pink-500" />
                      {lugar}
                    </p>
                  </div>
                </article>
              );
            })}
        </div>
      </section>

      {/* Placeholder para otras secciones */}
      <section id="noticias">
        <h2 className="text-2xl font-bold text-slate-800">Noticias</h2>
        <p className="text-slate-500">Proximamente...</p>
      </section>

      <section id="merch">
        <h2 className="text-2xl font-bold text-slate-800">Merch</h2>
        <p className="text-slate-500">Proximamente...</p>
      </section>
    </main>
  );
}
