import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, MapPin, Clock, Edit, Ticket, Users } from "lucide-react";

const formatDate = (value) => {
  if (!value) {
    return "Fecha por confirmar";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString("es-AR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const formatEstado = (estado) => {
  if (!estado) {
    return "Sin estado";
  }
  return estado.charAt(0).toUpperCase() + estado.slice(1);
};

const buildLugar = (evento) => {
  if (evento?.nombreLugar) {
    return evento.nombreLugar;
  }
  const direccion = evento?.direccion;
  if (direccion && typeof direccion === "object") {
    const partes = [];
    if (direccion.calle) {
      partes.push(
        direccion.numero
          ? `${direccion.calle} ${direccion.numero}`
          : direccion.calle
      );
    } else if (direccion.numero) {
      partes.push(String(direccion.numero));
    }
    if (direccion.ciudad) {
      partes.push(direccion.ciudad);
    }
    if (partes.length > 0) {
      return partes.join(", ");
    }
  }
  return "Lugar por confirmar";
};

const formatEntradas = (entradas) => {
  if (!Array.isArray(entradas) || entradas.length === 0) {
    return [];
  }
  return entradas.map((entrada) => ({
    tipo: entrada?.tipo || "Sin tipo",
    precio: Number.parseFloat(entrada?.precio),
    cantidad: Number.parseInt(entrada?.cantidad, 10),
    estado: formatEstado(entrada?.estado || ""),
  }));
};

export function EventDetails({ event, onEdit }) {
  const fecha = formatDate(event?.fecha);
  const lugar = buildLugar(event);
  const entradas = formatEntradas(event?.entradas);

  return (
    <div className="space-y-6">
      <div className="relative">
        <img
          src={event?.imagenPrincipal || "/imagen22.png"}
          alt={event?.nombreEvento || "Evento"}
          className="w-full h-64 object-cover rounded-lg"
        />
        <div className="absolute top-4 left-4">
          <Badge variant="secondary" className="text-sm">
            {formatEstado(event?.estado)}
          </Badge>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-balance bg-gradient-to-br from-rose-500 via-red-400 to-red-500 text-transparent bg-clip-text">
            {event?.nombreEvento || "Evento sin titulo"}
          </h2>
          <p className="text-muted-foreground">{lugar}</p>
        </div>
        <Button
          onClick={() => onEdit?.(event)}
          className="gap-2 cursor-pointer self-start bg-gradient-to-br from-rose-500 via-red-400 to-red-500"
        >
          <Edit className="h-4 w-4 " />
          Editar evento
        </Button>
      </div>

      <Separator />

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Informacion del evento</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium capitalize">{fecha}</p>
                <p className="text-muted-foreground">Fecha</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">
                  {event?.hora || "Horario por confirmar"}
                </p>
                <p className="text-muted-foreground">Hora</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">{lugar}</p>
                <p className="text-muted-foreground">Ubicacion</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Entradas</h3>
          {entradas.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Aun no se cargaron tipos de entrada para este evento.
            </p>
          ) : (
            <div className="space-y-3 text-sm">
              {entradas.map((entrada, index) => (
                <div
                  key={`${entrada.tipo}-${index}`}
                  className="flex items-center justify-between rounded-md border px-3 py-2"
                >
                  <div>
                    <p className="font-medium">{entrada.tipo}</p>
                    <p className="text-muted-foreground">
                      Estado: {entrada.estado}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary">
                      {Number.isFinite(entrada.precio)
                        ? `$${entrada.precio.toFixed(2)}`
                        : "Precio no definido"}
                    </p>
                    <p className="text-muted-foreground">
                      <Ticket className="inline h-3 w-3 mr-1" />
                      {Number.isFinite(entrada.cantidad)
                        ? `${entrada.cantidad} disponibles`
                        : "Cantidad no definida"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Separator />

      <div className="space-y-3">
        <h3 className="font-semibold text-lg">Artistas invitados</h3>
        {Array.isArray(event?.artistasExtras) &&
        event.artistasExtras.length > 0 ? (
          <ul className="grid gap-2 sm:grid-cols-2">
            {event.artistasExtras.map((artista, index) => (
              <li
                key={`${artista}-${index}`}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <Users className="h-4 w-4 text-primary" />
                {artista}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            No hay artistas adicionales registrados.
          </p>
        )}
      </div>
    </div>
  );
}
