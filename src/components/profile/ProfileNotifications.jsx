import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export default function ProfileNotifications({
  preferencesError,
  preferencesMessage,
  preferencesSaving,
  notificationOptions,
  preferences,
  handleTogglePreference,
  notificationSummary,
}) {
  return (
    <div className="space-y-4">
      {preferencesError ? (
        <div className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
          <AlertCircle className="mt-0.5 h-4 w-4" />
          <span>{preferencesError}</span>
        </div>
      ) : null}
      {preferencesMessage ? (
        <div className="flex items-start gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-600">
          <CheckCircle2 className="mt-0.5 h-4 w-4" />
          <span>{preferencesMessage}</span>
        </div>
      ) : null}
      {preferencesSaving ? (
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin text-rose-400" />
          Guardando tus preferencias...
        </div>
      ) : null}
      <div className="space-y-3">
        {notificationOptions.map((option) => (
          <div
            key={option.value}
            className="flex items-start justify-between gap-4 rounded-xl border border-red-100 bg-red-50/60 px-4 py-3"
          >
            <div className="space-y-1 pr-2">
              <p className="text-sm font-semibold text-slate-800">
                {option.label}
              </p>
              <p className="text-xs text-slate-600">{option.description}</p>
            </div>
            <Switch
              checked={preferences.includes(option.value)}
              onCheckedChange={() => handleTogglePreference(option.value)}
              disabled={preferencesSaving}
              aria-label={`Activar notificaciones de ${option.label}`}
            />
          </div>
        ))}
      </div>
      <p className="text-xs text-slate-500">{notificationSummary}</p>
    </div>
  );
}
