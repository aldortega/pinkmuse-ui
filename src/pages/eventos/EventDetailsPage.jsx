import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";

import api from "@/lib/axios";

import { Header } from "@/components/home/Header";
import { EventDetails } from "@/components/eventos/EventDetails";
import { EventEditDialog } from "@/components/eventos/EventEditDialog";
import { EventsFeedback } from "@/components/eventos/EventsFeedback";
import { Card, CardContent } from "@/components/ui/card";

export default function EventDetailsPage() {
  const params = useParams();
  const navigate = useNavigate();

  const decodedIdentifier = useMemo(() => {
    const value = params?.nombreEvento ?? "";
    if (!value) {
      return "";
    }
    try {
      return decodeURIComponent(value);
    } catch {
      return value;
    }
  }, [params?.nombreEvento]);

  const apiIdentifier = useMemo(() => {
    if (!decodedIdentifier) {
      return "";
    }
    return encodeURIComponent(decodedIdentifier);
  }, [decodedIdentifier]);

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);
  const [actionError, setActionError] = useState(null);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [editError, setEditError] = useState(null);
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);

  const fetchEvent = useCallback(async () => {
    if (!apiIdentifier) {
      setEvent(null);
      setLoading(false);
      setListError("Evento no especificado.");
      return;
    }

    setLoading(true);
    setListError(null);
    try {
      const response = await api.get(`/eventos/${apiIdentifier}`);
      const data = response?.data?.data ?? null;
      if (!data) {
        setEvent(null);
        setListError("No pudimos obtener los datos del evento.");
        return;
      }
      setEvent(data);
      setListError(null);
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "No pudimos obtener la informacion del evento.";
      setListError(message);
      setEvent(null);
    } finally {
      setLoading(false);
    }
  }, [apiIdentifier]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  const resetFeedback = useCallback(() => {
    setStatusMessage(null);
    setActionError(null);
  }, []);

  const handleBack = useCallback(() => {
    navigate("/eventos");
  }, [navigate]);

  const handleEditDialogChange = useCallback((open) => {
    setIsEditDialogOpen(open);
    if (!open) {
      setEditingEvent(null);
      setEditError(null);
    }
  }, []);

  const openEditDialog = useCallback(
    (currentEvent) => {
      if (!currentEvent) {
        return;
      }
      setEditError(null);
      resetFeedback();
      setEditingEvent(currentEvent);
      setIsEditDialogOpen(true);
    },
    [resetFeedback]
  );

  const handleEditEvent = useCallback(
    async (payload) => {
      if (!event?.nombreEvento) {
        return;
      }
      setEditError(null);
      resetFeedback();
      setIsEditSubmitting(true);
      try {
        const response = await api.put(
          `/eventos/${encodeURIComponent(event.nombreEvento)}`,
          payload
        );
        const updated = response?.data?.data;
        if (updated) {
          setEvent(updated);
        } else {
          await fetchEvent();
        }
        setStatusMessage("Evento actualizado exitosamente.");
        setIsEditDialogOpen(false);
        setEditingEvent(null);
      } catch (error) {
        const responseData = error?.response?.data;
        const validationErrors = responseData?.errors;
        let detailedMessage = null;
        if (validationErrors) {
          const firstError = Object.values(validationErrors)
            .flat()
            .find(Boolean);
          detailedMessage = firstError || null;
        }
        const message =
          detailedMessage ||
          responseData?.message ||
          "No pudimos actualizar el evento.";
        setEditError(message);
      } finally {
        setIsEditSubmitting(false);
      }
    },
    [event?.nombreEvento, fetchEvent, resetFeedback]
  );

  return (
    <div>
      <Header />
      <div className="container mx-auto mt-1 px-4 py-4 space-y-6">
        <div className="grid gap-3">
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-red-400 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a eventos
          </button>
          <div>
            <p className="text-xl font-semibold text-slate-800">
              Detalle del evento
            </p>
          </div>
        </div>

        <EventsFeedback
          statusMessage={statusMessage}
          listError={listError}
          actionError={actionError}
        />

        {loading && (
          <Card className="bg-red-50">
            <CardContent className="flex flex-col items-center gap-3 py-12">
              <Loader2 className="h-6 w-6 animate-spin text-red-400" />
              <p className="text-slate-700">
                Cargando informacion del evento...
              </p>
            </CardContent>
          </Card>
        )}

        {!loading && !event && !listError && (
          <Card className="bg-red-50">
            <CardContent className="py-12 text-center space-y-3">
              <p className="text-lg font-semibold text-slate-800">
                No encontramos informacion para este evento.
              </p>
              <p className="text-slate-600">
                Revisa que el enlace sea correcto o vuelve al listado para
                seleccionar otro evento.
              </p>
              <button
                type="button"
                onClick={handleBack}
                className="text-sm font-medium text-red-500 hover:text-red-600"
              >
                Volver a eventos
              </button>
            </CardContent>
          </Card>
        )}

        {event && (
          <Card className="bg-red-50">
            <CardContent className="space-y-6 p-6">
              <EventDetails event={event} onEdit={openEditDialog} />
            </CardContent>
          </Card>
        )}
      </div>

      <EventEditDialog
        isOpen={isEditDialogOpen}
        onOpenChange={handleEditDialogChange}
        event={editingEvent}
        error={editError}
        isSubmitting={isEditSubmitting}
        onSubmitEdit={handleEditEvent}
      />
    </div>
  );
}
