import { useCallback, useEffect, useState } from "react";
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
