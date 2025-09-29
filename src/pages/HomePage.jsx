// import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
// import { useNavigate } from "react-router-dom";
// import { useState } from "react";
import { Header } from "@/components/home/header";
import { WelcomeSection } from "@/components/home/WelcomeSection";
import UpcomingEvents from "@/components/home/UpcomingEvents";
import { TicketManagement } from "@/components/home/TicketManagement";
import Merchandise from "@/components/home/Merchandise";
import NewsUpdates from "@/components/home/NewsUpdates";
import Footer from "@/components/landing/Footer";

export default function HomePage() {
  // const navigate = useNavigate();
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState("");

  // const handleLogout = async () => {
  //   setError("");
  //   setLoading(true);
  //   try {
  //     await api.post("/cerrarsesion");
  //   } catch (err) {
  //     // si el token ya no es válido, igual limpiamos
  //     const msg = err?.response?.data?.message || "";
  //     setError(msg);
  //   } finally {
  //     localStorage.removeItem("authToken");
  //     localStorage.removeItem("authUser");
  //     setLoading(false);
  //     navigate("/");
  //   }
  // };

  return (
    <div className="min-h-screen ">
      <Header />
      <main>
        <WelcomeSection />
        <UpcomingEvents />
        <TicketManagement />
        <Merchandise />
        <NewsUpdates />
        <Footer />
      </main>
    </div>
  );
}

// <div className="min-h-screen bg-pink-100 flex flex-col items-center justify-center gap-4">

//   <h1 className="text-2xl font-semibold text-gray-800">Bienvenido</h1>
//   {error ? <div className="text-red-600 text-sm">{error}</div> : null}
//   <Button
//     onClick={handleLogout}
//     disabled={loading}
//     className="bg-red-500 hover:bg-red-600"
//   >
//     {loading ? "Cerrando sesión..." : "Cerrar sesión"}
//   </Button>
// </div>
