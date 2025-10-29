import { normalizeText } from "@/lib/merch";

export default function ProductStockTable({ product }) {
  const detalles = Array.isArray(product?.stock?.detalles) ? product.stock.detalles : [];

  if (detalles.length === 0) {
    return null;
  }

  const attributeHeaders = Array.from(
    new Set(
      detalles.flatMap((detalle) =>
        Array.isArray(detalle?.atributos)
          ? detalle.atributos.map((atributo) => atributo?.nombre).filter(Boolean)
          : []
      )
    )
  );

  const normalizedHeaders = attributeHeaders.map((header) => ({
    label: header,
    key: normalizeText(header),
  }));

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <header className="mb-4 space-y-1">
        <h2 className="text-xl font-bold text-slate-900">Detalle de stock por variante</h2>
        <p className="text-sm text-slate-500">
          Visualiza los atributos disponibles y la cantidad registrada para cada combinacion.
        </p>
      </header>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
              <th scope="col" className="px-4 py-3 font-semibold">
                Variante
              </th>
              {normalizedHeaders.map((header) => (
                <th key={header.key} scope="col" className="px-4 py-3 font-semibold">
                  {header.label}
                </th>
              ))}
              <th scope="col" className="px-4 py-3 font-semibold">
                Stock
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {detalles.map((detalle) => (
              <tr key={detalle.id} className="text-slate-700">
                <td className="whitespace-nowrap px-4 py-3 font-medium">{detalle.id}</td>
                {normalizedHeaders.map((header) => {
                  const atributos = Array.isArray(detalle?.atributos) ? detalle.atributos : [];
                  const atributo = atributos.find(
                    (item) => normalizeText(item?.nombre) === header.key
                  );
                  return (
                    <td key={header.key} className="whitespace-nowrap px-4 py-3">
                      {atributo?.valor ?? "-"}
                    </td>
                  );
                })}
                <td className="whitespace-nowrap px-4 py-3 font-semibold">
                  {detalle?.cantidad ?? 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
