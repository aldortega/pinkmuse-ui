const resolveImageValue = (value) => {
  if (!value) {
    return "";
  }
  if (typeof value === "string") {
    return value;
  }
  if (Array.isArray(value) && value.length > 0) {
    return resolveImageValue(value[0]);
  }
  if (typeof value === "object") {
    return (
      value.webp ||
      value.png ||
      value.url ||
      value.path ||
      ""
    );
  }
  return "";
};

export const EVENT_STATUS_OPTIONS = [
  { value: "programado", label: "Programado" },
  { value: "pospuesto", label: "Pospuesto" },
  { value: "cancelado", label: "Cancelado" },
];

export const ENTRADA_STATUS_OPTIONS = [
  { value: "disponible", label: "Disponible" },
  { value: "agotada", label: "Agotada" },
  { value: "suspendida", label: "Suspendida" },
];

export const createEntrada = (entrada = {}) => ({
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

const joinArtistasExtras = (artistas = []) =>
  Array.isArray(artistas) && artistas.length > 0 ? artistas.join("\n") : "";

export const buildInitialState = (data) => {
  const direccion = data?.direccion ?? {};
  const artistasExtras = Array.isArray(data?.artistasExtras)
    ? data.artistasExtras
    : [];

  const imagenPrincipal = resolveImageValue(data?.imagenPrincipal ?? data?.image);

  return {
    nombreEvento: data?.nombreEvento ?? data?.title ?? "",
    nombreLugar: data?.nombreLugar ?? data?.location ?? "",
    fecha: data?.fecha ?? data?.date ?? "",
    hora: data?.hora ?? data?.time ?? "",
    estado: data?.estado ?? data?.status ?? "programado",
    imagenPrincipal,
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
        ? data.entradas.map((entradaItem) => createEntrada(entradaItem))
        : [createEntrada()],
    artistasExtras,
    artistasExtrasText: joinArtistasExtras(artistasExtras),
  };
};

const normalizeDireccion = (direccion) => {
  const direccionFields = {};

  if (direccion.calle.trim()) {
    direccionFields.calle = direccion.calle.trim();
  }

  if (direccion.numero !== "") {
    const numeroParseado = Number.parseInt(direccion.numero, 10);
    if (!Number.isNaN(numeroParseado)) {
      direccionFields.numero = numeroParseado;
    }
  }

  if (direccion.ciudad.trim()) {
    direccionFields.ciudad = direccion.ciudad.trim();
  }

  return Object.keys(direccionFields).length > 0 ? direccionFields : null;
};

const normalizeEntradas = (entradas) =>
  entradas.map((entrada) => ({
    tipo: entrada.tipo.trim(),
    precio: Number.parseFloat(entrada.precio) || 0,
    cantidad: Number.parseInt(entrada.cantidad, 10) || 0,
    estado: entrada.estado,
  }));

const normalizeImagenPrincipal = (imagen) => {
  const value = resolveImageValue(imagen);
  return value.trim() || null;
};

export const buildSubmissionArtifacts = (formData, isEditing) => {
  const payload = {
    nombreEvento: formData.nombreEvento.trim(),
    nombreLugar: formData.nombreLugar.trim(),
    fecha: formData.fecha,
    hora: formData.hora,
    estado: formData.estado,
    imagenPrincipal: normalizeImagenPrincipal(formData.imagenPrincipal),
    direccion: normalizeDireccion(formData.direccion),
    entradas: normalizeEntradas(formData.entradas),
    artistasExtras: formData.artistasExtras,
  };

  if (!isEditing) {
    return { payload, submissionPayload: payload };
  }

  const { nombreEvento: _nombreEvento, ...submissionPayload } = payload;

  return { payload, submissionPayload };
};
