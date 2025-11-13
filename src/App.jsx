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
import MerchListPage from "./pages/merch/MerchListPage";
import ProductCreatePage from "./pages/merch/ProductCreatePage";
import ProductDetailPage from "./pages/merch/ProductDetailPage";
import ProductEditPage from "./pages/merch/ProductEditPage";
import TicketsListPage from "@/pages/tickets/TicketsListPage";
import TicketDetailPage from "@/pages/tickets/TicketDetailPage";
import EditarEvento from "@/pages/EditarEvento";
import { NewsProvider } from "@/contexts/NewsContext";
import { ReactionsProvider } from "@/contexts/ReactionsContext";
import { EventProvider } from "@/contexts/EventContext";
import { UserProvider } from "@/contexts/UserContext";
import { NotificationsProvider } from "@/contexts/NotificationsContext";
import { AlbumProvider } from "./contexts/AlbumContext";
import AlbumsPage from "./pages/albums/AlbumsPage";
import AlbumDetailPage from "./pages/albums/AlbumDetailPage";
import SongDetailPage from "./pages/albums/SongDetailPage";
import { initMercadoPago } from "@mercadopago/sdk-react";

initMercadoPago("APP_USR-736d9ff3-20be-4ca5-bbb9-244377d549f7");
import { MerchProvider } from "@/contexts/MerchContext";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import RedesPinkMuse from "@/pages/RedesPinkMuse";

export default function App() {
  return (
    <UserProvider>
      <NotificationsProvider>
        <EventProvider>
          <NewsProvider>
            <MerchProvider>
              <ReactionsProvider>
                <AlbumProvider>
                  <div className="flex min-h-dvh w-full flex-col">
                    <Router>
                      <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route
                          path="/forgotten"
                          element={<ForgotPasswordPage />}
                        />
                        <Route
                          path="/reset-password"
                          element={<ResetPasswordPage />}
                        />
                        <Route
                          path="/home"
                          element={
                            <ProtectedRoute>
                              <HomePage />
                            </ProtectedRoute>
                          }
                        />
                        <Route path="/redes" element={<RedesPinkMuse />} />
                        <Route path="/terms" element={<TermsPage />} />
                        <Route path="/privacy" element={<PrivacyPage />} />
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
                          path="/entradas"
                          element={
                            <ProtectedRoute>
                              <TicketsListPage />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/entradas/:eventSlug"
                          element={
                            <ProtectedRoute>
                              <TicketDetailPage />
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
                        <Route
                          path="/eventos/:eventId/editar"
                          element={
                            <ProtectedRoute>
                              <EditarEvento />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/merch"
                          element={
                            <ProtectedRoute>
                              <MerchListPage />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/merch/nuevo"
                          element={
                            <ProtectedRoute>
                              <ProductCreatePage />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/merch/:slug/editar"
                          element={
                            <ProtectedRoute>
                              <ProductEditPage />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/merch/:slug"
                          element={
                            <ProtectedRoute>
                              <ProductDetailPage />
                            </ProtectedRoute>
                          }
                        />
                        {/* Rutas de álbumes y canciones */}
                        <Route path="/album" element={<AlbumsPage />} />
                        <Route
                          path="/album/:albumSlug"
                          element={<AlbumDetailPage />}
                        />
                        <Route
                          path="/album/:albumSlug/cancion/:songSlug"
                          element={<SongDetailPage />}
                        />
                      </Routes>
                    </Router>
                  </div>
                </AlbumProvider>
              </ReactionsProvider>
            </MerchProvider>
          </NewsProvider>
        </EventProvider>
      </NotificationsProvider>
    </UserProvider>
  );
}
