import { Fragment, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";

const parsePrecio = (value) => {
  const parsed = Number.parseFloat(value);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const formatCurrency = (value) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);

export default function TicketSelectionSummary({
  tickets = [],
  quantities = [],
  onClear,
  onProceed,
  isProcessing = false,
}) {
  const { totalPrice, totalTickets, selectedItems } = useMemo(() => {
    let price = 0;
    let items = 0;

    const selected = [];

    tickets.forEach((ticket, index) => {
      const quantity = quantities[index] ?? 0;
      if (quantity <= 0) {
        return;
      }
      const priceUnit = parsePrecio(ticket?.precio);
      const subtotal = priceUnit * quantity;

      price += subtotal;
      items += quantity;

      selected.push({
        label: ticket?.tipo || `Entrada ${index + 1}`,
        quantity,
        subtotal,
      });
    });

    return {
      totalPrice: price,
      totalTickets: items,
      selectedItems: selected,
    };
  }, [tickets, quantities]);

  return (
    <aside className="space-y-4 rounded-2xl border border-red-100 bg-white/80 p-6 shadow-sm backdrop-blur">
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-wide text-red-400">
          Resumen de tu selección
        </p>
        <h2 className="text-xl font-bold text-slate-900">
          {totalTickets > 0 ? `${totalTickets} entradas` : "Sin entradas"}
        </h2>
        <p className="text-sm text-slate-600">
          No realizamos el cobro todavía. Confirmá las cantidades y luego
          avanzá con el pago en el siguiente paso.
        </p>
      </div>

      <Separator />

      {selectedItems.length > 0 ? (
        <div className="space-y-3">
          {selectedItems.map((item, index) => (
            <Fragment key={`${item.label}-${index}`}>
              <div className="flex items-center justify-between text-sm text-slate-700">
                <span>
                  {item.label}
                  <span className="ml-1 text-xs text-slate-500">
                    x{item.quantity}
                  </span>
                </span>
                <span className="font-semibold">
                  {formatCurrency(item.subtotal)}
                </span>
              </div>
            </Fragment>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-600">
          Elegí al menos un tipo de entrada para continuar.
        </p>
      )}

      <Separator />

      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600">Total estimado</p>
        <p className="text-lg font-semibold text-slate-900">
          {formatCurrency(totalPrice)}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <Button
          type="button"
          disabled={totalTickets === 0 || isProcessing}
          onClick={onProceed}
          className="cursor-pointer gap-2 bg-gradient-to-r from-rose-500 via-red-400 to-red-500 text-white hover:opacity-90 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Preparando pedido...
            </>
          ) : (
            "Continuar con la compra"
          )}
        </Button>

        <Button
          variant="outline"
          type="button"
          disabled={totalTickets === 0 || isProcessing}
          onClick={onClear}
          className="cursor-pointer border-red-200 text-slate-700 hover:bg-red-50 disabled:cursor-not-allowed"
        >
          Limpiar selección
        </Button>
      </div>
    </aside>
  );
}