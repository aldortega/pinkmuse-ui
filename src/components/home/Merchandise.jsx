import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import { MERCH_PRODUCTS } from "@/constants/merch";

export default function Merchandise() {
  const destacados = MERCH_PRODUCTS.slice(0, 3);

  return (
    <section className="py-12">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="mb-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <h2 className="text-center text-2xl font-bold text-slate-800 sm:text-left">
            Merch oficial
          </h2>
          <Link
            to="/merch"
            className="inline-flex items-center gap-2 rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-500 transition hover:border-red-400 hover:text-red-600"
          >
            Ver catalogo completo
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {destacados.map((product) => (
            <ProductCard
              key={product._id}
              title={product.nombre}
              price={product.precio}
              image={product.imagenPrincipal || "/merch.png"}
              slug={product.slug}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
