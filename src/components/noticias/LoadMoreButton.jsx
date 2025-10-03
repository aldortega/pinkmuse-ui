import { Button } from "../ui/button";

export default function LoadMoreButton({ onClick }) {
  return (
    <div className="flex justify-center py-8">
      <Button
        onClick={onClick}
        className="w-full bg-[#FFE5E5] px-6 py-3 text-base font-medium text-[#E74C3C] transition-all hover:bg-[#FFD5D5] sm:w-auto"
      >
        Mostrar mas noticias
      </Button>
    </div>
  );
}
