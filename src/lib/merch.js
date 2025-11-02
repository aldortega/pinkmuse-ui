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
