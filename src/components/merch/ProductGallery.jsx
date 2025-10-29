import { useState } from "react";
import { getGalleryImages } from "@/lib/merch";

export default function ProductGallery({ product }) {
  const images = getGalleryImages(product);
  const [activeImage, setActiveImage] = useState(images[0]);

  if (images.length === 0) {
    return (
      <div className="aspect-square rounded-2xl bg-slate-100" aria-hidden="true" />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-slate-100">
        <img
          src={activeImage}
          alt={product?.nombre}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
        {images.map((image) => {
          const isActive = image === activeImage;
          return (
            <button
              key={image}
              type="button"
              onClick={() => setActiveImage(image)}
              className={`overflow-hidden rounded-xl border bg-white transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 ${
                isActive ? "border-red-400 ring-2 ring-red-200" : "border-slate-200"
              }`}
            >
              <img
                src={image}
                alt=""
                className="aspect-square w-full object-cover"
              />
              <span className="sr-only">Seleccionar imagen</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
