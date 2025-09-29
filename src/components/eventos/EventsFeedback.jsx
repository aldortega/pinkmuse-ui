import { Alert, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, AlertTriangle } from "lucide-react";

export function EventsFeedback({ statusMessage, listError, actionError }) {
  if (!statusMessage && !listError && !actionError) {
    return null;
  }

  return (
    <div className="space-y-2 mb-6">
      {statusMessage && (
        <Alert className="border-emerald-200 bg-emerald-50">
          <CheckCircle className="h-4 w-4 text-emerald-700" />
          <AlertTitle className="text-emerald-700">{statusMessage}</AlertTitle>
        </Alert>
      )}

      {listError && (
        <Alert variant="destructive" className="bg-red-200">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>{listError}</AlertTitle>
        </Alert>
      )}

      {!listError && actionError && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>{actionError}</AlertTitle>
        </Alert>
      )}
    </div>
  );
}
