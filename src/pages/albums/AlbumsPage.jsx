import { useAlbums } from "@/contexts/AlbumContext";
import Header from "@/components/home/Header";
import Footer from "@/components/landing/Footer";
import { Link } from "react-router-dom";

export default function AlbumsPage() {
  const { albums } = useAlbums();

  return (
    <>
      <Header />

      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Álbumes</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {albums.map((album) => (
            <Link
              key={album.id}
              to={`/album/${encodeURIComponent(album.nombre)}`}
              className="border rounded-lg shadow hover:scale-105 transition"
            >
              <img
                src={album.imagenPrincipal}
                alt={album.nombre}
                className="w-full h-56 object-cover rounded-t-lg"
              />
              <div className="p-3">
                <h2 className="font-semibold text-lg">{album.nombre}</h2>
                <p className="text-gray-600">{album.artista}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
}
