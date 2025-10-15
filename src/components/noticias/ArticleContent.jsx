import { cn } from "@/lib/utils";

export default function ArticleContent({ children, className, contentClassName }) {
  return (
    <article className={cn("mx-auto max-w-none px-1 sm:px-0", className)}>
      <div
        className={cn(
          "space-y-5 text-base leading-relaxed text-gray-800 sm:space-y-6 sm:text-lg",
          contentClassName
        )}
      >
        {children}
      </div>
    </article>
  );
}
