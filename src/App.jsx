import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import HomePage from "@/pages/home/HomePage";
import ProfilePage from "@/pages/profile/ProfilePage";
import UserManagementPage from "@/pages/admin/UserManagementPage";
import ProtectedRoute from "@/components/ProtectedRoute";
import LandingPage from "@/pages/LandingPage";
import EventDetailsPage from "@/pages/eventos/EventDetailsPage";
import { EventsManagement } from "./components/eventos/EventManagement";
import NewsPage from "./pages/news/News";
import NewsDetailPage from "./pages/news/NewsDetail";
import NewsCreatePage from "./pages/news/NewsCreate";
import NewsEditPage from "./pages/news/NewsEdit";
import { NewsProvider } from "@/contexts/NewsContext";
import { EventProvider } from "@/contexts/EventContext";
import { UserProvider } from "@/contexts/UserContext";

export default function App() {
  return (
    <UserProvider>
      <EventProvider>
        <NewsProvider>
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
                  path="/perfil"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/gestion-usuarios"
                  element={
                    <ProtectedRoute>
                      <UserManagementPage />
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
                  path="/noticias/crear"
                  element={
                    <ProtectedRoute>
                      <NewsCreatePage />
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
                  path="/noticias/:slug/editar"
                  element={
                    <ProtectedRoute>
                      <NewsEditPage />
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
        </NewsProvider>
      </EventProvider>
    </UserProvider>
  );
}
