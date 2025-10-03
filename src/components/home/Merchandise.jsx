import ProductCard from "./ProductCard";
const products = [
  {
    title: "Remera",
    price: "$30000",
    image: "/merch.png",
    imageQuery: "band-t-shirt-collection",
  },
  {
    title: "Poster",
    price: "$15000",
    image: "/merch.png",
    imageQuery: "concert-poster-design",
  },
  {
    title: "Album",
    price: "$25000",
    image: "/merch.png",
    imageQuery: "signed-vinyl-album",
  },
];

export default function Merchandise() {
  return (
    <section className="py-12">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <h2 className="mb-8 text-center text-2xl font-bold text-slate-800 sm:text-left">
          Merchandise
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => (
            <ProductCard
              key={index}
              title={product.title}
              price={product.price}
              image={product.image}
              imageQuery={product.imageQuery}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
