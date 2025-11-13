import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AlbumContext = createContext();

export const AlbumProvider = ({ children }) => {
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/album")
      .then((res) => setAlbums(res.data.data.albums))
      .catch((err) => console.error("Error cargando álbumes:", err));
  }, []);

  return (
    <AlbumContext.Provider value={{ albums }}>{children}</AlbumContext.Provider>
  );
};

export const useAlbums = () => useContext(AlbumContext);
