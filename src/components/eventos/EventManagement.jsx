import { useCallback, useEffect, useMemo, useState } from "react";

import api from "@/lib/axios";
import { useNavigate } from "react-router-dom";

import { Header } from "../home/Header";
import { EventCategoryTabs } from "./EventCategoryTabs";
import { EventEditDialog } from "./EventEditDialog";
import { EventManagementHeader } from "./EventManagementHeader";
import { EventsFeedback } from "./EventsFeedback";
import { getEventKey, splitEventsByDate } from "./eventManagement.utils";

export function EventsManagement() {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);

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

  const { upcomingEvents, pastEvents } = useMemo(
    () => splitEventsByDate(events),
    [events]
  );

  const resetFeedback = () => {
    setStatusMessage(null);
    setActionError(null);
  };

  const handleViewEvent = useCallback(
    (event) => {
      const identifier = event?.nombreEvento;
      if (!identifier) {
        return;
      }
      navigate(`/eventos/${encodeURIComponent(identifier)}`);
    },
    [navigate]
  );

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
          prev.map((event) => {
            const eventKey = getEventKey(event);
            const updatedKey = getEventKey(updated);
            if (eventKey === updatedKey) {
              return updated;
            }
            if (event.nombreEvento === updated.nombreEvento) {
              return updated;
            }
            return event;
          })
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
    <div>
      <Header />

      <div className="container mx-auto mt-1 px-4 py-4 ">
        <EventManagementHeader
          isCreateDialogOpen={isCreateDialogOpen}
          onCreateDialogChange={handleCreateDialogChange}
          onOpenCreate={openCreateDialog}
          onSubmitCreate={handleCreateEvent}
          isCreateSubmitting={isCreateSubmitting}
          createError={createError}
        />

        <EventsFeedback
          statusMessage={statusMessage}
          listError={listError}
          actionError={actionError}
        />

        <EventCategoryTabs
          upcomingEvents={upcomingEvents}
          pastEvents={pastEvents}
          loading={loading}
          onOpenCreate={openCreateDialog}
          onViewEvent={handleViewEvent}
          onEditEvent={openEditDialog}
          onDeleteEvent={handleDeleteEvent}
          deletingKey={deletingKey}
        />

        <EventEditDialog
          isOpen={isEditDialogOpen}
          onOpenChange={handleEditDialogChange}
          event={editingEvent}
          error={editError}
          isSubmitting={isEditSubmitting}
          onSubmitEdit={handleEditEvent}
        />
      </div>
    </div>
  );
}
