import { Badge } from "@/components/ui/badge";
import { formatCurrency, getAttributeValues } from "@/lib/merch";

export default function ProductSummary({ product }) {
  if (!product) {
    return null;
  }

  const { nombre, resumen, descripcion, etiquetas = [], precio, categoria } = product;
  const talles = getAttributeValues(product, "talle").map((item) => item.valor);
  const colores = getAttributeValues(product, "color").map((item) => ({
    label: item.valor,
    swatch: item.colores?.[0],
  }));

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-wide text-red-500">{categoria}</p>
        <h1 className="text-3xl font-black text-slate-900 sm:text-4xl">{nombre}</h1>
      </div>

      <div className="flex flex-wrap gap-2">
        {etiquetas.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="bg-red-50 text-xs font-semibold uppercase tracking-wide text-red-500"
          >
            {tag}
          </Badge>
        ))}
      </div>

      <div className="space-y-1">
        <p className="text-2xl font-black text-slate-900">{formatCurrency(precio)}</p>
        <p className="text-sm text-slate-500">Precio final por unidad</p>
      </div>

      <p className="text-sm leading-relaxed text-slate-700">{resumen}</p>
      <p className="text-sm leading-relaxed text-slate-600">{descripcion}</p>

      <div className="grid gap-3 sm:grid-cols-2">
        {colores.length > 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Colores
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              {colores.map(({ label, swatch }) => (
                <div key={label} className="flex items-center gap-2">
                  <span
                    className="inline-block h-6 w-6 rounded-full border border-slate-200"
                    style={{ backgroundColor: swatch || "#fff" }}
                  />
                  <span className="text-sm font-medium text-slate-700">{label}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {talles.length > 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Talles
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {talles.map((talle) => (
                <span
                  key={talle}
                  className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700"
                >
                  {talle}
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
