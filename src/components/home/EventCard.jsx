import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";

export function EventCard({ title, date, image }) {
  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer bg-red-50">
      <div className="aspect-video relative overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg text-slate-800 mb-2 text-balance">
          {title}
        </h3>
        <div className="flex items-center text-slate-600 text-sm">
          <Calendar className="h-4 w-4 mr-2" />
          {date}
        </div>
      </CardContent>
    </Card>
  );
}
