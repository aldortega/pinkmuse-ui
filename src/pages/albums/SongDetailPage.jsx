import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "@/components/home/Header";
import Footer from "@/components/landing/Footer";

export default function SongDetailPage() {
  const { albumSlug, songSlug } = useParams();
  const [song, setSong] = useState(null);

  useEffect(() => {
    axios
      .get(
        `http://localhost:8000/api/album/${encodeURIComponent(
          albumSlug
        )}/cancion/${encodeURIComponent(songSlug)}`
      )
      .then((res) => {
        setSong(res.data.data.cancion);
      })
      .catch((err) => console.error(err));
  }, [albumSlug, songSlug]);

  if (!song) return <div>Cargando canción...</div>;

  return (
    <>
      <Header />

      <div className="p-6 max-w-3xl mx-auto">
        <img
          src={song.imagenPrincipal}
          alt={song.titulo}
          className="w-full h-72 object-cover rounded-lg mb-4"
        />

        <h1 className="text-3xl font-bold">{song.titulo}</h1>

        {song.feat && <p className="text-gray-500 mb-3">Feat: {song.feat}</p>}

        <h2 className="text-xl font-semibold mt-4">Letra</h2>
        <pre className="whitespace-pre-wrap mt-2 bg-gray-100 p-4 rounded-lg">
          {song.letra || "Sin letra disponible"}
        </pre>
      </div>

      <Footer />
    </>
  );
}
