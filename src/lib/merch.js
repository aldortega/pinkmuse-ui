import { buildImageUrl } from "@/lib/imageService";

export const MERCH_CATEGORIES = [
  { id: "ropa", label: "Ropa" },
  { id: "accesorios", label: "Accesorios" },
  { id: "musica", label: "Música" },
];

const removeDiacritics = (value) =>
  String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const cleanNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const formatCurrency = (value) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);

export const normalizeText = (value) =>
  String(value || "")
    .trim()
    .toLowerCase();

export const slugifyProductName = (value) => {
  if (!value) {
    return "";
  }
  const normalized = removeDiacritics(value)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return normalized || "";
};

export const formatCategoryLabel = (value) => {
  const stringValue = String(value ?? "").trim();
  if (!stringValue) {
    return "Otros";
  }
  const lower = stringValue.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
};

const normalizeProductAttributes = (atributos) => {
  if (!Array.isArray(atributos)) {
    return [];
  }
  return atributos
    .map((atributo) => ({
      nombre: atributo?.nombre ?? "",
      valor: atributo?.valor ?? "",
      colores: Array.isArray(atributo?.colores) ? atributo.colores : [],
    }))
    .filter((atributo) => atributo.nombre || atributo.valor);
};

const normalizeVariantImages = (imagenes) => {
  if (!Array.isArray(imagenes)) {
    return [];
  }
  return imagenes
    .map((imagen) => buildImageUrl(imagen))
    .filter((imagen) => typeof imagen === "string" && imagen.length > 0);
};

export const normalizeMerchProduct = (rawProduct) => {
  if (!rawProduct || typeof rawProduct !== "object") {
    return null;
  }

  const nombreBruto = String(rawProduct?.nombre ?? "").trim();
  const nombre = nombreBruto || String(rawProduct?.titulo ?? "").trim();
  const slugDesdeDato =
    typeof rawProduct?.slug === "string" && rawProduct.slug.trim()
      ? rawProduct.slug.trim()
      : "";
  const slug = slugDesdeDato || slugifyProductName(nombre);
  const categoriaBruta = rawProduct?.categoria ?? "otros";
  const etiquetas = Array.isArray(rawProduct?.etiquetas)
    ? rawProduct.etiquetas
        .map((item) => String(item ?? "").trim())
        .filter(Boolean)
    : [];

  const stockDetalles = Array.isArray(rawProduct?.stock?.detalles)
    ? rawProduct.stock.detalles.map((detalle, index) => {
        const cantidad = cleanNumber(detalle?.cantidad, 0);
        const atributos = normalizeProductAttributes(detalle?.atributos);
        const imagenes = normalizeVariantImages(detalle?.imagenes);

        return {
          id:
            detalle?.id ??
            (slug ? `${slug}-variante-${index + 1}` : `variante-${index + 1}`),
          cantidad,
          atributos,
          imagenes,
        };
      })
    : [];

  const stockTotal = cleanNumber(
    rawProduct?.stock?.total,
    stockDetalles.reduce((acc, detalle) => acc + cleanNumber(detalle?.cantidad, 0), 0)
  );

  const imagenPrincipal = buildImageUrl(rawProduct?.imagenPrincipal);
  const galleryImages = [
    imagenPrincipal,
    ...stockDetalles.flatMap((detalle) => detalle.imagenes ?? []),
  ].filter(Boolean);

  const primaryId = rawProduct?._id ?? rawProduct?.id;
  const fallbackId = slug || nombre;

  return {
    ...rawProduct,
    id: primaryId ?? fallbackId,
    _id: primaryId ?? fallbackId,
    nombre: nombre || slug || rawProduct?.id || "Producto",
    nombreOriginal: nombreBruto || nombre,
    slug,
    categoria: categoriaBruta,
    categoriaLabel: formatCategoryLabel(categoriaBruta),
    etiquetas,
    precio: cleanNumber(rawProduct?.precio, rawProduct?.precio),
    estado: String(rawProduct?.estado ?? "").toLowerCase(),
    habilitarAcciones: rawProduct?.habilitarAcciones ?? "no",
    habilitarComentarios: Boolean(rawProduct?.habilitarComentarios),
    imagenPrincipal,
    imagenPrincipalRaw: rawProduct?.imagenPrincipal,
    galleryImages,
    stock: {
      total: stockTotal,
      detalles: stockDetalles,
    },
  };
};

export const buildMerchCategories = () => {
  const categories = MERCH_CATEGORIES.map(category => ({
    ...category,
    descripcion: `Ver productos de ${category.label.toLowerCase()}`,
  }));

  return [
    {
      id: "todos",
      label: "Todos",
      descripcion: "Ver todo el catalogo",
    },
    ...categories,
  ];
};

export const getAttributeValues = (product, attributeName) => {
  if (!product?.stock?.detalles) {
    return [];
  }

  const normalizedName = normalizeText(attributeName);

  const valores = product.stock.detalles.flatMap((detalle) => {
    const atributos = Array.isArray(detalle?.atributos) ? detalle.atributos : [];
    return atributos
      .filter((atributo) => normalizeText(atributo?.nombre) === normalizedName)
      .map((atributo) => ({
        valor: atributo?.valor ?? "",
        colores: Array.isArray(atributo?.colores) ? atributo.colores : [],
      }));
  });

  const vistos = new Set();
  return valores.filter((item) => {
    const key = item.valor;
    if (!key || vistos.has(key)) {
      return false;
    }
    vistos.add(key);
    return true;
  });
};

export const getAvailableVariants = (product) => {
  if (!product?.stock?.detalles) {
    return [];
  }

  return product.stock.detalles.map((detalle) => ({
    id: detalle.id,
    cantidad: detalle.cantidad,
    atributos: Array.isArray(detalle?.atributos) ? detalle.atributos : [],
    imagenPrincipal:
      Array.isArray(detalle?.imagenes) && detalle.imagenes.length > 0
        ? detalle.imagenes[0]
        : product.imagenPrincipal,
    imagenes: Array.isArray(detalle?.imagenes) ? detalle.imagenes : [],
  }));
};

export const getGalleryImages = (product) => {
  if (!product) {
    return [];
  }

  const imagenesDetalle = Array.isArray(product?.stock?.detalles)
    ? product.stock.detalles.flatMap((detalle) =>
        Array.isArray(detalle?.imagenes) ? detalle.imagenes : []
      )
    : [];

  const todas = [product.imagenPrincipal, ...imagenesDetalle].filter(Boolean);
  const unicas = [];
  const vistos = new Set();
  for (const imagen of todas) {
    if (!vistos.has(imagen)) {
      vistos.add(imagen);
      unicas.push(imagen);
    }
  }
  return unicas;
};
