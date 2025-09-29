import { Label } from "../ui/label";
import { Input } from "../ui/input";

export default function AddressSection({ direccion, onFieldChange }) {
  return (
    <section className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-800">
        Direccion (opcional)
      </h3>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label className="text-slate-800" htmlFor="direccionCalle">
            Calle
          </Label>
          <Input
            id="direccionCalle"
            value={direccion.calle}
            onChange={(e) => onFieldChange("calle", e.target.value)}
            placeholder="Av. Principal"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-slate-800" htmlFor="direccionNumero">
            Numero
          </Label>
          <Input
            id="direccionNumero"
            type="number"
            min="0"
            value={direccion.numero}
            onChange={(e) => onFieldChange("numero", e.target.value)}
            placeholder="123"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-slate-800" htmlFor="direccionCiudad">
            Ciudad
          </Label>
          <Input
            id="direccionCiudad"
            value={direccion.ciudad}
            onChange={(e) => onFieldChange("ciudad", e.target.value)}
            placeholder="Buenos Aires"
          />
        </div>
      </div>
    </section>
  );
}
