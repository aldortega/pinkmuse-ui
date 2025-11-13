import React from "react";
import AlbumCard from "./AlbumCard";
import { Link } from "react-router-dom";

const AlbumGrid = ({ albums }) => {
  if (!albums?.length) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
      {albums.map((album) => (
        <Link
          key={album.nombre}
          to={`/album/${encodeURIComponent(album.nombre)}`}
          className="block hover:scale-[1.03] transition-transform"
        >
          <AlbumCard album={album} />
        </Link>
      ))}
    </div>
  );
};

export default AlbumGrid;
