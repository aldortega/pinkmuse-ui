import { useMemo } from "react";
import { Link } from "react-router-dom";
import ProductCard from "@/components/merch/MerchProductCard";
import { useMerch } from "@/contexts/MerchContext";

export default function Merchandise() {
  const { products, loading, error } = useMerch();

  const destacados = useMemo(() => products.slice(0, 3), [products]);

  return (
    <section className="py-12">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
              <div className="mb-6 flex flex-col items-start gap-4">
                <h2 className="text-xl font-bold text-slate-800">
                  Merch oficial
                </h2>
                <Link
                  to="/merch"
                  className="inline-flex items-center gap-2 rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-500 transition hover:border-red-400 hover:text-red-600"
                >
                  Ver catalogo
                </Link>
              </div>
              {error ? (
                <div className="rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
                  <p className="text-sm text-red-600">
                    No pudimos cargar los productos: {error}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {loading
                    ? Array.from({ length: 3 }).map((_, index) => (                  <div
                    key={`merch-skeleton-${index}`}
                    className="h-full rounded-2xl border border-slate-200 bg-white p-4"
                  >
                    <div className="aspect-square w-full animate-pulse rounded-xl bg-slate-100" />
                    <div className="mt-4 space-y-2">
                      <div className="h-3 w-3/4 animate-pulse rounded-full bg-slate-100" />
                      <div className="h-3 w-1/2 animate-pulse rounded-full bg-slate-100" />
                    </div>
                  </div>
                ))
              : destacados.map((product) => {
                  const key = product?.id ?? product?._id ?? product?.slug;
                  return <ProductCard key={key} product={product} />;
                })}
            {!loading && destacados.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center text-sm text-slate-500 sm:col-span-2 lg:col-span-3">
                Todavia no hay productos cargados. Vuelve mas tarde para ver las novedades.
              </div>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}
