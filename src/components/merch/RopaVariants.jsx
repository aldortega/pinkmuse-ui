import { useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, X } from "lucide-react";

export default function RopaVariants({
  variants,
  setVariants,
  formState,
  fieldErrors,
}) {
  const handleAddVariant = useCallback(() => {
    setVariants((prev) => [
      ...prev,
      { color: "", talle: "", cantidad: 0, imagenes: [] },
    ]);
  }, [setVariants]);

  const handleRemoveVariant = useCallback(
    (index) => {
      setVariants((prev) => {
        if (prev.length === 1) {
          return prev;
        }
        return prev.filter((_, idx) => idx !== index);
      });
    },
    [setVariants]
  );

  const updateVariantField = useCallback(
    (index, field, value) => {
      setVariants((prev) =>
        prev.map((variant, idx) => {
          if (idx !== index) {
            return variant;
          }
          const next = {
            ...variant,
            [field]: value,
          };
          return next;
        })
      );
    },
    [setVariants]
  );

  const handleVariantCantidadChange = useCallback(
    (index, value) => {
      const cantidad = Number(value);
      updateVariantField(
        index,
        "cantidad",
        Number.isFinite(cantidad) ? cantidad : 0
      );
    },
    [updateVariantField]
  );

  const handleVariantImagesChange = useCallback(
    (index, event) => {
      const files = Array.from(event.target.files ?? []);
      setVariants((prev) =>
        prev.map((variant, idx) =>
          idx === index
            ? {
                ...variant,
                imagenes: files,
              }
            : variant
        )
      );
    },
    [setVariants]
  );

  const handleRemoveImage = useCallback(
    (variantIndex, imageIndex) => {
      setVariants((prev) =>
        prev.map((variant, vIdx) => {
          if (vIdx !== variantIndex) {
            return variant;
          }
          return {
            ...variant,
            imagenes: variant.imagenes.filter((_, iIdx) => iIdx !== imageIndex),
          };
        })
      );
    },
    [setVariants]
  );

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">
            Variantes y stock
          </h2>
          <p className="text-sm text-slate-500">
            Define el SKU, cantidad y atributos disponibles para cada
            combinacion.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={handleAddVariant}
          className="gap-2 border-slate-200 text-slate-700 hover:border-red-300 hover:text-red-600"
        >
          <Plus className="h-4 w-4" />
          Agregar variante
        </Button>
      </div>

      <div className="mt-6 space-y-6">
        {variants.map((variant, index) => {
          const variantError = fieldErrors?.variants?.[index] ?? {};
          const existingImages = variant.imagenes.filter(
            (img) => typeof img !== "object" && img !== null
          );
          const newImages = variant.imagenes.filter(
            (img) => typeof img === "object" && img !== null
          );

          return (
            <div
              key={index}
              className="space-y-4 rounded-xl border border-slate-200 bg-slate-50/60 p-4 shadow-inner"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="grid flex-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={`variant-color-${index}`}>Color</Label>
                    <Input
                      id={`variant-color-${index}`}
                      value={variant.color}
                      onChange={(event) =>
                        updateVariantField(index, "color", event.target.value)
                      }
                      placeholder="Ej. Negro"
                      aria-invalid={Boolean(variantError.color)}
                    />
                    {variantError.color ? (
                      <p className="text-xs text-red-500">
                        {variantError.color}
                      </p>
                    ) : null}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`variant-talle-${index}`}>Talle</Label>
                    <Input
                      id={`variant-talle-${index}`}
                      value={variant.talle}
                      onChange={(event) =>
                        updateVariantField(index, "talle", event.target.value)
                      }
                      placeholder="Ej. M"
                      aria-invalid={Boolean(variantError.talle)}
                    />
                    {variantError.talle ? (
                      <p className="text-xs text-red-500">
                        {variantError.talle}
                      </p>
                    ) : null}
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  className="self-end text-slate-500 hover:text-red-600"
                  onClick={() => handleRemoveVariant(index)}
                  disabled={variants.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="ml-1 text-xs">Eliminar</span>
                </Button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor={`variant-stock-${index}`}>Cantidad</Label>
                  <Input
                    id={`variant-stock-${index}`}
                    type="number"
                    min="0"
                    value={variant.cantidad}
                    onChange={(event) =>
                      handleVariantCantidadChange(index, event.target.value)
                    }
                    aria-invalid={Boolean(variantError.cantidad)}
                  />
                  {variantError.cantidad ? (
                    <p className="text-xs text-red-500">
                      {variantError.cantidad}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Imagenes de la variante</Label>
                {existingImages.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {existingImages.map((image, imgIndex) => (
                      <div key={imgIndex} className="relative">
                        <img
                          src={image.png || image.webp || image}
                          alt={`Variante ${index} - Imagen ${imgIndex}`}
                          className="h-24 w-full rounded-md object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute right-1 top-1 h-6 w-6"
                          onClick={() => handleRemoveImage(index, imgIndex)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                <Input
                  id={`variant-images-${index}`}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(event) => handleVariantImagesChange(index, event)}
                />
                {newImages.length > 0 ? (
                  <p className="text-xs text-slate-500">
                    Archivos seleccionados:{" "}
                    {newImages.map((file) => file.name).join(", ")}
                  </p>
                ) : (
                  <p className="text-xs text-slate-500">
                    Puedes subir multiples imagenes para la galeria de esta
                    variante.
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
