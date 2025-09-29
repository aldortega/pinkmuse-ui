import { EVENT_STATUS_OPTIONS } from "./eventForm.utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function GeneralInfoSection({ data, onFieldChange, isEditing }) {
  return (
    <section className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <Label className="text-slate-800" htmlFor="nombreEvento">
          Nombre del evento
        </Label>
        <Input
          id="nombreEvento"
          value={data.nombreEvento}
          onChange={(e) => onFieldChange("nombreEvento", e.target.value)}
          placeholder="PinkMuse Fest"
          required
          disabled={isEditing}
        />
      </div>
      <div className="space-y-2">
        <Label className="text-slate-800" htmlFor="nombreLugar">
          Nombre del lugar
        </Label>
        <Input
          id="nombreLugar"
          value={data.nombreLugar}
          onChange={(e) => onFieldChange("nombreLugar", e.target.value)}
          placeholder="Teatro Coliseo"
          required
        />
      </div>
      <div className="space-y-2">
        <Label className="text-slate-800" htmlFor="fecha">
          Fecha *
        </Label>
        <Input
          id="fecha"
          type="date"
          value={data.fecha}
          onChange={(e) => onFieldChange("fecha", e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label className="text-slate-800" htmlFor="hora">
          Hora *
        </Label>
        <Input
          id="hora"
          type="time"
          value={data.hora}
          onChange={(e) => onFieldChange("hora", e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label className="text-slate-800" htmlFor="estado">
          Estado *
        </Label>
        <Select
          value={data.estado}
          onValueChange={(value) => onFieldChange("estado", value)}
        >
          <SelectTrigger id="estado">
            <SelectValue placeholder="Selecciona el estado" />
          </SelectTrigger>
          <SelectContent>
            {EVENT_STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label className="text-slate-800" htmlFor="imagenPrincipal">
          Imagen principal (URL)
        </Label>
        <Input
          id="imagenPrincipal"
          value={data.imagenPrincipal}
          onChange={(e) => onFieldChange("imagenPrincipal", e.target.value)}
          placeholder="https://..."
        />
      </div>
    </section>
  );
}
