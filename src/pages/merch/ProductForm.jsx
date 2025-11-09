import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Header from "@/components/home/Header";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useMerch } from "@/contexts/MerchContext";
import { slugifyProductName, MERCH_CATEGORIES } from "@/lib/merch";
import RopaVariants from "@/components/merch/RopaVariants";
import AccesoriosVariants from "@/components/merch/AccesoriosVariants";
import ProductInformation from "@/components/merch/ProductInformation";

const parsePrecio = (value) => {
  const normalized = String(value ?? "").replace(",", ".");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : NaN;
};

const getAttributeValue = (detalle, attribute) => {
  if (!Array.isArray(detalle?.atributos)) {
    return "";
  }
  const attr = detalle.atributos.find(
    (item) => slugifyProductName(item?.nombre) === slugifyProductName(attribute)
  );
  return attr?.valor ?? "";
};

const buildVariantId = (nombreProducto, color, talle) => {
  const productSlug = slugifyProductName(nombreProducto);
  const colorSlug = slugifyProductName(color);
  const talleSlug = slugifyProductName(talle);

  if (!productSlug || !colorSlug || !talleSlug) {
    return "";
  }

  return [productSlug, colorSlug, talleSlug].join("-").toUpperCase();
};

const buildInitialFormState = (product) => ({
  nombre: product?.nombre ?? "",
  resumen: product?.resumen ?? "",
  descripcion: product?.descripcion ?? "",
  categoria: product?.categoria ?? "",
  tipo: product?.tipo ?? "",
  estado: product?.estado === "inactivo" ? "inactivo" : "activo",
  precio: product?.precio ? String(product.precio) : "",
  etiquetas: Array.isArray(product?.etiquetas)
    ? product.etiquetas.join(", ")
    : "",
  habilitarComentarios: product?.habilitarComentarios ?? true,
  habilitarAcciones: product ? product.habilitarAcciones === "si" : true,
});

const buildInitialVariants = (product) => {
  const categoria = product?.categoria;

  if (categoria === "ropa") {
    if (!product?.stock?.detalles || product.stock.detalles.length === 0) {
      return [{ color: "", talle: "", cantidad: 0, imagenes: [] }];
    }
    return product.stock.detalles.map((detalle) => ({
      id: detalle.id,
      color: getAttributeValue(detalle, "color"),
      talle: getAttributeValue(detalle, "talle"),
      cantidad: Number(detalle?.cantidad ?? 0),
      imagenes: detalle.imagenes || [],
    }));
  }

  if (categoria === "accesorios") {
    if (!product?.stock?.detalles || product.stock.detalles.length === 0) {
      return [{ nombre: "", valor: "", cantidad: 0, imagenes: [] }];
    }
    return product.stock.detalles.map((detalle) => ({
      id: detalle.id,
      nombre: getAttributeValue(detalle, "nombre"),
      valor: getAttributeValue(detalle, "valor"),
      cantidad: Number(detalle?.cantidad ?? 0),
      imagenes: detalle.imagenes || [],
    }));
  }

  return [];
};

export default function ProductForm({ mode = "create", product = null }) {
  const navigate = useNavigate();
  const { saving, createProduct, updateProduct, deleteProduct, deletingIds } =
    useMerch();

  const isEditMode = mode === "edit";
  const productId = product?._id ?? product?.id ?? null;

  const [formState, setFormState] = useState(() =>
    buildInitialFormState(product)
  );
  const [variants, setVariants] = useState(() => buildInitialVariants(product));
  const [primaryImage, setPrimaryImage] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localDeleting, setLocalDeleting] = useState(false);
  const contextDeleting = productId ? deletingIds.includes(productId) : false;
  const isDeleting = localDeleting || contextDeleting;

  useEffect(() => {
    setFormState(buildInitialFormState(product));
    setVariants(buildInitialVariants(product));
    setPrimaryImage(null);
    setSubmitError(null);
    setFieldErrors({});
  }, [product]);

  const updateFormField = useCallback((field, value) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handlePrimaryImageChange = useCallback((event) => {
    const file = event.target.files?.[0] ?? null;
    setPrimaryImage(file);
  }, []);

  const resetErrors = () => {
    setSubmitError(null);
    setFieldErrors({});
  };

  const validateForm = () => {
    const errors = {};

    if (!formState.nombre.trim()) {
      errors.nombre = "El nombre es obligatorio.";
    }
    if (!formState.descripcion.trim()) {
      errors.descripcion = "La descripcion es obligatoria.";
    }

    const precioNumber = parsePrecio(formState.precio);
    if (!formState.precio || Number.isNaN(precioNumber) || precioNumber < 0) {
      errors.precio = "Ingresa un precio valido.";
    }

    if (!isEditMode && !primaryImage) {
      errors.imagenPrincipal = "Debes seleccionar una imagen principal.";
    }

    const variantErrors = [];
    if (formState.categoria === "ropa") {
      variants.forEach((variant, index) => {
        const variantError = {};
        const variantId = buildVariantId(
          formState.nombre,
          variant.color,
          variant.talle
        );
        if (!variant.color.trim()) {
          variantError.color = "Indica el color de la variante.";
        }
        if (!variant.talle.trim()) {
          variantError.talle = "Indica el talle de la variante.";
        }
        if (!variantId) {
          variantError.id =
            "Completa color y talle para generar el identificador.";
        }
        if (!Number.isFinite(variant.cantidad) || variant.cantidad < 0) {
          variantError.cantidad = "La cantidad debe ser 0 o mayor.";
        }
        if (Object.keys(variantError).length > 0) {
          variantErrors[index] = variantError;
        }
      });
    } else if (formState.categoria === "accesorios") {
      variants.forEach((variant, index) => {
        const variantError = {};
        if (!variant.nombre.trim()) {
          variantError.nombre = "Indica el nombre del atributo.";
        }
        if (!variant.valor.trim()) {
          variantError.valor = "Indica el valor del atributo.";
        }
        if (!Number.isFinite(variant.cantidad) || variant.cantidad < 0) {
          variantError.cantidad = "La cantidad debe ser 0 o mayor.";
        }
        if (Object.keys(variantError).length > 0) {
          variantErrors[index] = variantError;
        }
      });
    }

    if (variantErrors.length > 0) {
      errors.variants = variantErrors;
    }

    return errors;
  };

  const buildPayload = () => {
    const precioNumber = parsePrecio(formState.precio);
    const etiquetas = formState.etiquetas
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    let detalles = [];
    if (formState.categoria === "ropa") {
      detalles = variants.map((variant) => {
        const generatedId = buildVariantId(
          formState.nombre,
          variant.color,
          variant.talle
        );
        return {
          id: variant.id || generatedId,
          cantidad: Number(variant.cantidad) || 0,
          atributos: [
            {
              nombre: "Color",
              valor: variant.color.trim(),
              colores: [],
            },
            {
              nombre: "Talle",
              valor: variant.talle.trim(),
              colores: [],
            },
          ],
          imagenes: variant.imagenes,
        };
      });
    } else if (formState.categoria === "accesorios") {
      detalles = variants.map((variant) => {
        return {
          id: variant.id,
          cantidad: Number(variant.cantidad) || 0,
          atributos: [
            {
              nombre: variant.nombre.trim(),
              valor: variant.valor.trim(),
              colores: [],
            },
          ],
          imagenes: variant.imagenes,
        };
      });
    }

    const stockTotal = detalles.reduce(
      (acc, detalle) => acc + (detalle.cantidad || 0),
      0
    );

    return {
      nombre: formState.nombre.trim(),
      resumen: formState.resumen.trim(),
      descripcion: formState.descripcion.trim(),
      categoria: formState.categoria.trim(),
      tipo: formState.tipo.trim(),
      estado: formState.estado,
      precio: precioNumber,
      etiquetas,
      habilitarAcciones: Boolean(formState.habilitarAcciones),
      habilitarComentarios: Boolean(formState.habilitarComentarios),
      imagenPrincipal: primaryImage,
      stock: {
        total: stockTotal,
        detalles,
      },
    };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    resetErrors();

    const validation = validateForm();
    if (Object.keys(validation).length > 0) {
      setFieldErrors(validation);
      setSubmitError("Revisa los campos marcados e intenta nuevamente.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = buildPayload();
      let result = null;
      if (isEditMode) {
        result = await updateProduct(productId, payload);
      } else {
        result = await createProduct(payload);
      }

      const slug =
        result?.slug ?? product?.slug ?? slugifyProductName(formState.nombre);
      if (slug) {
        navigate(`/merch/${slug}`);
      } else {
        navigate("/merch");
      }
    } catch (error) {
      const message =
        error?.details?.imagenPrincipal?.[0] ||
        error?.details?.nombre?.[0] ||
        error?.message ||
        "No pudimos guardar el producto.";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!isEditMode || !productId) {
      return;
    }
    const confirmed = window.confirm(
      "¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer."
    );
    if (!confirmed) {
      return;
    }

    setLocalDeleting(true);
    try {
      await deleteProduct(productId);
      navigate("/merch");
    } catch (error) {
      const message = error?.message || "No pudimos eliminar el producto.";
      setSubmitError(message);
    } finally {
      setLocalDeleting(false);
    }
  };

  const disableSubmit = isSubmitting || saving;
  const pageTitle = isEditMode ? "Editar producto" : "Crear nuevo producto";
  const helperSubtitle = isEditMode
    ? "Actualiza la informacion, stock y variantes del articulo."
    : "Completa la informacion principal, stock y variantes para publicar el articulo.";
  const submitLabel = disableSubmit
    ? isEditMode
      ? "Guardando..."
      : "Creando..."
    : isEditMode
    ? "Guardar cambios"
    : "Crear producto";

  const cancelHref =
    isEditMode && product?.slug ? `/merch/${product.slug}` : "/merch";

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <header className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-wide text-red-500">
            Catalogo
          </p>
          <h1 className="text-3xl font-black text-slate-900">{pageTitle}</h1>
          <p className="text-sm text-slate-600">{helperSubtitle}</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          {submitError ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              {submitError}
            </div>
          ) : null}

          <ProductInformation
            formState={formState}
            updateFormField={updateFormField}
            fieldErrors={fieldErrors}
            isEditMode={isEditMode}
            primaryImage={primaryImage}
            handlePrimaryImageChange={handlePrimaryImageChange}
          />

          {formState.categoria === "ropa" && (
            <RopaVariants
              variants={variants}
              setVariants={setVariants}
              formState={formState}
              fieldErrors={fieldErrors}
            />
          )}
          {formState.categoria === "accesorios" && (
            <AccesoriosVariants
              variants={variants}
              setVariants={setVariants}
              fieldErrors={fieldErrors}
            />
          )}

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800">
              Configuracion
            </h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-5 py-4">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-slate-800">
                    Permitir comentarios
                  </p>
                  <p className="text-xs text-slate-500">
                    Habilita que la comunidad deje resenas y consultas.
                  </p>
                </div>
                <Switch
                  checked={formState.habilitarComentarios}
                  onCheckedChange={(value) =>
                    updateFormField("habilitarComentarios", value)
                  }
                  className="data-[state=checked]:bg-red-400"
                />
              </div>
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-5 py-4">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-slate-800">
                    Permitir acciones
                  </p>
                  <p className="text-xs text-slate-500">
                    Activa favoritos u otras interacciones del catalogo.
                  </p>
                </div>
                <Switch
                  checked={formState.habilitarAcciones}
                  onCheckedChange={(value) =>
                    updateFormField("habilitarAcciones", value)
                  }
                  className="data-[state=checked]:bg-red-400"
                />
              </div>
            </div>
          </section>

          <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs text-slate-500">
              Los cambios se reflejaran inmediatamente en el catalogo una vez{" "}
              {isEditMode ? "guardado" : "creado"} el producto.
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
              <Button
                asChild
                variant="outline"
                className="border-slate-200 text-slate-700"
              >
                <Link to={cancelHref}>Cancelar</Link>
              </Button>
              {isEditMode ? (
                <Button
                  type="button"
                  variant="destructive"
                  className="bg-red-100 text-red-600 hover:bg-red-200"
                  onClick={handleDelete}
                  disabled={isDeleting || saving}
                >
                  {isDeleting ? "Eliminando..." : "Eliminar producto"}
                </Button>
              ) : null}
              <Button
                type="submit"
                disabled={disableSubmit}
                className="bg-gradient-to-r from-rose-500 via-red-400 to-red-500 text-white hover:brightness-105"
              >
                {submitLabel}
              </Button>
            </div>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}
