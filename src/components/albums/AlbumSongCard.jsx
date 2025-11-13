import React from "react";

const AlbumSongCard = ({ song }) => {
  if (!song) return null;
  return (
    <div className="bg-white/90 rounded-2xl shadow-sm p-4 flex items-center gap-4 hover:shadow-md transition">
      <img
        src={song.imagenPrincipal}
        alt={song.titulo}
        className="w-16 h-16 object-cover rounded-xl"
      />
      <div>
        <h5 className="text-base font-bold mb-1">{song.titulo}</h5>
        {song.feat && (
          <p className="text-xs text-slate-500">feat. {song.feat}</p>
        )}
      </div>
    </div>
  );
};

export default AlbumSongCard;
