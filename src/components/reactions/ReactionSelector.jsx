import { useEffect, useMemo } from "react";

import { useReactions } from "@/contexts/ReactionsContext";
import { cn } from "@/lib/utils";

const VARIANTS = {
  default: {
    container: "flex flex-wrap gap-3",
    button:
      "flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/70",
    emoji: "text-lg",
    count: "text-xs font-semibold text-slate-500",
  },
  compact: {
    container: "flex flex-wrap items-center gap-2",
    button:
      "flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/70",
    emoji: "text-base leading-none",
    count: "text-[11px] font-semibold text-slate-500",
  },
};

const buildDisabledMessage = ({ canReact, disabled, disabledReason }) => {
  if (disabled && disabledReason) {
    return disabledReason;
  }

  if (!canReact) {
    return "Debes iniciar sesion para reaccionar.";
  }

  return "";
};

export default function ReactionSelector({
  referenceId,
  referenceType,
  variant = "default",
  disabled = false,
  disabledReason = "",
  className,
  hideZeroCounts = false,
  showTotal = true,
  initialSummary = null,
  onReactionChange,
}) {
  const {
    reactionTypes,
    getSummary,
    fetchSummary,
    primeSummary,
    toggleReaction,
    isProcessing,
    canReact,
  } = useReactions();

  const summary = getSummary(referenceType, referenceId);
  const processing = isProcessing(referenceType, referenceId);

  useEffect(() => {
    if (!referenceId || !referenceType || !initialSummary) {
      return;
    }

    if (summary.lastFetchedAt) {
      return;
    }

    primeSummary(referenceType, referenceId, initialSummary);
  }, [
    initialSummary,
    primeSummary,
    referenceId,
    referenceType,
    summary.lastFetchedAt,
  ]);

  useEffect(() => {
    if (!referenceId || !referenceType) {
      return;
    }

    if (summary.lastFetchedAt) {
      return;
    }

    fetchSummary(referenceType, referenceId).catch(() => {
      // Errores manejados por el contexto.
    });
  }, [fetchSummary, referenceId, referenceType, summary.lastFetchedAt]);

  const variantStyles = VARIANTS[variant] ?? VARIANTS.default;

  const busy = Boolean(processing);
  const cannotInteract = disabled || !canReact;
  const effectiveDisabled = cannotInteract || busy;

  const message = useMemo(
    () => buildDisabledMessage({ canReact, disabled, disabledReason }),
    [canReact, disabled, disabledReason]
  );

  const handleReaction = async (reactionValue) => {
    if (!reactionValue || effectiveDisabled || !referenceId) {
      return;
    }

    try {
      const result = await toggleReaction({
        type: referenceType,
        referenceId,
        reaction: reactionValue,
      });

      if (typeof onReactionChange === "function") {
        onReactionChange(result);
      }
    } catch {
      // El contexto ya refleja el error en summary.error.
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      {showTotal ? (
        <div className="flex items-center justify-between text-xs font-medium text-slate-500">
          <span>Total de reacciones</span>
          <span className="text-sm font-semibold text-slate-700">
            {summary.total}
          </span>
        </div>
      ) : null}

      <div className={variantStyles.container}>
        {reactionTypes.map((reaction) => {
          const count = summary.counts?.[reaction.value] ?? 0;
          const displayCount = hideZeroCounts && count === 0 ? "" : count;
          const isActive = summary.userReaction === reaction.value;

          return (
            <button
              key={reaction.value}
              type="button"
              onClick={() => handleReaction(reaction.value)}
              disabled={effectiveDisabled}
              className={cn(
                variantStyles.button,
                isActive
                  ? "border-red-300 bg-red-50 text-red-500 shadow-sm"
                  : "border-slate-200 bg-white text-slate-600 hover:border-red-200 hover:text-red-600",
                effectiveDisabled && !isActive
                  ? "cursor-not-allowed opacity-60"
                  : "cursor-pointer"
              )}
            >
              <span className={cn(variantStyles.emoji)}>{reaction.emoji}</span>
              {variant === "compact" ? (
                <span className="sr-only">{reaction.label}</span>
              ) : (
                <span
                  className={cn(
                    "text-sm font-medium",
                    isActive ? "text-red-400" : "text-slate-600"
                  )}
                >
                  {reaction.label}
                </span>
              )}
              <span className={variantStyles.count}>{displayCount}</span>
            </button>
          );
        })}
      </div>

      {summary.error || (variant === "default" && message) ? (
        <p className="text-xs text-red-600">
          {summary.error || (variant === "default" ? message : "")}
        </p>
      ) : null}
    </div>
  );
}
