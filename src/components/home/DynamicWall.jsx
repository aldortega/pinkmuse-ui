import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useEvents } from "@/contexts/EventContext";
import { useNews } from "@/contexts/NewsContext";
import { useMerch } from "@/contexts/MerchContext";
import { buildImageUrl } from "@/lib/imageService";
import { Calendar, Newspaper, ShoppingBag } from "lucide-react";

// --- Tarjeta Unificada --- //
function ContentCard({ item }) {
  const cardTypes = {
    event: {
      Icon: Calendar,
      label: "Evento",
      title: item.data.nombreEvento,
      imageUrl: buildImageUrl(item.data.imagenPrincipal) || "/brazos.png",
      link: `/eventos/${item.data.slug}`,
      content: (
        <p className="text-sm text-slate-600">
          {new Date(item.data.fecha).toLocaleDateString("es-AR", { day: '2-digit', month: 'short' })}
          {' - '}{item.data.nombreLugar || item.data.direccion?.ciudad}
        </p>
      ),
    },
    news: {
      Icon: Newspaper,
      label: "Noticia",
      title: item.data.titulo || item.data.nombre,
      imageUrl: buildImageUrl(item.data.imagenPrincipal) || "/news3.png",
      link: `/noticias/${item.data.slug}`,
      content: <p className="text-sm text-slate-600 line-clamp-3">{item.data.resumen}</p>,
    },
    merch: {
      Icon: ShoppingBag,
      label: "Producto",
      title: item.data.nombre,
      imageUrl: buildImageUrl(item.data.imagenPrincipal) || "/merch.png",
      link: `/merch/${item.data.slug}`,
      content: <p className="text-lg font-bold text-red-500">{new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(item.data.precio)}</p>,
    },
  };

  const card = cardTypes[item.type];

  if (!card) return null;

  return (
    <div className="mb-6 break-inside-avoid rounded-2xl bg-white shadow-sm ring-1 ring-slate-900/5 transition-all hover:shadow-lg hover:-translate-y-1">
      <Link to={card.link} className="group block">
        {card.imageUrl && (
          <div className="overflow-hidden rounded-t-2xl">
            <img src={card.imageUrl} alt={card.title} className="w-full object-cover transition-transform duration-300 group-hover:scale-105" />
          </div>
        )}
        <div className="p-4">
          <div className="flex items-center gap-2">
            <card.Icon className="h-4 w-4 text-slate-400" />
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{card.label}</p>
          </div>
          <h3 className="mt-2 text-lg font-bold text-slate-800 group-hover:text-red-600">{card.title}</h3>
          <div className="mt-2">{card.content}</div>
        </div>
      </Link>
    </div>
  );
}

// --- Muro Dinámico --- //
export function DynamicWall() {
  const { events, loading: loadingEvents } = useEvents();
  const { news, loading: loadingNews } = useNews();
  const { products, loading: loadingMerch } = useMerch();

  const combinedFeed = useMemo(() => {
    const eventItems = events.map(e => ({ type: 'event', date: new Date(e.fecha), data: e }));
    const newsItems = news.map(n => ({ type: 'news', date: new Date(n.createdAt || n.fechaPublicacion), data: n }));
    const merchItems = products.map(p => ({ type: 'merch', date: new Date(p.createdAt), data: p }));

    return [...eventItems, ...newsItems, ...merchItems]
      .sort((a, b) => b.date - a.date);
  }, [events, news, products]);

  const isLoading = loadingEvents || loadingNews || loadingMerch;

  if (isLoading) {
    return <p>Cargando contenido...</p>;
  }

  if (combinedFeed.length === 0) {
    return <p>No hay contenido para mostrar.</p>;
  }

  return (
    <div className="w-full" style={{ columnCount: 1, columnGap: '1.5rem', '@media (min-width: 640px)': { columnCount: 2 }, '@media (min-width: 1024px)': { columnCount: 3 } }}>
       <div className="w-full sm:columns-2 lg:columns-3 gap-6">
        {combinedFeed.map((item, index) => (
          <ContentCard key={`${item.type}-${item.data._id || index}`} item={item} />
        ))}
      </div>
    </div>
  );
}
