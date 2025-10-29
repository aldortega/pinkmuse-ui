import { useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const FILTER_OPTIONS = [
  { value: "todos", label: "Todos los eventos" },
  { value: "semana", label: "Esta semana" },
  { value: "mes", label: "Este mes" },
];

const formatDateRangeLabel = (value) => {
  const option = FILTER_OPTIONS.find((item) => item.value === value);
  return option?.label ?? FILTER_OPTIONS[0].label;
};

export default function TicketFilters({
  search,
  onSearchChange,
  filterRange,
  onFilterRangeChange,
  onlyAvailable,
  onOnlyAvailableChange,
}) {
  const rangeLabel = useMemo(
    () => formatDateRangeLabel(filterRange),
    [filterRange]
  );

  return (
    <section className="rounded-2xl border border-red-100 bg-white/70 p-5 shadow-sm backdrop-blur">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-semibold uppercase tracking-wide text-red-400">
            encontrá tu show
          </p>
          <h2 className="text-xl font-bold text-slate-800">
            Filtrar eventos disponibles
          </h2>
          <p className="text-sm text-slate-600">
            Podés buscar por nombre del evento o quedarte con los shows más
            cercanos en la agenda.
          </p>
        </div>

        <div className="flex w-full flex-col gap-4 md:w-auto md:flex-row md:items-center">
          <div className="flex w-full flex-col gap-2">
            <Label htmlFor="tickets-search" className="text-xs uppercase text-slate-500">
              Buscar evento
            </Label>
            <Input
              id="tickets-search"
              placeholder="Nombre del evento, ciudad, invitado..."
              value={search}
              onChange={(event) => onSearchChange?.(event.target.value)}
              className="bg-white/90"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-xs uppercase text-slate-500">Rango</Label>
            <div className="flex gap-2">
              {FILTER_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onFilterRangeChange?.(option.value)}
                  className={[
                    "rounded-full border px-3 py-1 text-xs font-semibold transition",
                    option.value === filterRange
                      ? "border-red-400 bg-red-400 text-white shadow"
                      : "border-red-200 bg-white text-slate-700 hover:bg-red-50",
                  ].join(" ")}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-start gap-2">
            <Label className="text-xs uppercase text-slate-500">
              Solo disponibles
            </Label>
            <div className="flex items-center gap-2 rounded-full border border-red-200 bg-white/90 px-3 py-2">
              <Switch
                id="tickets-only-available"
                checked={onlyAvailable}
                onCheckedChange={onOnlyAvailableChange}
              />
              <Label
                htmlFor="tickets-only-available"
                className="text-sm font-medium text-slate-700"
              >
                Mostrar solo con stock
              </Label>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-4 text-xs text-slate-500">
        Actualmente mostrando: <span className="font-semibold">{rangeLabel}</span>
      </p>
    </section>
  );
}
