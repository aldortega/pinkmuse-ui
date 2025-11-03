import { useCallback, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "@/components/home/Header";
import Footer from "@/components/landing/Footer";
import ProductGallery from "@/components/merch/ProductGallery";
import ProductSummary from "@/components/merch/ProductSummary";
import ProductPurchasePanel from "@/components/merch/ProductPurchasePanel";
import ProductStockTable from "@/components/merch/ProductStockTable";
import RelatedProducts from "@/components/merch/RelatedProducts";
import { Button } from "@/components/ui/button";
import { useMerch } from "@/contexts/MerchContext";
import { useUser } from "@/contexts/UserContext";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const {
    products,
    loading,
    error,
    getProductBySlug,
    refetch,
    deleteProduct,
    deletingIds,
  } = useMerch();
  const { user, isAdmin } = useUser();
  const product = useMemo(() => getProductBySlug(slug), [getProductBySlug, slug]);

  const relatedProducts = useMemo(() => {
    if (!products?.length) {
      return [];
    }
    return products.filter((item) => item.slug !== product?.slug).slice(0, 3);
  }, [products, product]);

  const productId = product?._id ?? product?.id ?? null;
  const isDeleting = productId ? deletingIds.includes(productId) : false;

  const handleDelete = useCallback(async () => {
    if (!productId) {
      return;
    }
    const confirmed = window.confirm(
      "¿Seguro que deseas eliminar este producto del catalogo? Esta accion no se puede deshacer."
    );
    if (!confirmed) {
      return;
    }
    try {
      await deleteProduct(productId);
      navigate("/merch");
    } catch (err) {
      const message = err?.message || "No pudimos eliminar el producto.";
      window.alert(message);
    }
  }, [deleteProduct, navigate, productId]);

  const renderStatusCard = ({ title, message, actionLabel, onAction } = {}) => (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-6 px-4 py-12 text-center">
        <h1 className="text-3xl font-black text-slate-900">{title}</h1>
        <p className="text-sm text-slate-600">{message}</p>
        <div className="flex items-center gap-2">
          <Link
            to="/merch"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-500 via-red-400 to-red-500 px-5 py-2 text-sm font-semibold text-white shadow-lg transition hover:brightness-105"
          >
            Volver al catalogo
          </Link>
          {actionLabel ? (
            <Button variant="outline" onClick={onAction}>
              {actionLabel}
            </Button>
          ) : null}
        </div>
      </main>
      <Footer />
    </div>
  );

  if (loading) {
    return renderStatusCard({
      title: "Cargando producto",
      message: "Estamos obteniendo los detalles desde el backend.",
    });
  }

  if (error) {
    return renderStatusCard({
      title: "No pudimos cargar este producto",
      message: error,
      actionLabel: "Reintentar",
      onAction: refetch,
    });
  }

  if (!product) {
    return (
      renderStatusCard({
        title: "Producto no encontrado",
        message: "Puede que el producto haya sido renombrado o no este disponible todavia en el catalogo.",
      })
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
        {isAdmin ? (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
            <Button
              variant="outline"
              className="border-slate-200 text-slate-700 hover:border-red-300 hover:text-red-600"
              onClick={() => navigate(`/merch/${product.slug}/editar`)}
            >
              Editar producto
            </Button>
            <Button
              variant="secondary"
              className="bg-red-100 text-red-600 hover:bg-red-200"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Eliminando..." : "Eliminar"}
            </Button>
          </div>
        ) : null}

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
