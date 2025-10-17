import { CalendarDays, Clock3, Tag, User2 } from "lucide-react";
import { cn } from "@/lib/utils";

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

export default function ArticleMeta({
  date,
  author,
  readTime,
  category,
  tags,
  menu,
  className,
}) {
  const normalizedTags = normalizeTags(tags);

  if (
    !date &&
    !author &&
    !readTime &&
    !category &&
    normalizedTags.length === 0
  ) {
    return null;
  }

  return (
    <section
      className={cn(
        "rounded-2xl border border-red-100/60 bg-white/80 p-6 shadow-sm ring-1 ring-black/5 backdrop-blur-sm",
        className
      )}
    >
      {category && (
        <div className="mb-5 flex items-start justify-between">
          <Badge
            variant="secondary"
            className="w-max bg-rose-100 text-red-600"
          >
            {category}
          </Badge>
          {menu}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-5 text-sm text-slate-600">
        <div className="flex flex-wrap items-center gap-5">
          {author && (
            <span className="inline-flex items-center gap-2 ">
              <User2 className="h-4 w-4 text-red-400" />
              {author}
            </span>
          )}
          {date && (
            <span className="inline-flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-red-400" />
              {date}
            </span>
          )}
          {readTime && (
            <span className="inline-flex items-center gap-2">
              <Clock3 className="h-4 w-4 text-red-400" />
              {readTime}
            </span>
          )}
        </div>
        {!category && menu}
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
