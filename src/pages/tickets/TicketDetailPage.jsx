import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "@/components/home/Header";
import Footer from "@/components/landing/Footer";
import TicketDetailHero from "@/components/tickets/TicketDetailHero";
import TicketTypeList from "@/components/tickets/TicketTypeList";
import TicketSelectionSummary from "@/components/tickets/TicketSelectionSummary";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowLeft, Loader2, RefreshCcw } from "lucide-react";
import { useEvents } from "@/contexts/EventContext";

export default function TicketDetailPage() {
  const params = useParams();
  const navigate = useNavigate();

  const slug = params?.eventSlug ?? "";

  const { loading, error, getEventBySlug, refetch } = useEvents();

  const event = useMemo(
    () => (slug ? getEventBySlug?.(slug) : null),
    [getEventBySlug, slug]
  );

  const [quantities, setQuantities] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [statusDescription, setStatusDescription] = useState(null);

  const timeoutRef = useRef(null);
  const didRefetch = useRef(false);

  useEffect(() => {
    if (event && Array.isArray(event.entradas)) {
      setQuantities(event.entradas.map(() => 0));
    } else {
      setQuantities([]);
    }
    setStatusMessage(null);
    setStatusDescription(null);
  }, [event]);

  useEffect(() => {
    if (!event && !loading && !error && !didRefetch.current) {
      didRefetch.current = true;
      refetch?.();
    }
  }, [event, loading, error, refetch]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleQuantityChange = useCallback((index, value) => {
    setQuantities((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }, []);

  const handleClearSelection = useCallback(() => {
    setQuantities((prev) => prev.map(() => 0));
    setStatusMessage(null);
    setStatusDescription(null);
  }, []);

  const handleProceed = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsProcessing(true);
    setStatusMessage(null);
    setStatusDescription(null);
    timeoutRef.current = setTimeout(() => {
      setIsProcessing(false);
      setStatusMessage("¡Selección registrada!");
      setStatusDescription(
        "Guardamos tu selección localmente. En cuanto activemos la pasarela de pago vas a poder completar la compra."
      );
    }, 900);
  }, []);

  const handleBack = useCallback(() => {
    navigate("/entradas");
  }, [navigate]);

  const showLoading = loading && !event;
  const showError = !loading && error;
  const showNotFound = !loading && !event && !error;

  const tickets = event?.entradas ?? [];

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={handleBack}
          className="flex w-fit items-center gap-2 text-sm font-medium text-slate-700 transition hover:text-red-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a eventos
        </button>

        {showLoading ? (
          <Card className="bg-red-50">
            <CardContent className="flex flex-col items-center gap-3 py-12">
              <Loader2 className="h-6 w-6 animate-spin text-red-400" />
              <p className="text-slate-700">Cargando información del evento...</p>
            </CardContent>
          </Card>
        ) : null}

        {showError ? (
          <Card className="bg-red-50">
            <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
              <p className="text-lg font-semibold text-slate-800">
                No pudimos obtener el evento.
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

        {showNotFound ? (
          <Card className="bg-red-50">
            <CardContent className="space-y-4 py-12 text-center">
              <p className="text-lg font-semibold text-slate-800">
                No encontramos información para este evento.
              </p>
              <p className="text-sm text-slate-600">
                Revisa el enlace o volvé al listado para elegir otro show.
              </p>
              <Button
                type="button"
                onClick={handleBack}
                className="cursor-pointer bg-gradient-to-r from-rose-500 via-red-400 to-red-500 text-white hover:opacity-90"
              >
                Volver a entradas
              </Button>
            </CardContent>
          </Card>
        ) : null}

        {event ? (
          <div className="space-y-8">
            <TicketDetailHero event={event} />

            {statusMessage ? (
              <Alert className="border-green-200 bg-green-50/80 text-slate-700">
                <AlertTitle className="text-sm font-semibold text-slate-800">
                  {statusMessage}
                </AlertTitle>
                {statusDescription ? (
                  <AlertDescription className="text-xs text-slate-600">
                    {statusDescription}
                  </AlertDescription>
                ) : null}
              </Alert>
            ) : null}

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(320px,1fr)]">
              <TicketTypeList
                tickets={tickets}
                quantities={quantities}
                onQuantityChange={handleQuantityChange}
              />

              <TicketSelectionSummary
                tickets={tickets}
                quantities={quantities}
                onClear={handleClearSelection}
                onProceed={handleProceed}
                isProcessing={isProcessing}
              />
            </div>
          </div>
        ) : null}
      </main>

      <Footer />
    </div>
  );
}
