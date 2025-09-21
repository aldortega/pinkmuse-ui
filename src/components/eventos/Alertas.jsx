import { useEffect } from "react";
import { toast } from "sonner";

export default function Messages({ statusMessage, listError, actionError }) {
  useEffect(() => {
    if (statusMessage) {
      toast.success(statusMessage, { duration: 3000 });
    }
  }, [statusMessage]);

  useEffect(() => {
    if (listError) {
      toast.error(listError, { duration: 4000 });
    }
  }, [listError]);

  useEffect(() => {
    if (actionError && !listError) {
      toast.error(actionError, { duration: 4000 });
    }
  }, [actionError, listError]);

  return null;
}
