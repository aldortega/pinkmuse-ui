import MerchProductCard from "./MerchProductCard";

export default function MerchProductGrid({ products = [] }) {
  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center">
        <h3 className="text-lg font-semibold text-slate-700">
          No encontramos productos con los filtros seleccionados.
        </h3>
        <p className="mt-2 text-sm text-slate-500">
          Ajusta la categoria, limpia la busqueda o desactiva el filtro de stock para ver mas items.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <MerchProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
