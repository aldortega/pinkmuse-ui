import { Dialog, DialogContent } from "@/components/ui/dialog";

import { EventDetails } from "./EventDetails";

export function EventDetailsDialog({ event, onClose, onEdit }) {
  const handleOpenChange = (open) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={!!event} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-red-50">
        {event && <EventDetails event={event} onEdit={onEdit} />}
      </DialogContent>
    </Dialog>
  );
}
