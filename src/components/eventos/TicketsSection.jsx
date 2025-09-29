import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ENTRADA_STATUS_OPTIONS } from "./eventForm.utils";

export default function TicketsSection({
  entradas,
  onAdd,
  onRemove,
  onChange,
  isSubmitting,
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-800">Entradas</h3>
        <Button
          type="button"
          className="cursor-pointer text-slate-800"
          variant="outline"
          onClick={onAdd}
          disabled={isSubmitting}
        >
          Agregar tipo de entrada
        </Button>
      </div>
      <p className="text-sm text-slate-600">
        Define los tipos de entrada disponibles para este evento.
      </p>
      <div className="space-y-4">
        {entradas.map((entrada, index) => (
          <div
            key={`entrada-${index}`}
            className="space-y-4 rounded-lg border p-4"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label
                  className="text-slate-800"
                  htmlFor={`entrada-tipo-${index}`}
                >
                  Tipo *
                </Label>
                <Input
                  id={`entrada-tipo-${index}`}
                  value={entrada.tipo}
                  onChange={(e) => onChange(index, "tipo", e.target.value)}
                  placeholder="General, VIP, etc."
                  required
                />
              </div>
              <div className="space-y-2">
                <Label
                  className="text-slate-800"
                  htmlFor={`entrada-estado-${index}`}
                >
                  Estado *
                </Label>
                <Select
                  value={entrada.estado}
                  onValueChange={(value) => onChange(index, "estado", value)}
                >
                  <SelectTrigger id={`entrada-estado-${index}`}>
                    <SelectValue placeholder="Selecciona el estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {ENTRADA_STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label
                  className="text-slate-800"
                  htmlFor={`entrada-precio-${index}`}
                >
                  Precio (ARS) *
                </Label>
                <Input
                  id={`entrada-precio-${index}`}
                  type="number"
                  min="0"
                  step="0.01"
                  value={entrada.precio}
                  onChange={(e) => onChange(index, "precio", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label
                  className="text-slate-800"
                  htmlFor={`entrada-cantidad-${index}`}
                >
                  Cantidad disponible *
                </Label>
                <Input
                  id={`entrada-cantidad-${index}`}
                  type="number"
                  min="0"
                  value={entrada.cantidad}
                  onChange={(e) => onChange(index, "cantidad", e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                className="cursor-pointer text-slate-800"
                onClick={() => onRemove(index)}
                disabled={entradas.length === 1 || isSubmitting}
              >
                Eliminar tipo
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
