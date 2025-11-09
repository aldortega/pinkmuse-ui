import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import api from "@/lib/axios";
import { buildMerchCategories, normalizeMerchProduct } from "@/lib/merch";

const MerchContext = createContext(null);

const decodeSlug = (value) => {
  if (!value) {
    return "";
  }
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

const buildProductFormData = (input, { includeNombre = true } = {}) => {
  const formData = new FormData();

  if (includeNombre) {
    formData.append("nombre", input.nombre.trim());
  }
  if (input.resumen?.trim()) {
    formData.append("resumen", input.resumen.trim());
  }
  formData.append("descripcion", input.descripcion.trim());
  formData.append("precio", String(input.precio));

  if (input.categoria?.trim()) {
    formData.append("categoria", input.categoria.trim());
  }

  if (input.tipo?.trim()) {
    formData.append("tipo", input.tipo.trim());
  }

  if (input.estado?.trim()) {
    formData.append("estado", input.estado.trim());
  }

  formData.append("habilitarAcciones", input.habilitarAcciones ? "si" : "no");
  formData.append("habilitarComentarios", input.habilitarComentarios ? "1" : "0");

  if (Array.isArray(input.etiquetas)) {
    input.etiquetas.forEach((etiqueta, index) => {
      const value = String(etiqueta ?? "").trim();
      if (value) {
        formData.append(`etiquetas[${index}]`, value);
      }
    });
  }

  if (input.imagenPrincipal instanceof File) {
    formData.append("imagenPrincipal", input.imagenPrincipal, input.imagenPrincipal.name);
  }

  const total = Number.isFinite(input.stock?.total)
    ? Number(input.stock.total)
    : 0;
  formData.append("stock[total]", String(total));

  const detalles = Array.isArray(input.stock?.detalles)
    ? input.stock.detalles
    : [];

  detalles.forEach((detalle, detalleIndex) => {
    formData.append(`stock[detalles][${detalleIndex}][id]`, detalle.id);
    formData.append(
      `stock[detalles][${detalleIndex}][cantidad]`,
      String(detalle.cantidad)
    );

    const atributos = Array.isArray(detalle.atributos)
      ? detalle.atributos
      : [];

    atributos.forEach((atributo, atributoIndex) => {
      formData.append(
        `stock[detalles][${detalleIndex}][atributos][${atributoIndex}][nombre]`,
        atributo.nombre
      );
      formData.append(
        `stock[detalles][${detalleIndex}][atributos][${atributoIndex}][valor]`,
        atributo.valor
      );

      const colores = Array.isArray(atributo.colores)
        ? atributo.colores.filter((color) => typeof color === "string" && color.trim())
        : [];

      colores.forEach((color, colorIndex) => {
        formData.append(
          `stock[detalles][${detalleIndex}][atributos][${atributoIndex}][colores][${colorIndex}]`,
          color
        );
      });
    });

    if (Array.isArray(detalle.imagenes)) {
      detalle.imagenes.forEach((imagen) => {
        if (imagen instanceof File) {
          formData.append(
            `stock[detalles][${detalleIndex}][imagenes][]`,
            imagen,
            imagen.name
          );
        }
      });
    }
  });

  return formData;
};

export function MerchProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingIds, setDeletingIds] = useState([]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/productos");
      const fetched = Array.isArray(response?.data?.data) ? response.data.data : [];

      const normalized = fetched
        .map((item) => normalizeMerchProduct(item))
        .filter((item) => item !== null);

      setProducts(normalized);
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "No pudimos cargar el catalogo de productos.";
      setError(message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const getProductBySlug = useCallback(
    (slug) => {
      if (!slug) {
        return null;
      }

      const decoded = decodeSlug(slug);
      return (
        products.find((product) => product.slug === slug) ||
        products.find((product) => product.slug === decoded)
      );
    },
    [products]
  );

  const createProduct = useCallback(
    async (input) => {
      if (!input || typeof input !== "object") {
        throw new Error("Datos del producto invalidos.");
      }

      setIsSaving(true);
      try {
        const formData = buildProductFormData(input);
        const response = await api.post("/productos", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const createdRaw = response?.data?.data;
        const normalized = normalizeMerchProduct(createdRaw);

        if (normalized) {
          setProducts((prev) => [normalized, ...prev]);
        }

        return normalized;
      } catch (err) {
        const apiMessage =
          err?.response?.data?.message ||
          err?.message ||
          "No pudimos crear el producto.";
        const errorDetails = err?.response?.data?.errors ?? null;
        const enhancedError = new Error(apiMessage);
        enhancedError.details = errorDetails;
        enhancedError.status = err?.response?.status;
        throw enhancedError;
      } finally {
        setIsSaving(false);
      }
    },
    []
  );

  const updateProduct = useCallback(
    async (productId, input) => {
      if (!productId) {
        throw new Error("Debe indicar el producto a actualizar.");
      }
      if (!input || typeof input !== "object") {
        throw new Error("Datos del producto invalidos.");
      }

      setIsSaving(true);
      try {
        const formData = buildProductFormData(input, { includeNombre: false });
        formData.append("_method", "PUT");

        const response = await api.post(`/productos/${productId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const updatedRaw = response?.data?.data;
        const normalized = normalizeMerchProduct(updatedRaw);

        if (normalized) {
          setProducts((prev) =>
            prev.map((product) => {
              if (
                product._id === productId ||
                product.id === productId ||
                product._id === updatedRaw?._id
              ) {
                return normalized;
              }
              return product;
            })
          );
        }

        return normalized;
      } catch (err) {
        const apiMessage =
          err?.response?.data?.message ||
          err?.message ||
          "No pudimos actualizar el producto.";
        const errorDetails = err?.response?.data?.errors ?? null;
        const enhancedError = new Error(apiMessage);
        enhancedError.details = errorDetails;
        enhancedError.status = err?.response?.status;
        throw enhancedError;
      } finally {
        setIsSaving(false);
      }
    },
    []
  );

  const deleteProduct = useCallback(
    async (productId) => {
      if (!productId) {
        throw new Error("Debe indicar el producto a eliminar.");
      }

      setDeletingIds((prev) => {
        if (prev.includes(productId)) {
          return prev;
        }
        return [...prev, productId];
      });

      try {
        await api.delete(`/productos/${productId}`);
        setProducts((prev) =>
          prev.filter(
            (product) =>
              product._id !== productId && product.id !== productId
          )
        );
      } catch (err) {
        const apiMessage =
          err?.response?.data?.message ||
          err?.message ||
          "No pudimos eliminar el producto.";
        const enhancedError = new Error(apiMessage);
        enhancedError.status = err?.response?.status;
        enhancedError.details = err?.response?.data?.errors ?? null;
        throw enhancedError;
      } finally {
        setDeletingIds((prev) => prev.filter((id) => id !== productId));
      }
    },
    []
  );

  const categories = useMemo(() => buildMerchCategories(), []);

  const value = useMemo(
    () => ({
      products,
      loading,
      error,
      categories,
      saving: isSaving,
      deletingIds,
      refetch: fetchProducts,
      getProductBySlug,
      createProduct,
      updateProduct,
      deleteProduct,
    }),
    [
      products,
      loading,
      error,
      categories,
      isSaving,
      deletingIds,
      fetchProducts,
      getProductBySlug,
      createProduct,
      updateProduct,
      deleteProduct,
    ]
  );

  return <MerchContext.Provider value={value}>{children}</MerchContext.Provider>;
}

export function useMerch() {
  const context = useContext(MerchContext);
  if (!context) {
    throw new Error("useMerch debe utilizarse dentro de un MerchProvider");
  }
  return context;
}
