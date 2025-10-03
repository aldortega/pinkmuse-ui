import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import HomePage from "@/pages/home/HomePage";
import ProtectedRoute from "@/components/ProtectedRoute";
import LandingPage from "@/pages/LandingPage";
import EventDetailsPage from "@/pages/eventos/EventDetailsPage";
import { EventsManagement } from "./components/eventos/EventManagement";
import NewsPage from "./pages/news/News";
import NewsDetailPage from "./pages/news/NewsDetail";

export default function App() {
  return (
    <div className="flex min-h-dvh w-full flex-col">
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/eventos"
            element={
              <ProtectedRoute>
                <EventsManagement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/noticias"
            element={
              <ProtectedRoute>
                <NewsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/noticias/:slug"
            element={
              <ProtectedRoute>
                <NewsDetailPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/eventos/:nombreEvento"
            element={
              <ProtectedRoute>
                <EventDetailsPage />
              </ProtectedRoute>
            }
          />

          {/* <Route path="/noticias" element={<ProtectedRoute></ProtectedRoute>} /> */}
        </Routes>
      </Router>
    </div>
  );
}
