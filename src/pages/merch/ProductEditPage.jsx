import { Link, useNavigate, useParams } from "react-router-dom";
import { useMerch } from "@/contexts/MerchContext";
import ProductForm from "./ProductForm";
import Header from "@/components/home/Header";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";

export default function ProductEditPage() {
  const { slug } = useParams();
  const { loading, error, getProductBySlug, refetch } = useMerch();
  const product = getProductBySlug(slug);
  const navigate = useNavigate();

  if (loading && !product) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <Header />
        <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-6 px-4 py-12 text-center">
          <h1 className="text-3xl font-black text-slate-900">
            Cargando producto...
          </h1>
          <p className="text-sm text-slate-600">
            Estamos obteniendo la informacion desde el backend.
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <Header />
        <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-6 px-4 py-12 text-center">
          <h1 className="text-3xl font-black text-slate-900">
            No pudimos cargar el producto
          </h1>
          <p className="text-sm text-slate-600">{error}</p>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={refetch}>
              Reintentar
            </Button>
            <Button onClick={() => navigate("/merch")}>
              Volver al catalogo
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <Header />
        <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-6 px-4 py-12 text-center">
          <h1 className="text-3xl font-black text-slate-900">
            Producto no encontrado
          </h1>
          <p className="text-sm text-slate-600">
            Puede que haya sido eliminado o que el slug no sea correcto.
          </p>
          <Button asChild>
            <Link to="/merch">Volver al catalogo</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return <ProductForm mode="edit" product={product} />;
}
