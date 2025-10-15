import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "@/lib/axios";
import { Header } from "../home/Header";
import { EventCategoryTabs } from "./EventCategoryTabs";
import { EventEditDialog } from "./EventEditDialog";
import { EventManagementHeader } from "./EventManagementHeader";
import { EventsFeedback } from "./EventsFeedback";
import { getEventKey, splitEventsByDate } from "./eventManagement.utils";
import { useEvents } from "@/contexts/EventContext";

export function EventsManagement() {
  const navigate = useNavigate();
  const {
    events,
    loading: eventsLoading,
    error: eventsError,
    refetch,
    upsertEvent,
    removeEvent,
  } = useEvents();

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

  const { upcomingEvents, pastEvents } = useMemo(
    () => splitEventsByDate(events),
    [events]
  );

  const resetFeedback = useCallback(() => {
    setStatusMessage(null);
    setActionError(null);
  }, []);

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

    try {
      const response = await api.post("/eventos", payload);
      const created = response?.data?.data;
      if (created) {
        upsertEvent(created);
      } else {
        await refetch();
      }
      setStatusMessage("Evento creado exitosamente.");
      setIsCreateDialogOpen(false);
    } catch (err) {
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
    const identifier = editingEvent?.nombreEvento;
    if (!identifier) {
      return;
    }
    setEditError(null);
    resetFeedback();
    setIsEditSubmitting(true);

    try {
      const response = await api.put(
        `/eventos/${encodeURIComponent(identifier)}`,
        payload
      );
      const updated = response?.data?.data;
      if (updated) {
        upsertEvent(updated);
        setEditingEvent(updated);
      } else {
        await refetch();
      }
      setStatusMessage("Evento actualizado exitosamente.");
      setIsEditDialogOpen(false);
      setEditingEvent(null);
    } catch (err) {
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
      removeEvent(event);
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
          listError={eventsError}
          actionError={actionError}
        />

        <EventCategoryTabs
          upcomingEvents={upcomingEvents}
          pastEvents={pastEvents}
          loading={eventsLoading}
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
