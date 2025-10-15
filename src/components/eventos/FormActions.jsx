import { Button } from "../ui/button";

export default function FormActions({ submitLabel, isSubmitting }) {
  return (
    <div className="flex gap-3 pt-4">
      <Button
        type="submit"
        size="lg"
        className="flex-1"
        disabled={isSubmitting}
      >
        {submitLabel}
      </Button>
    </div>
  );
}
