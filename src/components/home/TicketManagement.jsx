import { Button } from "@/components/ui/button";
import { Ticket } from "lucide-react";

export function TicketManagement() {
  return (
    <section className="py-12 bg-muted/30">
      <div className="container px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-slate-800 text-balance">
              Entradas
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              Consegui tus entradas para los proximos eventos.
            </p>
            <Button className="bg-gradient-to-br from-rose-500 via-red-400 to-red-500 hover:opacity-90 text-white px-8 py-3 text-base font-medium cursor-pointer">
              <Ticket className="mr-2 h-5 w-5" />
              Ver entradas
            </Button>
          </div>

          <div className="relative">
            <img
              src="/entradas2.png"
              alt="Concert tickets"
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
