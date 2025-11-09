import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MERCH_CATEGORIES } from "@/lib/merch";

export default function ProductInformation({ formState, updateFormField, fieldErrors, isEditMode, primaryImage, handlePrimaryImageChange }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-800">Informacion general</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre del producto</Label>
          <Input
            id="nombre"
            value={formState.nombre}
            onChange={(event) => updateFormField("nombre", event.target.value)}
            placeholder="Ej. Remera Logo PinkMuse"
            aria-invalid={Boolean(fieldErrors.nombre)}
            disabled={isEditMode}
          />
          {fieldErrors.nombre ? (
            <p className="text-xs text-red-500">{fieldErrors.nombre}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="resumen">Resumen</Label>
          <Input
            id="resumen"
            value={formState.resumen}
            onChange={(event) => updateFormField("resumen", event.target.value)}
            placeholder="Breve descripcion que verá el listado"
          />
        </div>
        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="descripcion">Descripcion detallada</Label>
          <Textarea
            id="descripcion"
            value={formState.descripcion}
            onChange={(event) => updateFormField("descripcion", event.target.value)}
            rows={5}
            placeholder="Describe materiales, cuidados y detalles relevantes."
            aria-invalid={Boolean(fieldErrors.descripcion)}
          />
          {fieldErrors.descripcion ? (
            <p className="text-xs text-red-500">{fieldErrors.descripcion}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="categoria">Categoria</Label>
          <select
            id="categoria"
            value={formState.categoria}
            onChange={(event) => updateFormField("categoria", event.target.value)}
            className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-200"
          >
            <option value="">Selecciona una categoria</option>
            {MERCH_CATEGORIES.map((category) => (
              <option key={category.id} value={category.id}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="tipo">Tipo</Label>
          <Input
            id="tipo"
            value={formState.tipo}
            onChange={(event) => updateFormField("tipo", event.target.value)}
            placeholder="Ej. remera, buzo"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="precio">Precio (ARS)</Label>
          <Input
            id="precio"
            value={formState.precio}
            onChange={(event) => updateFormField("precio", event.target.value)}
            placeholder="Ej. 29999"
            aria-invalid={Boolean(fieldErrors.precio)}
          />
          {fieldErrors.precio ? (
            <p className="text-xs text-red-500">{fieldErrors.precio}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="estado">Estado</Label>
          <select
            id="estado"
            value={formState.estado}
            onChange={(event) => updateFormField("estado", event.target.value)}
            className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-200"
          >
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </div>
        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="etiquetas">Etiquetas</Label>
          <Input
            id="etiquetas"
            value={formState.etiquetas}
            onChange={(event) => updateFormField("etiquetas", event.target.value)}
            placeholder="Separadas por coma (ej. limitado, unisex)"
          />
        </div>
        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="imagenPrincipal">Imagen principal</Label>
          <Input
            id="imagenPrincipal"
            type="file"
            accept="image/*"
            onChange={handlePrimaryImageChange}
            aria-invalid={Boolean(fieldErrors.imagenPrincipal)}
          />
          {primaryImage ? (
            <p className="text-xs text-slate-500">Archivo seleccionado: {primaryImage.name}</p>
          ) : isEditMode ? (
            <p className="text-xs text-slate-500">
              Si no cargas una nueva imagen, se conservara la actual.
            </p>
          ) : null}
          {fieldErrors.imagenPrincipal ? (
            <p className="text-xs text-red-500">{fieldErrors.imagenPrincipal}</p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
