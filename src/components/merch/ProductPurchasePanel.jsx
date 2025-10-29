import { useEffect, useMemo, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency, getAvailableVariants, normalizeText } from "@/lib/merch";

const MAX_QUANTITY = 10;

const ATTRIBUTE_RENDER_ORDER = ["color", "talle", "dimension", "formato", "color del vinilo"];

const sortAttributes = (attributeNames) => {
  return [...attributeNames].sort((a, b) => {
    const aIndex = ATTRIBUTE_RENDER_ORDER.indexOf(normalizeText(a));
    const bIndex = ATTRIBUTE_RENDER_ORDER.indexOf(normalizeText(b));
    if (aIndex === -1 && bIndex === -1) {
      return a.localeCompare(b);
    }
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });
};

const buildSelection = (variants, current = {}) => {
  const atributoMap = {};

  variants.forEach((variant) => {
    const atributos = Array.isArray(variant.atributos) ? variant.atributos : [];
    atributos.forEach((atributo) => {
      if (!atributo?.nombre) {
        return;
      }
      const key = atributo.nombre;
      const value = atributo.valor ?? "";
      if (!Array.isArray(atributoMap[key])) {
        atributoMap[key] = [];
      }
      if (!atributoMap[key].some((item) => item.valor === value)) {
        atributoMap[key].push({
          valor: value,
          colores: Array.isArray(atributo?.colores) ? atributo.colores : [],
        });
      }
    });
  });

  const sortedAttributeNames = sortAttributes(Object.keys(atributoMap));

  const selection = {};
  sortedAttributeNames.forEach((name) => {
    const opciones = atributoMap[name];
    const prefered = current[name];
    if (prefered && opciones.some((item) => item.valor === prefered)) {
      selection[name] = prefered;
      return;
    }
    selection[name] = opciones[0]?.valor ?? "";
  });

  return { selection, atributoMap, sortedAttributeNames };
};

const findVariantBySelection = (variants, selection) => {
  return (
    variants.find((variant) => {
      const atributos = Array.isArray(variant?.atributos) ? variant.atributos : [];
      return Object.entries(selection).every(([key, value]) =>
        atributos.some(
          (atributo) =>
            normalizeText(atributo?.nombre) === normalizeText(key) &&
            normalizeText(atributo?.valor) === normalizeText(value)
        )
      );
    }) ?? null
  );
};

export default function ProductPurchasePanel({ product }) {
  const variants = useMemo(() => getAvailableVariants(product), [product]);
  const [{ selection, atributoMap, attributeOrder }, setVariantState] = useState(() => {
    const { selection: initialSelection, atributoMap: map, sortedAttributeNames } =
      buildSelection(variants);
    return {
      selection: initialSelection,
      atributoMap: map,
      attributeOrder: sortedAttributeNames,
    };
  });
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const { selection: initialSelection, atributoMap: map, sortedAttributeNames } =
      buildSelection(variants, selection);
    setVariantState({
      selection: initialSelection,
      atributoMap: map,
      attributeOrder: sortedAttributeNames,
    });
    setQuantity(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?._id]);

  if (!product) {
    return null;
  }

  const matchingVariant = findVariantBySelection(variants, selection);
  const stockDisponible = matchingVariant?.cantidad ?? product?.stock?.total ?? 0;

  const handleAttributeChange = (name, value) => {
    setVariantState((prev) => {
      const nuevo = {
        ...prev.selection,
        [name]: value,
      };
      return {
        selection: nuevo,
        atributoMap: prev.atributoMap,
        attributeOrder: prev.attributeOrder,
      };
    });
    setQuantity(1);
  };

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => {
      const next = prev + delta;
      if (next < 1) return 1;
      if (stockDisponible > 0) {
        return Math.min(next, Math.min(stockDisponible, MAX_QUANTITY));
      }
      return Math.min(next, MAX_QUANTITY);
    });
  };

  const disableAddButton = stockDisponible <= 0;

  return (
    <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="space-y-4">
        {attributeOrder.map((name) => {
          const opciones = atributoMap[name] ?? [];
          if (opciones.length === 0) {
            return null;
          }
          const normalized = normalizeText(name);
          const isColor = normalized.includes("color");
          const selectedValue = selection[name];

          return (
            <div key={name} className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {name}
              </p>
              <div className="flex flex-wrap gap-2">
                {opciones.map((opcion) => {
                  const isActive = normalizeText(opcion.valor) === normalizeText(selectedValue);
                  if (isColor) {
                    const swatch = opcion.colores?.[0] ?? "#fff";
                    return (
                      <button
                        key={opcion.valor}
                        type="button"
                        className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                          isActive
                            ? "border-red-400 bg-red-50 text-red-600"
                            : "border-slate-200 bg-white text-slate-600 hover:border-red-300 hover:text-red-600"
                        }`}
                        onClick={() => handleAttributeChange(name, opcion.valor)}
                      >
                        <span
                          className="inline-block h-4 w-4 rounded-full border border-slate-200"
                          style={{ backgroundColor: swatch }}
                        />
                        {opcion.valor}
                      </button>
                    );
                  }

                  return (
                    <button
                      key={opcion.valor}
                      type="button"
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold uppercase transition ${
                        isActive
                          ? "bg-gradient-to-r from-rose-500 via-red-400 to-red-500 text-white shadow-sm"
                          : "border border-slate-200 bg-white text-slate-600 hover:border-red-300 hover:text-red-600"
                      }`}
                      onClick={() => handleAttributeChange(name, opcion.valor)}
                    >
                      {opcion.valor}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-lg font-semibold text-slate-600 transition hover:border-red-300 hover:text-red-600"
            onClick={() => handleQuantityChange(-1)}
          >
            -
          </button>
          <span className="min-w-[2rem] text-center text-base font-semibold text-slate-700">
            {quantity}
          </span>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-lg font-semibold text-slate-600 transition hover:border-red-300 hover:text-red-600"
            onClick={() => handleQuantityChange(1)}
          >
            +
          </button>
        </div>

        <div className="text-right">
          <p className="text-xs uppercase tracking-wide text-slate-500">Stock disponible</p>
          <p className="text-sm font-semibold text-slate-800">
            {stockDisponible > 0 ? `${stockDisponible} unidades` : "Agotado"}
          </p>
        </div>
      </div>

      <Button
        type="button"
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 via-red-400 to-red-500 py-3 text-base font-semibold text-white shadow-lg transition hover:brightness-105"
        disabled={disableAddButton}
      >
        <ShoppingCart className="h-5 w-5" />
        Agregar al carrito
        <span className="text-white/80">
          ({formatCurrency((product?.precio || 0) * quantity)})
        </span>
      </Button>

      <p className="text-xs text-slate-500">
        La integracion con pagos y envio se conectara al endpoint `/productos` del backend para
        registrar stock y movimientos. Esta version solo muestra la interfaz.
      </p>
    </div>
  );
}
