import { useCallback, useEffect, useMemo, useState } from "react";

import {
  buildImageUrl,
  resolveImagePath,
} from "@/lib/imageService";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const DEFAULT_STATE = {
  titulo: "",
  descripcion: "",
  resumen: "",
  fecha: "",
  imagenPrincipal: "",
  autor: "",
  categoria: "",
  fuente: "",
  etiquetas: "",
  habilitacionComentarios: true,
  habilitacionAcciones: true,
};

const createEmptyState = () => ({
  ...DEFAULT_STATE,
});

const formatDateForInput = (value) => {
  if (!value) {
    return "";
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    if (typeof value === "string" && value.length >= 10) {
      return value.slice(0, 10);
    }
    return "";
  }
  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const buildInitialState = (initialValues = null) => {
  const state = createEmptyState();

  if (!initialValues) {
    return state;
  }

  state.titulo = initialValues.titulo ?? "";
  state.descripcion = initialValues.descripcion ?? "";
  state.resumen = initialValues.resumen ?? "";
  state.fecha = formatDateForInput(initialValues.fecha);
  state.imagenPrincipal = resolveImagePath(initialValues.imagenPrincipal);
  state.autor = initialValues.autor ?? "";
  state.categoria = initialValues.categoria ?? "";
  state.fuente = initialValues.fuente ?? "";
  const tags = Array.isArray(initialValues.etiquetas)
    ? initialValues.etiquetas
        .map((item) => (typeof item === "string" ? item.trim() : ""))
        .filter((item) => item.length > 0)
    : [];
  state.etiquetas = tags.length > 0 ? tags.join(", ") : "";
  if (initialValues.habilitacionComentarios !== undefined) {
    state.habilitacionComentarios = Boolean(
      initialValues.habilitacionComentarios
    );
  }
  if (initialValues.habilitacionAcciones !== undefined) {
    const value = initialValues.habilitacionAcciones;
    state.habilitacionAcciones = value === true || value === "si";
  }

  return state;
};



const sanitizeTags = (value) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);

const buildPayload = (
  state,
  primaryImage,
  { includeTipoActividad = true, isUpdate = false } = {}
) => {
  const payload = {
    titulo: state.titulo.trim(),
    descripcion: state.descripcion.trim(),
    fecha: state.fecha ? new Date(state.fecha).toISOString() : null,
    imagenPrincipal: primaryImage,
    habilitacionComentarios: Boolean(state.habilitacionComentarios),
    habilitacionAcciones: state.habilitacionAcciones ? "si" : "no",
  };

  if (includeTipoActividad) {
    payload.tipoActividad = "noticia";
  }

  if (state.resumen.trim()) {
    payload.resumen = state.resumen.trim();
  } else if (isUpdate) {
    payload.resumen = null;
  }
  if (state.autor.trim()) {
    payload.autor = state.autor.trim();
  } else if (isUpdate) {
    payload.autor = null;
  }
  if (state.categoria.trim()) {
    payload.categoria = state.categoria.trim();
  } else if (isUpdate) {
    payload.categoria = null;
  }
  if (state.fuente.trim()) {
    payload.fuente = state.fuente.trim();
  } else if (isUpdate) {
    payload.fuente = null;
  }
  const tags = sanitizeTags(state.etiquetas);
  if (tags.length > 0) {
    payload.etiquetas = tags;
  } else if (isUpdate) {
    payload.etiquetas = [];
  }

  return payload;
};

// const Divider// const Divider = () => (
//   <div
//     aria-hidden="true"
//     className="h-px w-full bg-gradient-to-r from-transparent via-slate-100 to-transparent"
//   />
// );

const panelClassName = "rounded-2xl border border-border bg-card p-6 shadow-sm";
const fieldInputClassName =
  "rounded-lg text-slate-800 placeholder:text-slate-600 ";

// const primaryButtonClassName = `${actionButtonClassName} bg-primary text-primary-foreground shadow-sm transition `;
// const secondaryButtonClassName = `${actionButtonClassName} border border-border bg-background text-foreground transition hover:bg-accent hover:text-accent-foreground`;

export default function NewsForm({
  onSubmit,
  mode = "create",
  initialValues = null,
  isSubmitting = false,
  apiError = null,
  onDelete,
  isDeleting = false,
  deleteLabel = "Eliminar noticia",
}) {
  const [state, setState] = useState(() => buildInitialState(initialValues));
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [primaryImage, setPrimaryImage] = useState(null);

  const handlePrimaryImageChange = useCallback((event) => {
    const file = event.target.files?.[0] ?? null;
    setPrimaryImage(file);
  }, []);


  useEffect(() => {
    if (!initialValues) {
      return;
    }
    setState(buildInitialState(initialValues));
    setErrors({});
    setSubmitError(null);
  }, [initialValues]);
  const clientValidate = useCallback((nextState) => {
    const validationErrors = {};
    if (!nextState.titulo.trim()) {
      validationErrors.titulo = "El titulo es obligatorio.";
    }
    if (!nextState.descripcion.trim()) {
      validationErrors.descripcion = "La descripcion es obligatoria.";
    }
    if (!nextState.fecha) {
      validationErrors.fecha = "Selecciona una fecha.";
    }
    if (mode === "create" && !primaryImage) {
        validationErrors.imagenPrincipal = "Debes seleccionar una imagen principal.";
    }
    return validationErrors;
  }, [primaryImage, mode]);
  const handleFieldChange = useCallback((field, value) => {
    setState((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }, []);


  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      setSubmitError(null);
      const validationErrors = clientValidate(state);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
      try {
        const payload = buildPayload(state, primaryImage, {
          includeTipoActividad: mode === "create",
          isUpdate: mode === "edit",
        });
        await onSubmit(payload);
        if (mode === "create") {
          setState(buildInitialState(initialValues));
        }
      } catch (err) {
        const message =
          err?.message ||
          (mode === "edit"
            ? "No pudimos actualizar la noticia."
            : "No pudimos crear la noticia.");
        setSubmitError(message);
        throw err;
      }
    },
    [clientValidate, onSubmit, state, mode, initialValues, primaryImage]
  );
  const handleDeleteClick = useCallback(() => {
    if (!onDelete || isSubmitting || isDeleting) {
      return;
    }
    onDelete();
  }, [onDelete, isSubmitting, isDeleting]);

  const feedbackMessage = useMemo(() => {
    if (submitError) {
      return submitError;
    }
    if (apiError) {
      return apiError;
    }
    return null;
  }, [apiError, submitError]);

  const principalPreview = useMemo(() => {
    if (primaryImage) {
        return URL.createObjectURL(primaryImage);
    }
    return buildImageUrl(state.imagenPrincipal);
  }, [primaryImage, state.imagenPrincipal]);

  const helperText =
    mode === "edit"
      ? "Los cambios se aplican inmediatamente a la noticia publicada."
      : "Revisa la informacion antes de publicar. Podras editar la noticia desde el panel cuando sea necesario.";

  const submitLabel =
    mode === "edit"
      ? isSubmitting
        ? "Guardando cambios..."
        : "Guardar cambios"
      : isSubmitting
      ? "Creando noticia..."
      : "Publicar noticia";

  const disableDelete = isSubmitting || isDeleting;

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <section className={panelClassName}>
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-800">
              Detalles principales
            </h2>
            <p className="text-sm text-slate-600">
              Define el titulo, fecha y atributos clave que se mostraran en la
              portada y en la tarjeta de noticia.
            </p>
            {feedbackMessage && (
              <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-destructive">
                {feedbackMessage}
              </div>
            )}
          </div>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="titulo" className="text-slate-800">
                Titulo
              </Label>
              <Input
                id="titulo"
                value={state.titulo}
                onChange={(event) =>
                  handleFieldChange("titulo", event.target.value)
                }
                placeholder="Ingresa el titulo principal"
                aria-invalid={errors.titulo ? "true" : "false"}
                disabled={isSubmitting}
                className={fieldInputClassName}
              />
              {errors.titulo && (
                <p className="text-xs font-medium text-destructive">
                  {errors.titulo}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="fecha" className="text-slate-800">
                Fecha de publicacion
              </Label>
              <Input
                id="fecha"
                type="date"
                value={state.fecha}
                onChange={(event) =>
                  handleFieldChange("fecha", event.target.value)
                }
                aria-invalid={errors.fecha ? "true" : "false"}
                disabled={isSubmitting}
                className={fieldInputClassName}
              />
              {errors.fecha && (
                <p className="text-xs font-medium text-destructive">
                  {errors.fecha}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="autor" className="text-slate-800">
                Autor
              </Label>
              <Input
                id="autor"
                value={state.autor}
                onChange={(event) =>
                  handleFieldChange("autor", event.target.value)
                }
                placeholder="Nombre de quien escribe"
                disabled={isSubmitting}
                className={fieldInputClassName}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="categoria" className="text-slate-800">
                Categoria
              </Label>
              <Input
                id="categoria"
                value={state.categoria}
                onChange={(event) =>
                  handleFieldChange("categoria", event.target.value)
                }
                placeholder="Ej. Comunidad, Lanzamientos"
                disabled={isSubmitting}
                className={fieldInputClassName}
              />
            </div>
          </div>
        </section>
        <section className={panelClassName}>
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-800">Contenido</h2>
            <p className="text-sm text-slate-600">
              Escribe el cuerpo completo de la noticia y un resumen breve para
              destacar la informacion clave.
            </p>
          </div>
          {/* <Divider /> */}
          <div className="mt-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="resumen" className="text-slate-800">
                Resumen
              </Label>
              <Textarea
                id="resumen"
                value={state.resumen}
                onChange={(event) =>
                  handleFieldChange("resumen", event.target.value)
                }
                placeholder="Introduce un resumen corto para la tarjeta y la vista previa"
                rows={3}
                disabled={isSubmitting}
                className={fieldInputClassName}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="descripcion" className="text-slate-800">
                Contenido principal
              </Label>
              <Textarea
                id="descripcion"
                value={state.descripcion}
                onChange={(event) =>
                  handleFieldChange("descripcion", event.target.value)
                }
                placeholder="Escribe el cuerpo de la noticia"
                rows={10}
                aria-invalid={errors.descripcion ? "true" : "false"}
                disabled={isSubmitting}
                className={fieldInputClassName}
              />
              {errors.descripcion && (
                <p className="text-xs font-medium text-destructive">
                  {errors.descripcion}
                </p>
              )}
            </div>
          </div>
        </section>
        <section className={panelClassName}>
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-800">Imagenes</h2>
            <p className="text-sm text-slate-600">
              Define la imagen principal y agrega recursos complementarios para
              enriquecer el articulo.
            </p>
          </div>
          {/* <Divider /> */}
          <div className="mt-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="imagenPrincipal">Imagen principal</Label>
                <Input
                  id="imagenPrincipal"
                  type="file"
                  accept="image/*"
                  onChange={handlePrimaryImageChange}
                  aria-invalid={Boolean(errors.imagenPrincipal)}
                />
                {primaryImage ? (
                  <p className="text-xs text-slate-500">Archivo seleccionado: {primaryImage.name}</p>
                ) : mode === "edit" ? (
                  <p className="text-xs text-slate-500">
                    Si no cargas una nueva imagen, se conservara la actual.
                  </p>
                ) : null}
                {errors.imagenPrincipal ? (
                  <p className="text-xs text-red-500">{errors.imagenPrincipal}</p>
                ) : null}
                {principalPreview ? (
                  <div className="rounded-md border border-border bg-card p-3">
                    <p className="mb-2 text-xs font-semibold uppercase text-slate-500">
                      Vista previa
                    </p>
                    <img
                      src={principalPreview}
                      alt="Vista previa de la noticia"
                      className="h-40 w-full rounded-md object-cover"
                      loading="lazy"
                    />
                  </div>
                ) : null}
              </div>

          </div>
        </section>
        <section className={panelClassName}>
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-800">
              Configuracion
            </h2>
          </div>
          {/* <Divider /> */}
          <div className="mt-6 space-y-6">
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="flex items-center justify-between rounded-xl border border-border bg-card px-5 py-4 shadow-sm">
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Permitir comentarios
                  </p>
                  <p className="text-xs text-slate-600">
                    Habilita que la comunidad pueda opinar en esta noticia.
                  </p>
                </div>
                <Switch
                  checked={state.habilitacionComentarios}
                  className="data-[state=checked]:bg-red-400 "
                  onCheckedChange={(value) =>
                    handleFieldChange("habilitacionComentarios", value)
                  }
                  disabled={isSubmitting}
                />
              </div>
              <div className="flex items-center justify-between rounded-xl border border-border bg-card px-5 py-4 shadow-sm">
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Permitir reacciones
                  </p>
                  <p className="text-xs text-slate-600">
                    Activa los likes y otras interacciones.
                  </p>
                </div>
                <Switch
                  className="data-[state=checked]:bg-red-400 "
                  checked={state.habilitacionAcciones}
                  onCheckedChange={(value) =>
                    handleFieldChange("habilitacionAcciones", value)
                  }
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>
        </section>
        <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-6 shadow-sm shadow-slate-100/60 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-600">{helperText}</p>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            {onDelete ? (
              <Button
                type="button"
                variant="outline"
                className="rounded-md cursor-pointer text-slate-800 hover:text-slate-800 "
                onClick={handleDeleteClick}
                disabled={disableDelete}
              >
                {isDeleting ? "Eliminando..." : deleteLabel}
              </Button>
            ) : null}
            <Button
              type="submit"
              variant="default"
              className="bg-gradient-to-br from-rose-500 via-red-400 to-red-500 cursor-pointer hover:opacity-90"
              disabled={isSubmitting}
            >
              {submitLabel}
            </Button>
          </div>
        </div>

        {submitError && (
          <p className="text-sm font-medium text-destructive">{submitError}</p>
        )}
      </form>
    </div>
  );
}
