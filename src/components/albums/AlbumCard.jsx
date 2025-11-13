import React from "react";

const AlbumCard = ({ album, destacado }) => {
  if (!album) return null;
  return (
    <div
      className={`bg-white/90 rounded-3xl shadow-sm p-6 flex flex-col items-center ${
        destacado ? "border-2 border-rose-400" : ""
      }`}
    >
      <img
        src={album.imagenPrincipal}
        alt={album.nombre}
        className="w-full h-48 object-cover rounded-2xl mb-4"
      />
      <h3 className="text-xl font-bold mb-1">{album.nombre}</h3>
      <p className="text-slate-600 mb-1">{album.artista}</p>
      <p className="text-sm text-slate-500">
        {new Date(album.fecha).toLocaleDateString()}
      </p>
    </div>
  );
};

export default AlbumCard;
