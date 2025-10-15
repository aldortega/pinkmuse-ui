import { cn } from "@/lib/utils";

export default function ArticleLayout({ header, children, sidebar }) {
  const hasSidebar = Boolean(sidebar);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-10 lg:space-y-12">
        {header && <div className="space-y-6">{header}</div>}
        <div
          className={cn(
            "gap-10",
            hasSidebar
              ? "grid lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]"
              : "flex flex-col"
          )}
        >
          <div className="flex flex-col gap-10">{children}</div>
          {hasSidebar && <aside className="flex flex-col gap-6">{sidebar}</aside>}
        </div>
      </div>
    </div>
  );
}
