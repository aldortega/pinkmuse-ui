import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buildImageUrl } from "@/lib/imageService";

const formatDateTime = (fecha, hora) => {
  if (!fecha) {
    return "Fecha por confirmar";
  }
  const date = new Date(fecha);
  if (Number.isNaN(date.getTime())) {
    return fecha;
  }
  const datePart = date.toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  if (!hora) {
    return datePart;
  }

  return `${datePart} · ${hora}`;
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

const buildInvitados = (artistasExtras) => {
  if (!Array.isArray(artistasExtras) || artistasExtras.length === 0) {
    return null;
  }
  return artistasExtras.join(", ");
};

export default function TicketDetailHero({ event }) {
  const imageUrl = buildImageUrl(event?.imagenPrincipal) || "/imagen4.png";
  const fechaHora = formatDateTime(event?.fecha, event?.hora);
  const lugar = buildLugar(event);
  const invitados = buildInvitados(event?.artistasExtras);

  return (
    <section className="overflow-hidden rounded-2xl bg-gradient-to-br from-rose-500 via-red-400 to-red-600 text-white shadow-xl">
      <div className="grid gap-6 md:grid-cols-[1.1fr_1fr] lg:grid-cols-[1.2fr_1fr]">
        <div className="relative">
          <img
            src={imageUrl}
            alt={event?.nombreEvento || "Evento PinkMuse"}
            className="h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 space-y-4">
            <Badge className="bg-white/20 text-white hover:bg-white/25">
              Entradas oficiales
            </Badge>
            <h1 className="text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
              {event?.nombreEvento || "Evento sin título"}
            </h1>
            <p className="text-base text-white/85">{fechaHora}</p>
          </div>
        </div>

        <div className="flex flex-col gap-6 p-6 sm:p-10">
          <div className="space-y-3 text-sm text-white/85">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 flex-shrink-0 text-white" />
              <div>
                <p className="text-xs uppercase tracking-wide text-white/70">
                  Fecha y hora
                </p>
                <p className="text-base text-white">{fechaHora}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 flex-shrink-0 text-white" />
              <div>
                <p className="text-xs uppercase tracking-wide text-white/70">
                  Ubicación
                </p>
                <p className="text-base text-white">{lugar}</p>
              </div>
            </div>
            {invitados ? (
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 flex-shrink-0 text-white" />
                <div>
                  <p className="text-xs uppercase tracking-wide text-white/70">
                    Invitados especiales
                  </p>
                  <p className="text-base text-white">{invitados}</p>
                </div>
              </div>
            ) : null}
          </div>

          <div className="rounded-2xl bg-white/15 p-6">
            <p className="text-sm text-white/80">
              Elegí tu tipo de entrada para continuar con la compra. La
              disponibilidad se sincroniza directamente con la gestión de
              eventos, sin acciones manuales.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
