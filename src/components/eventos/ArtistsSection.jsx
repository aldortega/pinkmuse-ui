import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

export default function ArtistsSection({ value, onChange }) {
  return (
    <section className="space-y-2">
      <Label className="text-slate-800" htmlFor="artistasExtras">
        Artistas invitados (uno por linea)
      </Label>
      <Textarea
        className="text-slate-800"
        id="artistasExtras"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={"Artista 1\nArtista 2"}
        rows={3}
      />
    </section>
  );
}
