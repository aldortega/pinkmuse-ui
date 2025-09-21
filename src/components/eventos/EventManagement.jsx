import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Calendar,
  Clock,
  Plus,
  Music,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import api from "@/lib/axios";
import { EventCard } from "./EventCard";
import { EventDetails } from "./EventDetails";
import { EventForm } from "./EventForm";

const getEventKey = (event) => event?._id ?? event?.id ?? event?.nombreEvento;

const parseDate = (value) => {
  if (!value) {
    return null;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export function EventsManagement() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const [isCreateSubmitting, setIsCreateSubmitting] = useState(false);
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);
  const [deletingKey, setDeletingKey] = useState(null);
  const [createError, setCreateError] = useState(null);
  const [editError, setEditError] = useState(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setListError(null);
    try {
      const response = await api.get("/eventos");
      const fetched = Array.isArray(response?.data?.data)
        ? response.data.data
        : [];
      setEvents(fetched);
    } catch (err) {
      const message =
        err?.response?.data?.message || "No pudimos obtener los eventos.";
      setListError(message);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const { upcomingEvents, pastEvents } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcoming = [];
    const past = [];

    events.forEach((event) => {
      const eventDate = parseDate(event?.fecha);
      if (eventDate && eventDate < today) {
        past.push(event);
      } else {
        upcoming.push(event);
      }
    });

    const sortAsc = (a, b) => {
      const dateA = parseDate(a?.fecha);
      const dateB = parseDate(b?.fecha);
      if (!dateA && !dateB) {
        return 0;
      }
      if (!dateA) {
        return 1;
      }
      if (!dateB) {
        return -1;
      }
      return dateA.getTime() - dateB.getTime();
    };

    const sortDesc = (a, b) => -sortAsc(a, b);

    return {
      upcomingEvents: [...upcoming].sort(sortAsc),
      pastEvents: [...past].sort(sortDesc),
    };
  }, [events]);

  const resetFeedback = () => {
    setStatusMessage(null);
    setActionError(null);
  };

  const handleCreateDialogChange = (open) => {
    setIsCreateDialogOpen(open);
    if (!open) {
      setCreateError(null);
    }
  };

  const handleEditDialogChange = (open) => {
    setIsEditDialogOpen(open);
    if (!open) {
      setEditingEvent(null);
      setEditError(null);
    }
  };

  const handleCreateEvent = async (payload) => {
    setCreateError(null);
    resetFeedback();
    setIsCreateSubmitting(true);

    console.log("POST /eventos payload:", payload);

    try {
      const response = await api.post("/eventos", payload);
      const created = response?.data?.data;
      if (created) {
        setEvents((prev) => [...prev, created]);
      } else {
        await fetchEvents();
      }
      setStatusMessage("Evento creado exitosamente.");
      setIsCreateDialogOpen(false);
    } catch (err) {
      console.error(
        "Error recibido al crear evento:",
        err?.response?.data || err
      );
      const responseData = err?.response?.data;
      const validationErrors = responseData?.errors;
      let detailedMessage = null;
      if (validationErrors) {
        const firstError = Object.values(validationErrors).flat().find(Boolean);
        detailedMessage = firstError || null;
      }
      const message =
        detailedMessage ||
        responseData?.message ||
        "No pudimos crear el evento.";
      setCreateError(message);
    } finally {
      setIsCreateSubmitting(false);
    }
  };

  const handleEditEvent = async (payload) => {
    if (!editingEvent) {
      return;
    }
    setEditError(null);
    resetFeedback();
    setIsEditSubmitting(true);
    const identifier = editingEvent.nombreEvento;

    console.log("PUT /eventos payload:", identifier, payload);

    try {
      const response = await api.put(
        `/eventos/${encodeURIComponent(identifier)}`,
        payload
      );
      const updated = response?.data?.data;
      if (updated) {
        setEvents((prev) =>
          prev.map((event) =>
            getEventKey(event) === getEventKey(updated)
              ? updated
              : event.nombreEvento === updated.nombreEvento
              ? updated
              : event
          )
        );
        setSelectedEvent((current) =>
          current &&
          (getEventKey(current) === getEventKey(updated) ||
            current.nombreEvento === updated.nombreEvento)
            ? updated
            : current
        );
      } else {
        await fetchEvents();
      }
      setStatusMessage("Evento actualizado exitosamente.");
      setIsEditDialogOpen(false);
      setEditingEvent(null);
    } catch (err) {
      console.error(
        "Error recibido al actualizar evento:",
        err?.response?.data || err
      );
      const responseData = err?.response?.data;
      const validationErrors = responseData?.errors;
      let detailedMessage = null;
      if (validationErrors) {
        const firstError = Object.values(validationErrors).flat().find(Boolean);
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
  };

  const handleDeleteEvent = async (event) => {
    const identifier = event?.nombreEvento;
    if (!identifier) {
      return;
    }
    resetFeedback();
    const key = getEventKey(event);
    setDeletingKey(key);
    try {
      await api.delete(`/eventos/${encodeURIComponent(identifier)}`);
      setEvents((prev) =>
        prev.filter((item) => item.nombreEvento !== identifier)
      );
      setSelectedEvent((current) =>
        current && current.nombreEvento === identifier ? null : current
      );
      setStatusMessage("Evento eliminado exitosamente.");
    } catch (err) {
      const message =
        err?.response?.data?.message || "No pudimos eliminar el evento.";
      setActionError(message);
    } finally {
      setDeletingKey(null);
    }
  };

  const openCreateDialog = () => {
    setCreateError(null);
    resetFeedback();
    setIsCreateDialogOpen(true);
  };

  const openEditDialog = (event) => {
    setEditError(null);
    resetFeedback();
    setEditingEvent(event);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-red-100">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-rose-500 via-red-400 to-red-500 rounded-lg">
            <Music className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Gestion de eventos
            </h1>
            <p className="text-slate-700">
              Administra fechas, ubicaciones y disponibilidad de entradas.
            </p>
          </div>
        </div>
        <Dialog
          open={isCreateDialogOpen}
          onOpenChange={handleCreateDialogChange}
        >
          <DialogTrigger asChild>
            <Button
              onClick={openCreateDialog}
              className="gap-2  bg-gradient-to-br from-rose-500 via-red-400 to-red-500 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Crear evento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-scroll no-scrollbar">
            <DialogHeader>
              <DialogTitle>Crea un nuevo evento</DialogTitle>
              <DialogDescription>
                Anade un nuevo evento a tu agenda. Completa todos los datos a
                continuacion.
              </DialogDescription>
            </DialogHeader>
            {createError && (
              <p className="text-sm text-destructive">{createError}</p>
            )}
            <EventForm
              onSubmit={handleCreateEvent}
              isSubmitting={isCreateSubmitting}
            />
          </DialogContent>
        </Dialog>
      </div>

      {(statusMessage || listError || actionError) && (
        <div className="space-y-2 mb-6">
          {statusMessage && (
            <Alert className="border-emerald-200 bg-emerald-50">
              <CheckCircle className="h-4 w-4 text-emerald-700" />
              <AlertTitle className="text-emerald-700">
                {statusMessage}
              </AlertTitle>
            </Alert>
          )}

          {listError && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>{listError}</AlertTitle>
            </Alert>
          )}

          {actionError && !listError && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>{actionError}</AlertTitle>
            </Alert>
          )}
        </div>
      )}

      <Tabs defaultValue="upcoming" className="space-y-6 ">
        <TabsList className="grid w-full grid-cols-2 max-w-md bg-red-200  ">
          <TabsTrigger
            value="upcoming"
            className="gap-2 text-slate-800 data-[state=active]:bg-red-50"
          >
            <Calendar className="h-4 w-4" />
            Proximos ({upcomingEvents.length})
          </TabsTrigger>
          <TabsTrigger
            value="past"
            className="gap-2 text-slate-800 data-[state=active]:bg-red-50"
          >
            <Clock className="h-4 w-4" />
            Pasados ({pastEvents.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {loading ? (
            <Card className="text-center py-12 bg-red-100">
              <CardContent>
                <p className="text-slate-700">Cargando eventos...</p>
              </CardContent>
            </Card>
          ) : upcomingEvents.length === 0 ? (
            <Card className="text-center py-12 bg-red-100">
              <CardContent>
                <Music className="h-12 w-12 text-slate-700 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-slate-800">
                  No hay proximos eventos
                </h3>
                <p className="text-slate-700 mb-4 ">Crea tu primer evento.</p>
                <Button
                  onClick={openCreateDialog}
                  className="gap-2 bg-gradient-to-br from-rose-500 via-red-400 to-red-500 "
                >
                  <Plus className="h-4 w-4" />
                  Crear evento
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {upcomingEvents.map((event) => (
                <EventCard
                  key={getEventKey(event)}
                  event={event}
                  onView={setSelectedEvent}
                  onEdit={openEditDialog}
                  onDelete={handleDeleteEvent}
                  isDeleting={deletingKey === getEventKey(event)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {loading ? (
            <Card className="text-center py-12 bg-red-100">
              <CardContent>
                <p className="text-slate-700">Cargando eventos...</p>
              </CardContent>
            </Card>
          ) : pastEvents.length === 0 ? (
            <Card className="text-center py-12 bg-red-100">
              <CardContent>
                <Clock className="h-12 w-12 mx-auto mb-4 text-slate-700" />
                <h3 className="text-lg font-semibold mb-2 text-slate-800">
                  No hay eventos pasados
                </h3>
                <p className="text-slate-700">
                  Tu historial de eventos aparecera aqui.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pastEvents.map((event) => (
                <EventCard
                  key={getEventKey(event)}
                  event={event}
                  onView={setSelectedEvent}
                  onEdit={openEditDialog}
                  onDelete={handleDeleteEvent}
                  isDeleting={deletingKey === getEventKey(event)}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog
        open={!!selectedEvent}
        onOpenChange={() => setSelectedEvent(null)}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedEvent && (
            <EventDetails event={selectedEvent} onEdit={openEditDialog} />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={handleEditDialogChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar evento</DialogTitle>
            <DialogDescription>
              Actualiza los detalles del evento seleccionado.
            </DialogDescription>
          </DialogHeader>
          {editError && <p className="text-sm text-destructive">{editError}</p>}
          {editingEvent && (
            <EventForm
              initialData={editingEvent}
              onSubmit={handleEditEvent}
              isEditing
              isSubmitting={isEditSubmitting}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
