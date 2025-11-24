import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import EventPage1 from "./pages/EventPage1";
import EventPage2 from "./pages/EventPage2";
import PostsFeed from "./pages/PostsFeed";
import PostDetail from "./pages/PostDetail";
import CreatePost from "./pages/CreatePost";
import UserProfile from "./pages/UserProfile";
import NotificationsPage from "./pages/NotificationsPage";
import SavedEventsPage from "./pages/SavedEventsPage";
import "./utils/devUtils"; // Importar utilidades de desarrollo

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Rutas con Navbar permanente */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Index />} />
            <Route path="posts" element={<PostsFeed />} />
            <Route path="post/:postId" element={<PostDetail />} />
            <Route path="create-post" element={<CreatePost />} />
            <Route path="event-01" element={<EventPage1 />} />
            <Route path="event-02" element={<EventPage2 />} />
            {/* Rutas futuras */}
            <Route path="search" element={<div>Búsqueda - TODO</div>} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="user/:userId" element={<UserProfile />} />
            <Route path="profile" element={<div>Mi Perfil - TODO</div>} />
            <Route path="my-posts" element={<div>Mis Eventos - TODO</div>} />
            <Route path="saved-posts" element={<SavedEventsPage />} />
            <Route path="settings" element={<div>Configuración - TODO</div>} />
            <Route path="admin" element={<div>Panel Admin - TODO</div>} />
          </Route>
          {/* Ruta 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
