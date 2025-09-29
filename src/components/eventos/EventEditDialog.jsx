import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { EventForm } from "./EventForm";

export function EventEditDialog({
  isOpen,
  onOpenChange,
  event,
  error,
  isSubmitting,
  onSubmitEdit,
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-red-50">
        <DialogHeader>
          <DialogTitle>Editar evento</DialogTitle>
          <DialogDescription>
            Actualiza los detalles del evento seleccionado.
          </DialogDescription>
        </DialogHeader>
        {error && <p className="text-sm text-destructive">{error}</p>}
        {event && (
          <EventForm
            initialData={event}
            onSubmit={onSubmitEdit}
            isEditing
            isSubmitting={isSubmitting}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
