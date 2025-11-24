import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  TrendingUp,
  MessageSquare,
  Users,
  Calendar,
  Eye,
  ExternalLink,
  AlertCircle,
  BarChart3,
  Crown,
  Flame
} from "lucide-react";
import { getCurrentUser } from "@/services/authService";
import { dashboardService, type DashboardData, type TrendingEvent, type ActiveUser } from "@/services/dashboardService";
import type { User } from "@/services/authService";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Verificar autenticación
  useEffect(() => {
    const currentUser = getCurrentUser();
    console.log("🔍 [Dashboard] Usuario actual:", currentUser);
    
    if (!currentUser) {
      console.warn("⚠️ [Dashboard] Usuario no autenticado, redirigiendo...");
      navigate("/", { replace: true });
      return;
    }
    
    setUser(currentUser);
  }, [navigate]);

  // Cargar datos del dashboard
  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) return;

      try {
        console.log("📊 [Dashboard] Cargando datos del dashboard...");
        setLoading(true);
        setError(null);
        
        const data = await dashboardService.getDashboardData();
        console.log("✅ [Dashboard] Datos cargados:", data);
        setDashboardData(data);
      } catch (err) {
        console.error("❌ [Dashboard] Error al cargar dashboard:", err);
        setError(err instanceof Error ? err.message : "Error al cargar el dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user]);

  // Auto-refresh cada 5 minutos
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(async () => {
      try {
        console.log("🔄 [Dashboard] Auto-actualizando datos...");
        const data = await dashboardService.getDashboardData();
        setDashboardData(data);
      } catch (err) {
        console.error("❌ [Dashboard] Error en auto-actualización:", err);
      }
    }, 5 * 60 * 1000); // 5 minutos

    return () => clearInterval(interval);
  }, [user]);

  const handleRefresh = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const data = await dashboardService.getDashboardData();
      setDashboardData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al actualizar");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Loading state
  if (loading && !dashboardData) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 3 }, (_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 5 }, (_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-full mb-1" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Alert variant="destructive" className="max-w-md mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
        <div className="text-center mt-4">
          <Button onClick={handleRefresh} variant="outline">
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-primary" />
              Dashboard de Eventos
            </h1>
            <p className="text-gray-600">
              Descubre lo que está pasando en la comunidad de Medellín
            </p>
          </div>
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <TrendingUp className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{dashboardData.stats.totalEvents}</p>
                  <p className="text-sm text-gray-600">Eventos totales</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">{dashboardData.stats.totalComments}</p>
                  <p className="text-sm text-gray-600">Comentarios</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold">{dashboardData.stats.activeUsers}</p>
                  <p className="text-sm text-gray-600">Usuarios activos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Flame className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold">{dashboardData.stats.trendingEvents}</p>
                  <p className="text-sm text-gray-600">En tendencia</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Eventos más comentados */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-600" />
              Eventos más comentados
            </CardTitle>
            <p className="text-sm text-gray-600">
              Los eventos que están generando más conversación
            </p>
          </CardHeader>
          <CardContent>
            {dashboardData.trendingEvents.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No hay eventos con actividad reciente</p>
              </div>
            ) : (
              <div className="space-y-4">
                {dashboardData.trendingEvents.map((event, index) => (
                  <div
                    key={event.id}
                    className="flex items-start gap-4 p-4 rounded-lg border hover:bg-gray-50 transition-colors cursor-pointer group"
                    onClick={() => navigate(`/post/${event.id}`)}
                  >
                    <div className="flex-shrink-0">
                      <Badge variant={index === 0 ? "default" : "secondary"} className="w-8 h-8 rounded-full flex items-center justify-center">
                        {index + 1}
                      </Badge>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-primary transition-colors">
                        {event.title || event.content.substring(0, 50) + "..."}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {event.content.substring(0, 100)}...
                      </p>
                      
                      <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          <span>{event.commentsCount} comentarios</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          <span>por {event.authorName}</span>
                        </div>
                        <span>{formatDate(event.createdAt)}</span>
                      </div>
                    </div>
                    
                    <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors" />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Usuarios más activos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-600" />
              Usuarios más activos
            </CardTitle>
            <p className="text-sm text-gray-600">
              Los miembros que más participan en la comunidad
            </p>
          </CardHeader>
          <CardContent>
            {dashboardData.activeUsers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No hay actividad de usuarios reciente</p>
              </div>
            ) : (
              <div className="space-y-3">
                {dashboardData.activeUsers.map((activeUser, index) => (
                  <div
                    key={activeUser.id}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
                    onClick={() => navigate(`/profile/${activeUser.id}`)}
                  >
                    <div className="flex-shrink-0 relative">
                      {activeUser.profileImage ? (
                        <img
                          src={activeUser.profileImage}
                          alt={activeUser.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white text-sm font-semibold">
                          {getInitials(activeUser.name)}
                        </div>
                      )}
                      {index < 3 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-yellow-500 flex items-center justify-center">
                          <span className="text-xs text-white font-bold">{index + 1}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                        {activeUser.name}
                      </h4>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span>{activeUser.eventsCount} eventos</span>
                        <span>{activeUser.commentsCount} comentarios</span>
                        <span>Puntos: {activeUser.activityScore}</span>
                      </div>
                    </div>
                    
                    <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors" />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Footer info */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          Datos actualizados cada 5 minutos • Última actualización: {formatDate(new Date().toISOString())}
        </p>
      </div>
    </div>
  );
}