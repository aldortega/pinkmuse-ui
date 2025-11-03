import MerchProductCard from "./MerchProductCard";

export default function RelatedProducts({ products = [] }) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Tambien podria interesarte</h2>
          <p className="text-sm text-slate-500">
            Completa tu combo con otros articulos del catalogo.
          </p>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => {
          const key = product?.id ?? product?._id ?? product?.slug;
          return <MerchProductCard key={key} product={product} />;
        })}
      </div>
    </section>
  );
}
