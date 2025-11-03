import { useEffect, useMemo, useState } from "react";
import Header from "@/components/home/Header";
import Footer from "@/components/landing/Footer";
import MerchHero from "@/components/merch/MerchHero";
import MerchToolbar from "@/components/merch/MerchToolbar";
import MerchProductGrid from "@/components/merch/MerchProductGrid";
import { Button } from "@/components/ui/button";
import { useMerch } from "@/contexts/MerchContext";
import { normalizeText } from "@/lib/merch";

const filterProducts = (products, { category, searchTerm, onlyInStock }) => {
  console.log({ category });
  return products.filter((product) => {
    const categoriaProducto = normalizeText(product?.categoria);
    const categoriaFiltro = normalizeText(category);

    if (categoriaFiltro !== "todos" && categoriaProducto !== categoriaFiltro) {
      return false;
    }

    if (onlyInStock && ((product?.stock?.total ?? 0) <= 0)) {
      return false;
    }

    if (searchTerm.trim() !== "") {
      const target = normalizeText(searchTerm);
      const nombre = normalizeText(product?.nombre);
      const resumen = normalizeText(product?.resumen);
      const etiquetas = Array.isArray(product?.etiquetas)
        ? product.etiquetas.map(normalizeText)
        : [];
      const hayCoincidencia =
        nombre.includes(target) ||
        resumen.includes(target) ||
        etiquetas.some((etiqueta) => etiqueta.includes(target));
      if (!hayCoincidencia) {
        return false;
      }
    }

    return true;
  });
};

export default function MerchListPage() {
  const { products, loading, error, categories, refetch } = useMerch();
  const [selectedCategory, setSelectedCategory] = useState("todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [onlyInStock, setOnlyInStock] = useState(false);

  useEffect(() => {
    if (loading) {
      return;
    }
    if (!categories?.some((category) => category.id === selectedCategory)) {
      setSelectedCategory("todos");
    }
  }, [categories, loading, selectedCategory]);

  const filteredProducts = useMemo(
    () =>
      filterProducts(products, {
        category: selectedCategory,
        searchTerm,
        onlyInStock,
      }),
    [products, selectedCategory, searchTerm, onlyInStock]
  );

  const productCount = products.length;
  const categoryCount = Math.max(0, (categories?.length ?? 1) - 1);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <MerchHero
          productCount={productCount}
          categoryCount={categoryCount}
        />

        <MerchToolbar
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onlyInStock={onlyInStock}
          onOnlyInStockChange={setOnlyInStock}
        />

        {loading ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center shadow-sm">
            <h3 className="text-lg font-semibold text-slate-700">Cargando catálogo…</h3>
            <p className="mt-2 text-sm text-slate-500">
              Estamos trayendo los productos desde el backend.
            </p>
          </div>
        ) : error ? (
          <div className="space-y-4 rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
            <h3 className="text-lg font-semibold text-red-600">No pudimos cargar los productos</h3>
            <p className="text-sm text-slate-500">{error}</p>
            <div className="flex justify-center">
              <Button onClick={refetch} variant="outline">
                Reintentar
              </Button>
            </div>
          </div>
        ) : (
          <MerchProductGrid products={filteredProducts} />
        )}
      </main>

      <Footer />
    </div>
  );
}
