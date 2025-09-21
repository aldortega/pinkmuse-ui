import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock, Edit, Trash2, Ticket } from "lucide-react";

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
    const calleNumero = [direccion.calle, direccion.numero]
      .filter(Boolean)
      .join(" ");
    return [calleNumero, direccion.ciudad].filter(Boolean).join(", ");
  }
  return "Lugar por confirmar";
};

const getPrecioDesde = (entradas) => {
  if (!Array.isArray(entradas) || entradas.length === 0) {
    return null;
  }
  const precios = entradas
    .map((entrada) => Number.parseFloat(entrada.precio))
    .filter((precio) => !Number.isNaN(precio));
  if (precios.length === 0) {
    return null;
  }
  return Math.min(...precios);
};

const getEntradasDisponibles = (entradas) => {
  if (!Array.isArray(entradas)) {
    return null;
  }
  return entradas.reduce((total, entrada) => {
    const cantidad = Number.parseInt(entrada?.cantidad, 10);
    if (Number.isNaN(cantidad)) {
      return total;
    }
    return total + cantidad;
  }, 0);
};

export function EventCard({
  event,
  onView,
  onEdit,
  onDelete,
  isDeleting = false,
}) {
  const fechaFormateada = formatDate(event?.fecha);
  const lugar = buildLugar(event);
  const precioDesde = getPrecioDesde(event?.entradas);
  const entradasDisponibles = getEntradasDisponibles(event?.entradas);

  return (
    <Card
      className="group hover:shadow-lg transition-all duration-200 bg-red-50"
      onClick={() => onView?.(event)}
    >
      <CardHeader className="p-0">
        <div className="relative">
          <img
            src={event?.imagenPrincipal || "/imagen4.png"}
            alt={event?.nombreEvento || "Evento"}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          <div className="absolute top-3 left-3 ">
            <Badge
              variant="secondary"
              className="bg-red-100/80 backdrop-blur-sm text-slate-800"
            >
              {formatEstado(event?.estado)}
            </Badge>
          </div>
          {typeof entradasDisponibles === "number" && (
            <div className="absolute top-3 right-3">
              <Badge
                variant="outline"
                className="bg-red-100/80 backdrop-blur-sm text-slate-800"
              >
                <Ticket className="h-3 w-3 mr-1" />
                {entradasDisponibles} entradas
              </Badge>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-lg text-balance text-slate-800 transition-colors">
            {event?.nombreEvento || "Evento sin titulo"}
          </h3>
          {Array.isArray(event?.artistasExtras) &&
            event.artistasExtras.length > 0 && (
              <p className="text-sm text-slate-600 line-clamp-2">
                Invitados: {event.artistasExtras.join(", ")}
              </p>
            )}
        </div>

        <div className="space-y-2 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{fechaFormateada}</span>
            {event?.hora && (
              <>
                <Clock className="h-4 w-4 ml-2" />
                <span>{event.hora}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span className="truncate" title={lugar}>
              {lugar}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="text-sm ">
            {typeof precioDesde === "number" ? (
              <span className="font-semibold text-slate-800">
                Desde ${precioDesde.toFixed(0)}
              </span>
            ) : (
              <span className="text-slate-600">Precio a confirmar</span>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(event);
              }}
              className="gap-1 text-slate-800 cursor-pointer"
            >
              <Edit className="h-3 w-3 " />
              Editar
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(event);
              }}
              className="gap-1 text-destructive hover:text-destructive cursor-pointer"
              disabled={isDeleting}
            >
              <Trash2 className="h-3 w-3" />
              {isDeleting ? "Eliminando" : "Eliminar"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
