import { useCallback, useEffect, useState } from "react";
import api from "@/lib/axios";
import { uploadEventImage } from "@/lib/imageService";
import GeneralInfoSection from "./GeneralInfoSection";
import AddressSection from "./AddressSection";
import TicketsSection from "./TicketsSection";
import ArtistsSection from "./ArtistsSection";
import FormActions from "./FormActions";

import {
  buildInitialState,
  createEntrada,
  buildSubmissionArtifacts,
} from "./eventForm.utils";

export function EventForm({
  initialData,
  onSubmit,
  isEditing = false,
  isSubmitting = false,
}) {
  const [formData, setFormData] = useState(() =>
    buildInitialState(initialData)
  );
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageUploadError, setImageUploadError] = useState(null);

  useEffect(() => {
    setFormData(buildInitialState(initialData));
  }, [initialData]);

  const updateField = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const updateDireccion = useCallback((field, value) => {
    setFormData((prev) => ({
      ...prev,
      direccion: { ...prev.direccion, [field]: value },
    }));
  }, []);

  const handleEntradaChange = useCallback((index, field, value) => {
    setFormData((prev) => {
      const nextEntradas = prev.entradas.map((entrada, idx) =>
        idx === index ? { ...entrada, [field]: value } : entrada
      );
      return { ...prev, entradas: nextEntradas };
    });
  }, []);

  const addEntrada = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      entradas: [...prev.entradas, createEntrada()],
    }));
  }, []);

  const removeEntrada = useCallback((index) => {
    setFormData((prev) => {
      if (prev.entradas.length === 1) {
        return prev;
      }
      const nextEntradas = prev.entradas.filter((_, idx) => idx !== index);
      return { ...prev, entradas: nextEntradas };
    });
  }, []);

  const handleArtistasExtrasChange = useCallback((value) => {
    setFormData((prev) => ({
      ...prev,
      artistasExtrasText: value,
      artistasExtras: value
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
    }));
  }, []);

  const handleImageUpload = useCallback(
    async (file) => {
      if (!file) {
        return;
      }
      setImageUploadError(null);
      setIsUploadingImage(true);
      try {
        const uploaded = await uploadEventImage(
          file,
          formData?.nombreEvento
        );
        if (uploaded) {
          updateField("imagenPrincipal", uploaded);
        }
      } catch (error) {
        console.error("Error al subir la imagen del evento:", error);
        const message =
          error?.response?.data?.message ||
          error?.message ||
          "No pudimos subir la imagen. Intenta nuevamente.";
        setImageUploadError(message);
      } finally {
        setIsUploadingImage(false);
      }
    },
    [formData?.nombreEvento, updateField]
  );

  const handleRemoveImage = useCallback(async () => {
    setImageUploadError(null);
    const current = formData?.imagenPrincipal;

    const payload = (() => {
      if (!current) {
        return null;
      }
      if (typeof current === "string") {
        const trimmed = current.trim();
        return trimmed ? { ruta: trimmed } : null;
      }
      if (Array.isArray(current)) {
        const rutas = current
          .map((item) =>
            typeof item === "string"
              ? item
              : item?.webp || item?.png || item?.path || null
          )
          .filter(Boolean);
        return rutas.length ? { rutas } : null;
      }
      if (typeof current === "object") {
        const rutas = [
          current.webp ?? null,
          current.png ?? null,
          current.path ?? null,
        ].filter(Boolean);
        return rutas.length ? { rutas } : null;
      }
      return null;
    })();

    try {
      if (payload) {
        await api.delete("/imagenes", { data: payload });
      }
    } catch (error) {
      console.error("Error al eliminar la imagen del evento:", error);
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "No pudimos eliminar la imagen. Intenta nuevamente.";
      setImageUploadError(message);
    } finally {
      updateField("imagenPrincipal", null);
    }
  }, [formData?.imagenPrincipal, updateField, setImageUploadError]);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      const { payload, submissionPayload } = buildSubmissionArtifacts(
        formData,
        isEditing
      );

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
    },
    [formData, isEditing, onSubmit]
  );

  const submitLabel = isSubmitting
    ? isEditing
      ? "Guardando..."
      : "Creando..."
    : isEditing
    ? "Actualizar evento"
    : "Crear evento";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <GeneralInfoSection
        data={formData}
        onFieldChange={updateField}
        isEditing={isEditing}
        onImageUpload={handleImageUpload}
        onRemoveImage={handleRemoveImage}
        isUploadingImage={isUploadingImage}
        imageUploadError={imageUploadError}
      />
      <AddressSection
        direccion={formData.direccion}
        onFieldChange={updateDireccion}
      />
      <TicketsSection
        entradas={formData.entradas}
        onAdd={addEntrada}
        onRemove={removeEntrada}
        onChange={handleEntradaChange}
        isSubmitting={isSubmitting}
      />
      <ArtistsSection
        value={formData.artistasExtrasText}
        onChange={handleArtistasExtrasChange}
      />
      <FormActions submitLabel={submitLabel} isSubmitting={isSubmitting} />
    </form>
  );
}
