import { useCallback, useMemo, useState } from "react";
import { Link2 } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function ArticleShareBar({ url }) {
  const [copied, setCopied] = useState(false);

  const shareUrl = useMemo(() => {
    if (url) return url;
    if (typeof window !== "undefined") return window.location.href;
    return "";
  }, [url]);

  const handleCopy = useCallback(async () => {
    if (!shareUrl) return;

    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return;
    }

    if (typeof window !== "undefined") {
      window.prompt("Copia el enlace para compartir:", shareUrl);
    }
  }, [shareUrl]);

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-rose-100/60 bg-white/90 p-4 shadow-sm ring-1 ring-black/5 backdrop-blur-sm sm:p-6">
      <div className="max-w-md">
        <p className="text-sm font-medium text-slate-800">
          Comparte esta noticia
        </p>
        <p className="text-xs text-slate-500">
          Copia el enlace y compartelo con tu comunidad.
        </p>
        {copied && (
          <span className="mt-2 inline-block text-xs font-medium text-emerald-600">
            Enlace copiado al portapapeles
          </span>
        )}
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleCopy}
        className="gap-2 text-slate-800 hover:text-slate-800 cursor-pointer"
      >
        <Link2 className="h-4 w-4" />
        Copiar enlace
      </Button>
    </div>
  );
}
