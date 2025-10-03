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
import { buildImageUrl } from "@/lib/imageService";

export default function GeneralInfoSection({
  data,
  onFieldChange,
  isEditing,
  onImageUpload,
  isUploadingImage,
  imageUploadError,
}) {
  const previewUrl = buildImageUrl(data.imagenPrincipal);

  const handleFileInput = (event) => {
    if (!onImageUpload) {
      return;
    }
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
    event.target.value = "";
  };

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
      <div className="space-y-2 md:col-span-2">
        <Label className="text-slate-800" htmlFor="imagenPrincipal">
          Imagen principal
        </Label>
        <Input
          id="imagenPrincipal"
          value={data.imagenPrincipal}
          onChange={(e) => onFieldChange("imagenPrincipal", e.target.value)}
          placeholder="Pega una URL o sube una imagen"
        />
        <div className="flex flex-wrap items-center gap-3">
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="max-w-xs"
          />
          {isUploadingImage && (
            <span className="text-sm text-slate-600">
              Subiendo imagen...
            </span>
          )}
        </div>
        {imageUploadError && (
          <p className="text-sm text-red-600">{imageUploadError}</p>
        )}
        {previewUrl && (
          <div className="rounded-md border border-slate-200 p-3">
            <p className="mb-2 text-xs font-medium uppercase text-slate-500">
              Vista previa
            </p>
            <img
              src={previewUrl}
              alt="Vista previa del evento"
              className="h-40 w-full rounded-md object-cover"
              loading="lazy"
            />
          </div>
        )}
        <p className="text-xs text-slate-500">
          Si subes una imagen, guardaremos la ruta devuelta por el servicio y la
          mostraremos en la tarjeta del evento.
        </p>
      </div>
    </section>
  );
}
