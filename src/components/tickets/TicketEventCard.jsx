import { Link } from "react-router-dom";
import { Calendar, Clock, MapPin, Ticket } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { buildImageUrl } from "@/lib/imageService";

const formatDate = (value) => {
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

const getTicketStats = (entradas) => {
  if (!Array.isArray(entradas) || entradas.length === 0) {
    return null;
  }

  const disponibles = entradas.filter(
    (entrada) =>
      entrada?.estado === "disponible" &&
      Number.parseInt(entrada?.cantidad, 10) > 0
  );

  const precios = entradas
    .map((entrada) => Number.parseFloat(entrada?.precio))
    .filter((precio) => !Number.isNaN(precio));

  if (precios.length === 0) {
    return {
      tieneDisponibles: disponibles.length > 0,
      precioMin: null,
      precioMax: null,
      cantidadTipos: entradas.length,
    };
  }

  return {
    tieneDisponibles: disponibles.length > 0,
    precioMin: Math.min(...precios),
    precioMax: Math.max(...precios),
    cantidadTipos: entradas.length,
  };
};

const buildEventSlug = (nombre) => {
  if (!nombre) {
    return "";
  }
  return encodeURIComponent(nombre);
};

export default function TicketEventCard({ event }) {
  const fechaFormateada = formatDate(event?.fecha);
  const lugar = buildLugar(event);
  const ticketStats = getTicketStats(event?.entradas);
  const imageUrl = buildImageUrl(event?.imagenPrincipal) || "/imagen4.png";
  const slug = buildEventSlug(event?.nombreEvento);

  return (
    <Card className="flex flex-col overflow-hidden bg-red-50 transition hover:shadow-lg">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <img
            src={imageUrl}
            alt={event?.nombreEvento || "Evento PinkMuse"}
            className="h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent p-4">
            <p className="text-lg font-semibold text-white">
              {event?.nombreEvento || "Evento sin título"}
            </p>
            <p className="text-sm text-white/80">{lugar}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4 p-5">
        <div className="space-y-2 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-red-400" />
            <span>{fechaFormateada}</span>
            {event?.hora ? (
              <>
                <Clock className="h-4 w-4 text-red-400" />
                <span>{event.hora}</span>
              </>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-red-400" />
            <span className="truncate">{lugar}</span>
          </div>
        </div>

        {ticketStats ? (
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <Badge
              variant="secondary"
              className="bg-red-100 text-slate-800 hover:bg-red-100"
            >
              <Ticket className="mr-1 h-3 w-3" />
              {ticketStats.cantidadTipos} tipos de entrada
            </Badge>
            {ticketStats.precioMin !== null ? (
              <Badge
                variant="outline"
                className="border-red-200 text-slate-800"
              >
                Desde ${ticketStats.precioMin.toFixed(0)}
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="border-red-200 text-slate-800"
              >
                Precio a confirmar
              </Badge>
            )}
            <Badge
              variant={ticketStats.tieneDisponibles ? "outline" : "secondary"}
              className={
                ticketStats.tieneDisponibles
                  ? "border-green-200 text-green-600"
                  : "border-red-200 bg-red-100 text-red-600"
              }
            >
              {ticketStats.tieneDisponibles
                ? "Entradas disponibles"
                : "Agotado"}
            </Badge>
          </div>
        ) : (
          <p className="text-sm text-slate-500">
            Aún no se cargaron tipos de entradas para este evento.
          </p>
        )}

        <div className="mt-auto">
          <Button
            asChild
            className="w-full cursor-pointer bg-gradient-to-r from-rose-500 via-red-400 to-red-500 text-white shadow hover:opacity-90"
          >
            <Link to={slug ? `/entradas/${slug}` : "/entradas"}>
              Ver entradas
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
