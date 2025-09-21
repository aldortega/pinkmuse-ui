"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const EVENT_STATUS_OPTIONS = [
  { value: "programado", label: "Programado" },
  { value: "pospuesto", label: "Pospuesto" },
  { value: "cancelado", label: "Cancelado" },
];

const ENTRADA_STATUS_OPTIONS = [
  { value: "disponible", label: "Disponible" },
  { value: "agotada", label: "Agotada" },
  { value: "suspendida", label: "Suspendida" },
];

const createEntrada = (entrada = {}) => ({
  tipo: entrada?.tipo ?? "",
  precio:
    entrada?.precio !== undefined && entrada?.precio !== null
      ? String(entrada.precio)
      : "",
  cantidad:
    entrada?.cantidad !== undefined && entrada?.cantidad !== null
      ? String(entrada.cantidad)
      : "",
  estado: entrada?.estado ?? "disponible",
});

const buildInitialState = (data) => {
  const direccion = data?.direccion ?? {};

  return {
    nombreEvento: data?.nombreEvento ?? data?.title ?? "",
    nombreLugar: data?.nombreLugar ?? data?.location ?? "",
    fecha: data?.fecha ?? data?.date ?? "",
    hora: data?.hora ?? data?.time ?? "",
    estado: data?.estado ?? data?.status ?? "programado",
    imagenPrincipal: data?.imagenPrincipal ?? data?.image ?? "",
    direccion: {
      calle: direccion?.calle ?? "",
      numero:
        direccion?.numero !== undefined && direccion?.numero !== null
          ? String(direccion.numero)
          : "",
      ciudad: direccion?.ciudad ?? "",
    },
    entradas:
      Array.isArray(data?.entradas) && data.entradas.length > 0
        ? data.entradas.map((entrada) => createEntrada(entrada))
        : [createEntrada()],
    artistasExtras: Array.isArray(data?.artistasExtras)
      ? data.artistasExtras
      : [],
    artistasExtrasText: Array.isArray(data?.artistasExtras)
      ? data.artistasExtras.join("\n")
      : "",
  };
};

export function EventForm({
  initialData,
  onSubmit,
  isEditing = false,
  isSubmitting = false,
}) {
  const [formData, setFormData] = useState(() =>
    buildInitialState(initialData)
  );

  useEffect(() => {
    setFormData(buildInitialState(initialData));
  }, [initialData]);

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateDireccion = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      direccion: { ...prev.direccion, [field]: value },
    }));
  };

  const handleEntradaChange = (index, field, value) => {
    setFormData((prev) => {
      const nextEntradas = [...prev.entradas];
      nextEntradas[index] = { ...nextEntradas[index], [field]: value };
      return { ...prev, entradas: nextEntradas };
    });
  };

  const addEntrada = () => {
    setFormData((prev) => ({
      ...prev,
      entradas: [...prev.entradas, createEntrada()],
    }));
  };

  const removeEntrada = (index) => {
    setFormData((prev) => {
      if (prev.entradas.length === 1) {
        return prev;
      }
      const nextEntradas = prev.entradas.filter((_, i) => i !== index);
      return { ...prev, entradas: nextEntradas };
    });
  };

  const handleArtistasExtrasChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      artistasExtrasText: value,
      artistasExtras: value
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const direccionFields = {};
    if (formData.direccion.calle.trim()) {
      direccionFields.calle = formData.direccion.calle.trim();
    }
    if (formData.direccion.numero !== "") {
      const numeroParseado = Number.parseInt(formData.direccion.numero, 10);
      if (!Number.isNaN(numeroParseado)) {
        direccionFields.numero = numeroParseado;
      }
    }
    if (formData.direccion.ciudad.trim()) {
      direccionFields.ciudad = formData.direccion.ciudad.trim();
    }
    const direccion =
      Object.keys(direccionFields).length > 0 ? direccionFields : null;

    const entradas = formData.entradas.map((entrada) => ({
      tipo: entrada.tipo.trim(),
      precio: Number.parseFloat(entrada.precio) || 0,
      cantidad: Number.parseInt(entrada.cantidad, 10) || 0,
      estado: entrada.estado,
    }));

    const payload = {
      nombreEvento: formData.nombreEvento.trim(),
      nombreLugar: formData.nombreLugar.trim(),
      fecha: formData.fecha,
      hora: formData.hora,
      estado: formData.estado,
      imagenPrincipal: formData.imagenPrincipal.trim() || null,
      direccion,
      entradas,
      artistasExtras: formData.artistasExtras,
    };

    const submissionPayload = isEditing
      ? (() => {
          const { nombreEvento: _, ...rest } = payload;
          return rest;
        })()
      : payload;

    if (isEditing) {
      console.log("Payload PUT /eventos:", payload, "->", submissionPayload);
    }

    try {
      await onSubmit(submissionPayload);
    } catch (err) {
      console.error(
        "Error al enviar el formulario de evento:",
        err?.response?.data || err
      );
    }
  };

  const submitLabel = isSubmitting
    ? isEditing
      ? "Guardando..."
      : "Creando..."
    : isEditing
    ? "Actualizar evento"
    : "Crear evento";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="nombreEvento">Nombre del evento *</Label>
          <Input
            id="nombreEvento"
            value={formData.nombreEvento}
            onChange={(e) => updateField("nombreEvento", e.target.value)}
            placeholder="PinkMuse Fest"
            required
            disabled={isEditing}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nombreLugar">Nombre del lugar *</Label>
          <Input
            id="nombreLugar"
            value={formData.nombreLugar}
            onChange={(e) => updateField("nombreLugar", e.target.value)}
            placeholder="Teatro Coliseo"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fecha">Fecha *</Label>
          <Input
            id="fecha"
            type="date"
            value={formData.fecha}
            onChange={(e) => updateField("fecha", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="hora">Hora *</Label>
          <Input
            id="hora"
            type="time"
            value={formData.hora}
            onChange={(e) => updateField("hora", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="estado">Estado *</Label>
          <Select
            value={formData.estado}
            onValueChange={(value) => updateField("estado", value)}
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
          <Label htmlFor="imagenPrincipal">Imagen principal (URL)</Label>
          <Input
            id="imagenPrincipal"
            value={formData.imagenPrincipal}
            onChange={(e) => updateField("imagenPrincipal", e.target.value)}
            placeholder="https://..."
          />
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Direccion (opcional)</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="direccionCalle">Calle</Label>
            <Input
              id="direccionCalle"
              value={formData.direccion.calle}
              onChange={(e) => updateDireccion("calle", e.target.value)}
              placeholder="Av. Principal"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="direccionNumero">Numero</Label>
            <Input
              id="direccionNumero"
              type="number"
              min="0"
              value={formData.direccion.numero}
              onChange={(e) => updateDireccion("numero", e.target.value)}
              placeholder="123"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="direccionCiudad">Ciudad</Label>
            <Input
              id="direccionCiudad"
              value={formData.direccion.ciudad}
              onChange={(e) => updateDireccion("ciudad", e.target.value)}
              placeholder="Buenos Aires"
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Entradas *</h3>
          <Button
            type="button"
            className="cursor-pointer"
            variant="outline"
            onClick={addEntrada}
            disabled={isSubmitting}
          >
            Agregar tipo de entrada
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Define los tipos de entrada disponibles para este evento.
        </p>
        <div className="space-y-4">
          {formData.entradas.map((entrada, index) => (
            <div
              key={`entrada-${index}`}
              className="space-y-4 rounded-lg border p-4"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor={`entrada-tipo-${index}`}>Tipo *</Label>
                  <Input
                    id={`entrada-tipo-${index}`}
                    value={entrada.tipo}
                    onChange={(e) =>
                      handleEntradaChange(index, "tipo", e.target.value)
                    }
                    placeholder="General, VIP, etc."
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`entrada-estado-${index}`}>Estado *</Label>
                  <Select
                    value={entrada.estado}
                    onValueChange={(value) =>
                      handleEntradaChange(index, "estado", value)
                    }
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
                  <Label htmlFor={`entrada-precio-${index}`}>
                    Precio (ARS) *
                  </Label>
                  <Input
                    id={`entrada-precio-${index}`}
                    type="number"
                    min="0"
                    step="0.01"
                    value={entrada.precio}
                    onChange={(e) =>
                      handleEntradaChange(index, "precio", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`entrada-cantidad-${index}`}>
                    Cantidad disponible *
                  </Label>
                  <Input
                    id={`entrada-cantidad-${index}`}
                    type="number"
                    min="0"
                    value={entrada.cantidad}
                    onChange={(e) =>
                      handleEntradaChange(index, "cantidad", e.target.value)
                    }
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  className="cursor-pointer"
                  onClick={() => removeEntrada(index)}
                  disabled={formData.entradas.length === 1 || isSubmitting}
                >
                  Eliminar tipo
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-2">
        <Label htmlFor="artistasExtras">
          Artistas invitados (uno por linea)
        </Label>
        <Textarea
          id="artistasExtras"
          value={formData.artistasExtrasText}
          onChange={(e) => handleArtistasExtrasChange(e.target.value)}
          placeholder={"Artista 1\nArtista 2"}
          rows={3}
        />
      </section>

      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          className="flex-1 cursor-pointer bg-gradient-to-br from-rose-500 via-red-400 to-red-500"
          disabled={isSubmitting}
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
