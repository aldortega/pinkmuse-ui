import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "@/components/home/Header";
import Footer from "@/components/landing/Footer";
import ProductGallery from "@/components/merch/ProductGallery";
import ProductSummary from "@/components/merch/ProductSummary";
import ProductPurchasePanel from "@/components/merch/ProductPurchasePanel";
import ProductStockTable from "@/components/merch/ProductStockTable";
import RelatedProducts from "@/components/merch/RelatedProducts";
import { MERCH_BY_SLUG, MERCH_PRODUCTS } from "@/constants/merch";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const product = MERCH_BY_SLUG[slug];

  const relatedProducts = useMemo(() => {
    return MERCH_PRODUCTS.filter((item) => item.slug !== slug).slice(0, 3);
  }, [slug]);

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <Header />
        <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-6 px-4 py-12 text-center">
          <h1 className="text-3xl font-black text-slate-900">Producto no encontrado</h1>
          <p className="text-sm text-slate-600">
            Puede que el producto haya sido renombrado o no este disponible todavia en el catalogo.
          </p>
          <Link
            to="/merch"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-500 via-red-400 to-red-500 px-5 py-2 text-sm font-semibold text-white shadow-lg transition hover:brightness-105"
          >
            Volver al catalogo
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-4 py-10 sm:px-6 lg:px-8">
        <nav className="text-sm text-slate-500">
          <Link to="/merch" className="hover:text-red-500">
            Merch
          </Link>{" "}
          / <span className="font-semibold text-slate-800">{product.nombre}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <ProductGallery product={product} />

          <div className="space-y-6">
            <ProductSummary product={product} />
            <ProductPurchasePanel product={product} />
          </div>
        </div>

        <ProductStockTable product={product} />

        <RelatedProducts products={relatedProducts} />
      </main>

      <Footer />
    </div>
  );
}
