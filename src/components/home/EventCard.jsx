import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export function EventCard({ title, date, time, location, image, slug }) {
  const cardContent = (
    <Card
      className={`group h-full overflow-hidden bg-red-50 transition-all duration-300 ${
        slug ? "hover:shadow-lg" : ""
      }`}
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={image}
          alt={title}
          className={`h-full w-full object-cover transition-transform duration-300 ${
            slug ? "group-hover:scale-105" : ""
          }`}
        />
      </div>
      <CardContent className="space-y-3 p-4">
        <h3 className="mb-2 text-balance text-lg font-semibold text-slate-800">
          {title}
        </h3>
        <div className="space-y-2 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{date}</span>
          </div>
          {time && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{time}</span>
            </div>
          )}
          {location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span className="truncate" title={location}>
                {location}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (slug) {
    return (
      <Link to={`/eventos/${slug}`} className="block h-full">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}
