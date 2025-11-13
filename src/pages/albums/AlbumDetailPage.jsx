import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "@/components/home/Header";
import Footer from "@/components/landing/Footer";
import axios from "axios";

export default function AlbumDetailPage() {
  const { albumSlug } = useParams();
  const [album, setAlbum] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/album/${encodeURIComponent(albumSlug)}`)
      .then((res) => setAlbum(res.data.data.album))
      .catch((err) => console.error(err));
  }, [albumSlug]);

  if (!album) return <div>Cargando...</div>;

  return (
    <>
      <Header />

      <div className="p-6 max-w-4xl mx-auto">
        <img
          src={album.imagenPrincipal}
          alt={album.nombre}
          className="w-full h-80 object-cover rounded-lg mb-4"
        />

        <h1 className="text-4xl font-bold">{album.nombre}</h1>
        <p className="text-gray-600 text-lg">{album.artista}</p>

        <h2 className="text-2xl font-semibold mt-6">Canciones</h2>

        <ul className="mt-4 space-y-2">
          {album.canciones.map((song) => (
            <li key={song.titulo}>
              <Link
                to={`/album/${encodeURIComponent(
                  album.nombre
                )}/cancion/${encodeURIComponent(song.titulo)}`}
                className="text-blue-500 hover:underline text-lg"
              >
                {song.titulo}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <Footer />
    </>
  );
}
