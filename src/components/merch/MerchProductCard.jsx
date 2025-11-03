
import { useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";
import { useMerch } from "@/contexts/MerchContext";
import { formatCurrency } from "@/lib/merch";

export default function MerchProductCard({ product }) {
  const {
    slug,
    nombre,
    resumen,
    precio,
    imagenPrincipal,
    categoria,
    etiquetas = [],
    stock,
  } = product;

  const navigate = useNavigate();
  const { deleteProduct, deletingIds } = useMerch();
  const { user, isAdmin } = useUser();
  const productId = product?._id ?? product?.id ?? null;
  const isDeleting = productId ? deletingIds.includes(productId) : false;

  const handleDelete = useCallback(async () => {
    if (!productId) {
      return;
    }
    const message = `Deseas eliminar "${nombre}" del catalogo? Esta accion no se puede deshacer.`;
    const confirmed = window.confirm(message);
    if (!confirmed) {
      return;
    }
    try {
      await deleteProduct(productId);
    } catch (error) {
      const messageError = error?.message || "No pudimos eliminar el producto.";
      window.alert(messageError);
    }
  }, [deleteProduct, nombre, productId]);

  const stockDisponible = stock?.total ?? 0;

  return (
    <Card className="group flex h-full flex-col overflow-hidden border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        <img
          src={imagenPrincipal}
          alt={nombre}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/85 px-3 py-1 text-xs font-semibold uppercase text-slate-700 shadow">
          {categoria}
        </span>
      </div>

      <CardHeader className="space-y-3 p-4 pb-0">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-slate-900">{nombre}</h3>
          <p className="text-sm text-slate-600 line-clamp-2">{resumen}</p>
        </div>
        {etiquetas.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {etiquetas.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-red-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-red-500"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </CardHeader>

      <CardContent className="mt-auto flex flex-col gap-3 p-4">
        <div className="flex items-baseline justify-between">
          <span className="text-xl font-black text-slate-900">
            {formatCurrency(precio)}
          </span>
          <span className="text-xs font-medium uppercase text-slate-500">
            {stockDisponible > 0 ? `${stockDisponible} disponibles` : "Sin stock"}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <Link
            to={`/merch/${slug}`}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-red-400 hover:bg-red-50 hover:text-red-600"
          >
            Ver detalles
            <ArrowUpRight className="h-4 w-4" />
          </Link>
          {isAdmin ? (
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="flex-1 border-slate-200 text-slate-700 hover:border-red-300 hover:text-red-600"
                onClick={() => navigate(`/merch/${slug}/editar`)}
              >
                Editar
              </Button>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                className="flex-1 bg-red-100 text-red-600 hover:bg-red-200"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Eliminando..." : "Eliminar"}
              </Button>
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
