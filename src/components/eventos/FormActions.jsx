import { Button } from "../ui/button";

export default function FormActions({ submitLabel, isSubmitting }) {
  return (
    <div className="flex gap-3 pt-4">
      <Button
        type="submit"
        className="flex-1 cursor-pointer bg-gradient-to-br from-rose-500 via-red-400 to-red-500"
        disabled={isSubmitting}
      >
        {submitLabel}
      </Button>
    </div>
  );
}
