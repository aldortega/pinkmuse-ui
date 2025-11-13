import React from "react";
import { Link } from "react-router-dom";
import AlbumSongCard from "./AlbumSongCard";

const AlbumSongList = ({ album, albumSlug }) => {
  if (!album?.canciones?.length)
    return (
      <div className="text-slate-500">No hay canciones en este álbum.</div>
    );

  return (
    <div className="mt-6">
      <h4 className="text-lg font-semibold mb-4">Canciones</h4>
      <div className="grid gap-4">
        {album.canciones.map((song) => (
          <Link
            key={song.titulo}
            to={`/album/${encodeURIComponent(
              albumSlug
            )}/cancion/${encodeURIComponent(song.titulo)}`}
            className="block"
          >
            <AlbumSongCard song={song} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AlbumSongList;
