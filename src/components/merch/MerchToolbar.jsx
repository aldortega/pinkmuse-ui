import { Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MerchToolbar({
  categories = [],
  selectedCategory = "todos",
  onCategoryChange,
  searchTerm = "",
  onSearchChange,
  onlyInStock = false,
  onOnlyInStockChange,
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="Buscar por nombre o etiqueta..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-3 text-sm text-slate-800 shadow-inner outline-hidden transition focus:border-red-300 focus:ring-2 focus:ring-red-200"
            value={searchTerm}
            onChange={(event) => onSearchChange?.(event.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            variant={onlyInStock ? "default" : "outline"}
            className={`gap-2 ${onlyInStock ? "bg-gradient-to-r from-rose-500 via-red-400 to-red-500 text-white" : "border-slate-200 text-slate-700 hover:border-red-200 hover:bg-red-50 hover:text-red-600"}`}
            onClick={() => onOnlyInStockChange?.(!onlyInStock)}
          >
            <Filter className="h-4 w-4" />
            Stock
          </Button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {categories.map((category) => {
          const isSelected = category.id === selectedCategory;
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onCategoryChange?.(category.id)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                isSelected
                  ? "bg-gradient-to-r from-rose-500 via-red-400 to-red-500 text-white shadow-sm"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-red-200 hover:text-red-500"
              }`}
            >
              {category.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
