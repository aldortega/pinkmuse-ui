import { Minus, Plus, Ticket } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const parseCantidad = (value) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const parsePrecio = (value) => {
  const parsed = Number.parseFloat(value);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const formatPrecio = (value) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);

export default function TicketTypeList({
  tickets = [],
  quantities = [],
  onQuantityChange,
}) {
  if (!Array.isArray(tickets) || tickets.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-red-200 bg-red-50/60 p-8 text-center text-sm text-slate-600">
        Aún no se cargaron tipos de entradas para este evento. Cuando estén
        disponibles vas a poder seleccionarlas desde acá.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tickets.map((ticket, index) => {
        const cantidadDisponible = parseCantidad(ticket?.cantidad);
        const precio = parsePrecio(ticket?.precio);
        const estado = ticket?.estado ?? "disponible";
        const maximo = Math.max(cantidadDisponible, 0);
        const selected = quantities[index] ?? 0;
        const disabled =
          estado !== "disponible" || cantidadDisponible <= 0 || maximo === 0;

        const handleDecrease = () => {
          const next = Math.max(selected - 1, 0);
          onQuantityChange?.(index, next);
        };

        const handleIncrease = () => {
          const next = Math.min(selected + 1, maximo);
          onQuantityChange?.(index, next);
        };

        return (
          <div
            key={`${ticket?.tipo ?? "ticket"}-${index}`}
            className="flex flex-col gap-4 rounded-2xl border border-red-100 bg-white/80 p-6 shadow-sm backdrop-blur transition hover:border-red-200 md:flex-row md:items-center md:justify-between"
          >
            <div className="flex flex-1 flex-col gap-2">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-lg font-semibold text-slate-800">
                  {ticket?.tipo || "Entrada"}
                </h3>
                <Badge
                  className={
                    disabled
                      ? "bg-red-100 text-red-600 hover:bg-red-100"
                      : "bg-green-100 text-green-700 hover:bg-green-100"
                  }
                >
                  {disabled ? "No disponible" : "Disponible"}
                </Badge>
              </div>
              <p className="flex items-center gap-2 text-sm text-slate-600">
                <Ticket className="h-4 w-4 text-red-400" />
                {cantidadDisponible > 0
                  ? `${cantidadDisponible} lugares`
                  : "Sin stock"}
              </p>
            </div>

            <div className="flex flex-col items-end gap-3">
              <p className="text-xl font-semibold text-slate-900">
                {formatPrecio(precio)}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleDecrease}
                  disabled={disabled || selected <= 0}
                  className="h-10 w-10 cursor-pointer"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <div className="flex h-10 w-14 items-center justify-center rounded-full border border-red-200 bg-white text-base font-semibold text-slate-800">
                  {selected}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleIncrease}
                  disabled={disabled || selected >= maximo}
                  className="h-10 w-10 cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
