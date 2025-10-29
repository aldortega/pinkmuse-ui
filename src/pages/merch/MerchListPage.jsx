import { useMemo, useState } from "react";
import Header from "@/components/home/Header";
import Footer from "@/components/landing/Footer";
import MerchHero from "@/components/merch/MerchHero";
import MerchToolbar from "@/components/merch/MerchToolbar";
import MerchProductGrid from "@/components/merch/MerchProductGrid";
import { MERCH_CATEGORIES, MERCH_PRODUCTS } from "@/constants/merch";
import { normalizeText } from "@/lib/merch";

const filterProducts = (products, { category, searchTerm, onlyInStock }) => {
  return products.filter((product) => {
    if (category !== "todos" && product.categoria !== category) {
      return false;
    }

    if (onlyInStock && (product?.stock?.total ?? 0) <= 0) {
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
  const [selectedCategory, setSelectedCategory] = useState("todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [onlyInStock, setOnlyInStock] = useState(false);

  const filteredProducts = useMemo(
    () =>
      filterProducts(MERCH_PRODUCTS, {
        category: selectedCategory,
        searchTerm,
        onlyInStock,
      }),
    [selectedCategory, searchTerm, onlyInStock]
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <MerchHero
          productCount={MERCH_PRODUCTS.length}
          categoryCount={MERCH_CATEGORIES.length - 1}
        />

        <MerchToolbar
          categories={MERCH_CATEGORIES}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onlyInStock={onlyInStock}
          onOnlyInStockChange={setOnlyInStock}
        />

        <MerchProductGrid products={filteredProducts} />
      </main>

      <Footer />
    </div>
  );
}
