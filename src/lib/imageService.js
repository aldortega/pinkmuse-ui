import api from "@/lib/axios";

const IMAGE_UPLOAD_ENDPOINT =
  import.meta.env.VITE_IMAGE_UPLOAD_ENDPOINT || "/imagenes";

const STORAGE_BASE_URL = import.meta.env.VITE_STORAGE_BASE_URL;

function collectFiles(input) {
  if (!input) {
    return [];
  }
  if (Array.isArray(input)) {
    return input.filter(Boolean);
  }
  return [input].filter(Boolean);
}

function inferNombreBase(nombre, fileList) {
  if (nombre && nombre.trim()) {
    return nombre.trim();
  }
  const first = fileList[0];
  if (first && typeof first.name === "string") {
    return first.name.replace(/\.[^/.]+$/, "");
  }
  return "imagen";
}

function buildFormData({ files, tipo, nombre, multiple, principalIndex }) {
  const formData = new FormData();
  files.forEach((item) => {
    formData.append(multiple ? "imagenes[]" : "imagen", item);
  });
  formData.append("tipo", tipo);
  formData.append("nombre", nombre);
  if (multiple) {
    formData.append("multiple", "1");
  }
  if (principalIndex !== undefined && principalIndex !== null) {
    formData.append("principalIndex", String(principalIndex));
  }
  return formData;
}

export async function uploadImage({
  file,
  files,
  tipo,
  nombre,
  multiple = false,
  principalIndex,
} = {}) {
  const fileList = collectFiles(files ?? file);
  if (!fileList.length) {
    throw new Error("Debe proporcionar al menos una imagen para subir.");
  }
  if (!tipo) {
    throw new Error("Debe indicar el tipo de imagen a subir.");
  }
  const nombreBase = inferNombreBase(nombre, fileList);
  const formData = buildFormData({
    files: fileList,
    tipo,
    nombre: nombreBase,
    multiple,
    principalIndex,
  });

  const response = await api.post(IMAGE_UPLOAD_ENDPOINT, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response?.data?.data ?? null;
}

export async function uploadEventImage(file, nombre) {
  const result = await uploadImage({ file, tipo: "evento", nombre });
  if (!result || !Array.isArray(result) || result.length === 0) {
    return null;
  }
  return result[0];
}

function normalizePath(path) {
  if (!path) {
    return "";
  }
  const trimmed = path.trim();
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  if (trimmed.startsWith("/")) {
    return trimmed;
  }
  return `/${trimmed}`;
}

export function buildImageUrl(path) {
  if (!path) {
    return "";
  }
  if (/^https?:\/\//i.test(path)) {
    return path;
  }
  const base = STORAGE_BASE_URL ||
    (import.meta.env.VITE_API_BASE_URL
      ? import.meta.env.VITE_API_BASE_URL.replace(/\/?api\/?$/, "")
      : "");
  if (!base) {
    return normalizePath(path);
  }
  const baseClean = base.endsWith("/") ? base.slice(0, -1) : base;
  const normalized = normalizePath(path);
  if (normalized.startsWith("/storage/")) {
    return `${baseClean}${normalized}`;
  }
  return `${baseClean}/storage${normalized}`;
}
