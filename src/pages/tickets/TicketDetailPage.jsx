import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Wallet } from "@mercadopago/sdk-react";
import Header from "@/components/home/Header";
import Footer from "@/components/landing/Footer";
import TicketDetailHero from "@/components/tickets/TicketDetailHero";
import TicketTypeList from "@/components/tickets/TicketTypeList";
import TicketSelectionSummary from "@/components/tickets/TicketSelectionSummary";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  ArrowLeft,
  Loader2,
  RefreshCcw,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useEvents } from "@/contexts/EventContext";
import {
  CrearPreferenciaMercadoPago,
  procesarPagoYCrearComprobante,
} from "@/services/mercadopago";

const parsePrecio = (value) => {
  const parsed = Number.parseFloat(value);
  return Number.isNaN(parsed) ? 0 : parsed;
};

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
  const [preferenceId, setPreferenceId] = useState(null);
  const [paymentError, setPaymentError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [comprobante, setComprobante] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(false);

  const timeoutRef = useRef(null);
  const didRefetch = useRef(false);

  useEffect(() => {
    if (event && Array.isArray(event.entradas)) {
      setQuantities(event.entradas.map(() => 0));
    } else {
      setQuantities([]);
    }
    setPreferenceId(null);
    setPaymentError(null);
    setPaymentSuccess(false);
    setComprobante(null);
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

  // Calcular items para MercadoPago
  const mpItems = useMemo(() => {
    if (!event?.entradas) return [];

    const items = [];
    event.entradas.forEach((ticket, index) => {
      const quantity = quantities[index] ?? 0;
      if (quantity <= 0) return;

      const priceUnit = parsePrecio(ticket?.precio);

      items.push({
        title: ticket?.tipo || `Entrada ${index + 1}`,
        quantity: quantity,
        unit_price: priceUnit,
        id: event._id,
      });
    });

    return items;
  }, [event, quantities]);

  const totalTickets = useMemo(() => {
    return quantities.reduce((sum, qty) => sum + (qty || 0), 0);
  }, [quantities]);

  const handleQuantityChange = useCallback((index, value) => {
    setQuantities((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
    setPreferenceId(null);
    setPaymentError(null);
    setPaymentSuccess(false);
  }, []);

  const handleClearSelection = useCallback(() => {
    setQuantities((prev) => prev.map(() => 0));
    setPreferenceId(null);
    setPaymentError(null);
    setPaymentSuccess(false);
    setComprobante(null);
  }, []);

  const handleProceed = useCallback(async () => {
    if (totalTickets === 0 || mpItems.length === 0) return;

    setIsProcessing(true);
    setPaymentError(null);

    try {
      localStorage.setItem("mp_event_id", event._id);
      localStorage.setItem(
        "mp_selections",
        JSON.stringify(
          mpItems.map((item) => ({
            tipoEntrada: item.title,
            cantidad: item.quantity,
          }))
        )
      );

      const response = await CrearPreferenciaMercadoPago({
        items: mpItems.map((item) => ({
          title: item.title,
          quantity: item.quantity,
          unit_price: item.unit_price,
        })),
        eventId: event._id,
        eventName: event.nombreEvento || event.title || "Evento PinkMuse",
      });

      if (response?.success && response?.preference_id) {
        localStorage.setItem("mp_preference_id", response.preference_id);
        setPreferenceId(response.preference_id);
      } else {
        throw new Error(
          response?.message || "No se recibió el ID de preferencia"
        );
      }
    } catch (err) {
      console.error("Error al crear la preferencia:", err);
      setPaymentError(err.message || "Ocurrió un error al preparar el pago");
    } finally {
      setIsProcessing(false);
    }
  }, [totalTickets, mpItems, event]);

  const handleBack = useCallback(() => {
    navigate("/entradas");
  }, [navigate]);

  // Función para procesar el pago después de que se complete en MP
  const procesarPagoCompleto = useCallback(async (paymentId) => {
    setProcessingPayment(true);
    setPaymentError(null);

    try {
      const selections = JSON.parse(
        localStorage.getItem("mp_selections") || "[]"
      );

      if (!paymentId) {
        throw new Error("No se encontró el ID de pago");
      }

      // if (selections.length === 0) {
      //   throw new Error(
      //     "No se encontró información de la compra. Asegúrate de haber seleccionado entradas primero."
      //   );
      // }

      // ✅ Enviar solo con tipoEntrada (identificación por nombre)
      const productos = selections.map((sel) => ({
        tipoReferencia: "evento",
        cantidad: sel.cantidad,
        tipoEntrada: sel.tipoEntrada,
      }));

      console.log("📤 Enviando productos:", productos);

      const result = await procesarPagoYCrearComprobante({
        payment_id: paymentId,
        productos,
      });

      if (result.success) {
        setPaymentSuccess(true);
        setComprobante(result.data);

        // Limpiar localStorage
        localStorage.removeItem("mp_event_id");
        localStorage.removeItem("mp_selections");
        localStorage.removeItem("mp_preference_id");

        setQuantities((prev) => prev.map(() => 0));
        setPreferenceId(null);
      } else {
        throw new Error(result.message || "Error al crear el comprobante");
      }
    } catch (err) {
      console.error("Error al procesar pago:", err);
      setPaymentError(err.message);
    } finally {
      setProcessingPayment(false);
    }
  }, []);

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
              <p className="text-slate-700">
                Cargando información del evento...
              </p>
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

            {paymentError ? (
              <Alert className="border-red-300 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertTitle className="text-sm font-semibold text-red-800">
                  Error al procesar
                </AlertTitle>
                <AlertDescription className="text-xs text-red-700">
                  {paymentError}
                </AlertDescription>
              </Alert>
            ) : null}

            {paymentSuccess && comprobante ? (
              <Alert className="border-green-300 bg-green-50">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-sm font-semibold text-green-800">
                  ¡Compra exitosa!
                </AlertTitle>
                <AlertDescription className="text-xs text-green-700">
                  Tu comprobante {comprobante.data?.numeroComprobante} ha sido
                  generado correctamente.
                </AlertDescription>
              </Alert>
            ) : null}

            {processingPayment ? (
              <Alert className="border-blue-300 bg-blue-50">
                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                <AlertTitle className="text-sm font-semibold text-blue-800">
                  Procesando tu pago...
                </AlertTitle>
                <AlertDescription className="text-xs text-blue-700">
                  Estamos generando tu comprobante, por favor espera.
                </AlertDescription>
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

            {preferenceId && !paymentSuccess && (
              <Card className="border-green-200 bg-green-50/80">
                <CardContent className="space-y-4 py-6">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-slate-800">
                      ¡Todo listo para pagar!
                    </h3>
                    <p className="text-sm text-slate-600 mt-1">
                      1. Hacé clic en el botón de Mercado Pago
                      <br />
                      2. Completá el pago
                      <br />
                      3. Copiá el ID de pago de la URL
                      <br />
                      4. Volvé aquí e ingresalo abajo
                    </p>
                  </div>

                  <div className="flex justify-center">
                    <Wallet
                      initialization={{ preferenceId: preferenceId }}
                      customization={{
                        texts: {
                          valueProp: "security_safety",
                        },
                      }}
                    />
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => {
                      setPreferenceId(null);
                      setPaymentSuccess(false);
                    }}
                    className="w-full border-slate-300 text-slate-700 hover:bg-slate-100"
                  >
                    Modificar selección
                  </Button>
                </CardContent>
              </Card>
            )}

            <div className="border-t pt-4 space-y-3">
              <p className="text-sm text-slate-700 font-medium">
                ¿Ya completaste el pago?
              </p>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Pega aquí el payment ID"
                  className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm"
                  id="payment-id-input"
                />
                <Button
                  onClick={() => {
                    const input = document.getElementById("payment-id-input");
                    const paymentId = input?.value?.trim();

                    if (!paymentId) {
                      setPaymentError("Por favor ingresa el payment ID");
                      return;
                    }

                    procesarPagoCompleto(paymentId);
                    input.value = "";
                  }}
                  disabled={processingPayment}
                  className="bg-gradient-to-r from-rose-500 via-red-400 to-red-500 text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processingPayment ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Procesando...
                    </>
                  ) : (
                    "Confirmar pago"
                  )}
                </Button>
              </div>

              <p className="text-xs text-slate-500">
                El payment ID aparece en la parte superior acompañado de un '#'.
                Ejemplo: #1234567890
              </p>
            </div>
          </div>
        ) : null}
      </main>
      <Footer />
    </div>
  );
}
