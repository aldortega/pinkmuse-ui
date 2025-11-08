import { useMemo, useState } from "react";
import Header from "@/components/home/Header";
import Footer from "@/components/landing/Footer";
import TicketsHero from "@/components/tickets/TicketsHero";
import TicketFilters from "@/components/tickets/TicketFilters";
import TicketEventList from "@/components/tickets/TicketEventList";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCcw } from "lucide-react";
import { useEvents } from "@/contexts/EventContext";

const MS_PER_DAY = 1000 * 60 * 60 * 24;

const parseEventDate = (value) => {
  if (!value) {
    return null;
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return date;
};

const isDateUpcoming = (date) => {
  if (!date) {
    return true;
  }
  const now = new Date();
  const diff = (date.getTime() - now.getTime()) / MS_PER_DAY;
  return diff >= -1; // permitimos mostrar eventos recientes
};

const fitsRange = (date, range) => {
  if (!date || range === "todos") {
    return true;
  }
  const now = new Date();
  const diff = (date.getTime() - now.getTime()) / MS_PER_DAY;
  if (diff < -1) {
    return false;
  }
  if (range === "semana") {
    return diff <= 7;
  }
  if (range === "mes") {
    return diff <= 31;
  }
  return true;
};

const hasAvailableTickets = (entradas) => {
  if (!Array.isArray(entradas)) {
    return false;
  }
  return entradas.some((entrada) => {
    if (entrada?.estado !== "Disponible") {
      return false;
    }
    const cantidad = Number.parseInt(entrada?.cantidad, 10);
    return cantidad > 0;
  });
};

const normalizeText = (value) =>
  typeof value === "string" ? value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : "";

const buildSearchTarget = (event) => {
  const parts = [
    event?.nombreEvento,
    event?.nombreLugar,
    event?.descripcion,
    Array.isArray(event?.artistasExtras) ? event.artistasExtras.join(" ") : "",
  ];
  const direccion = event?.direccion;
  if (direccion && typeof direccion === "object") {
    parts.push(
      direccion.calle,
      direccion.numero ? String(direccion.numero) : "",
      direccion.ciudad
    );
  }
  return normalizeText(parts.filter(Boolean).join(" "));
};

const filterEvents = (events, { search, range, onlyAvailable }) => {
  const normalizedSearch = normalizeText(search ?? "");

  return events
    .filter((event) => {
      const eventDate = parseEventDate(event?.fecha);
      if (!isDateUpcoming(eventDate)) {
        return false;
      }
      if (!fitsRange(eventDate, range)) {
        return false;
      }
      if (onlyAvailable && !hasAvailableTickets(event?.entradas)) {
        return false;
      }
      if (normalizedSearch) {
        const target = buildSearchTarget(event);
        if (!target.includes(normalizedSearch)) {
          return false;
        }
      }
      return true;
    })
    .sort((a, b) => {
      const dateA = parseEventDate(a?.fecha);
      const dateB = parseEventDate(b?.fecha);
      if (!dateA && !dateB) {
        return (a?.nombreEvento || "").localeCompare(b?.nombreEvento || "");
      }
      if (!dateA) {
        return 1;
      }
      if (!dateB) {
        return -1;
      }
      return dateA.getTime() - dateB.getTime();
    });
};

export default function TicketsListPage() {
  const { events, loading, error, refetch } = useEvents();

  const [search, setSearch] = useState("");
  const [filterRange, setFilterRange] = useState("todos");
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  const upcomingEvents = useMemo(
    () =>
      filterEvents(events ?? [], {
        search,
        range: filterRange,
        onlyAvailable,
      }),
    [events, search, filterRange, onlyAvailable]
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <TicketsHero upcomingCount={upcomingEvents.length} />

        <TicketFilters
          search={search}
          onSearchChange={setSearch}
          filterRange={filterRange}
          onFilterRangeChange={setFilterRange}
          onlyAvailable={onlyAvailable}
          onOnlyAvailableChange={setOnlyAvailable}
        />

        {loading ? (
          <Card className="bg-red-50">
            <CardContent className="flex flex-col items-center gap-3 py-12">
              <Loader2 className="h-6 w-6 animate-spin text-red-400" />
              <p className="text-slate-700">Cargando eventos disponibles...</p>
            </CardContent>
          </Card>
        ) : null}

        {!loading && error ? (
          <Card className="bg-red-50">
            <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
              <p className="text-lg font-semibold text-slate-800">
                No pudimos cargar los eventos.
              </p>
              <p className="text-sm text-slate-600">
                {error || "Intenta nuevamente en unos instantes."}
              </p>
              <Button
                type="button"
                onClick={() => refetch?.()}
                className="cursor-pointer gap-2 bg-gradient-to-r from-rose-500 via-red-400 to-red-500 text-white hover:opacity-90"
              >
                <RefreshCcw className="h-4 w-4" />
                Reintentar
              </Button>
            </CardContent>
          </Card>
        ) : null}

        {!loading && !error ? (
          <TicketEventList events={upcomingEvents} />
        ) : null}
      </main>

      <Footer />
    </div>
  );
}
