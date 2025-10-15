import { CalendarDays, Clock3, Tag, User2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const normalizeTags = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(/[,#]/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
};

export default function ArticleMeta({ date, author, readTime, category, tags }) {
  const normalizedTags = normalizeTags(tags);

  if (!date && !author && !readTime && !category && normalizedTags.length === 0) {
    return null;
  }

  return (
    <section className="rounded-2xl border border-rose-100/60 bg-white/80 p-6 shadow-sm ring-1 ring-black/5 backdrop-blur-sm">
      {category && (
        <Badge variant="secondary" className="mb-5 w-max bg-rose-100 text-rose-700">
          {category}
        </Badge>
      )}

      <div className="flex flex-wrap items-center gap-5 text-sm text-slate-600">
        {author && (
          <span className="inline-flex items-center gap-2 font-medium text-slate-800">
            <User2 className="h-4 w-4 text-rose-500" />
            {author}
          </span>
        )}
        {date && (
          <span className="inline-flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-rose-500" />
            {date}
          </span>
        )}
        {readTime && (
          <span className="inline-flex items-center gap-2">
            <Clock3 className="h-4 w-4 text-rose-500" />
            {readTime}
          </span>
        )}
      </div>

      {normalizedTags.length > 0 && (
        <>
          <Separator className="my-5" />
          <div className="flex items-start gap-3">
            <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-rose-100 text-rose-600">
              <Tag className="h-3.5 w-3.5" />
            </span>
            <div className="flex flex-wrap gap-2">
              {normalizedTags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="border-rose-100 bg-white text-xs font-medium text-slate-700"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
