import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CalendarDays, Plus } from "lucide-react";

import { EventForm } from "./EventForm";

export function EventManagementHeader({
  isCreateDialogOpen,
  onCreateDialogChange,
  onOpenCreate,
  onSubmitCreate,
  isCreateSubmitting,
  createError,
}) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-to-br from-rose-500 via-red-400 to-red-500 rounded-lg">
          <CalendarDays className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Gestion de eventos</h1>
          <p className="text-slate-700">
            Administra fechas, ubicaciones y disponibilidad de entradas.
          </p>
        </div>
      </div>

      <Dialog open={isCreateDialogOpen} onOpenChange={onCreateDialogChange}>
        <DialogTrigger asChild>
          <Button
            onClick={onOpenCreate}
            className="gap-2 bg-gradient-to-br from-rose-500 via-red-400 to-red-500 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Crear evento
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-scroll no-scrollbar bg-red-50">
          <DialogHeader>
            <DialogTitle className="text-slate-800">Crea un nuevo evento</DialogTitle>
            <DialogDescription className="text-slate-600">
              Anade un nuevo evento a tu agenda. Completa todos los datos a continuacion.
            </DialogDescription>
          </DialogHeader>
          {createError && <p className="text-sm text-destructive">{createError}</p>}
          <EventForm onSubmit={onSubmitCreate} isSubmitting={isCreateSubmitting} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
