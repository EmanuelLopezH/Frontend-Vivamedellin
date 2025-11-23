import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bell,
  Check,
  MessageSquare,
  Heart,
  Bookmark,
  User,
  Info,
  Loader2,
  Trash2,
} from "lucide-react";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  type Notification,
} from "@/services/notificationService";
import { useToast } from "@/hooks/use-toast";

export default function NotificationsPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");

  // Cargar notificaciones
  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error("Error al cargar notificaciones:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las notificaciones",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  // Manejar click en notificación
  const handleNotificationClick = async (notification: Notification) => {
    try {
      // Marcar como leída si no lo está
      if (!notification.read) {
        await markAsRead(notification.id);
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notification.id ? { ...n, read: true } : n
          )
        );
      }

      // Navegar al post relacionado si existe
      if (notification.relatedPostId) {
        navigate(`/post/${notification.relatedPostId}`);
      }
    } catch (error) {
      console.error("Error al marcar notificación:", error);
    }
  };

  // Marcar todas como leídas
  const handleMarkAllAsRead = async () => {
    try {
      setMarkingAll(true);
      await markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      toast({
        title: "✓ Notificaciones marcadas",
        description: "Todas las notificaciones se marcaron como leídas",
      });
    } catch (error) {
      console.error("Error al marcar todas:", error);
      toast({
        title: "Error",
        description: "No se pudieron marcar las notificaciones",
        variant: "destructive",
      });
    } finally {
      setMarkingAll(false);
    }
  };

  // Obtener icono según tipo de notificación
  const getNotificationIcon = (type: Notification["type"]) => {
    const iconClass = "h-5 w-5";
    switch (type) {
      case "COMMENT":
        return <MessageSquare className={iconClass} />;
      case "LIKE":
        return <Heart className={iconClass} />;
      case "SAVE":
        return <Bookmark className={iconClass} />;
      case "FOLLOW":
        return <User className={iconClass} />;
      case "SYSTEM":
        return <Info className={iconClass} />;
      default:
        return <Bell className={iconClass} />;
    }
  };

  // Formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Ahora mismo";
    if (diffMins < 60) return `Hace ${diffMins} minuto${diffMins > 1 ? "s" : ""}`;
    if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? "s" : ""}`;
    if (diffDays < 7) return `Hace ${diffDays} día${diffDays > 1 ? "s" : ""}`;
    
    return date.toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Filtrar notificaciones según tab
  const filteredNotifications =
    activeTab === "unread"
      ? notifications.filter((n) => !n.read)
      : notifications;

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600">Cargando notificaciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-slate-900">Notificaciones</h1>
            {unreadCount > 0 && (
              <Button
                onClick={handleMarkAllAsRead}
                disabled={markingAll}
                variant="outline"
                size="sm"
              >
                {markingAll ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Marcando...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Marcar todas como leídas
                  </>
                )}
              </Button>
            )}
          </div>
          {unreadCount > 0 && (
            <p className="text-slate-600">
              Tienes {unreadCount} notificación{unreadCount > 1 ? "es" : ""} sin leer
            </p>
          )}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "all" | "unread")}>
          <TabsList className="mb-6">
            <TabsTrigger value="all" className="gap-2">
              Todas
              <Badge variant="secondary" className="ml-1">
                {notifications.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="unread" className="gap-2">
              No leídas
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-1">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            {filteredNotifications.length === 0 ? (
              <Card className="p-12 text-center">
                <Bell className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  {activeTab === "unread"
                    ? "No tienes notificaciones sin leer"
                    : "No tienes notificaciones"}
                </h3>
                <p className="text-slate-600">
                  {activeTab === "unread"
                    ? "¡Estás al día con todas tus notificaciones!"
                    : "Aquí aparecerán las actualizaciones sobre tu actividad"}
                </p>
              </Card>
            ) : (
              <div className="space-y-2">
                {filteredNotifications.map((notification) => (
                  <Card
                    key={notification.id}
                    className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                      notification.read
                        ? "bg-white"
                        : "bg-blue-50 border-l-4 border-l-blue-600"
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex gap-4">
                      {/* Icono */}
                      <div
                        className={`flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center ${
                          notification.type === "COMMENT"
                            ? "bg-blue-100 text-blue-600"
                            : notification.type === "LIKE"
                            ? "bg-red-100 text-red-600"
                            : notification.type === "SAVE"
                            ? "bg-purple-100 text-purple-600"
                            : notification.type === "FOLLOW"
                            ? "bg-green-100 text-green-600"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Contenido */}
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-base mb-1 ${
                            notification.read
                              ? "text-slate-700"
                              : "text-slate-900 font-medium"
                          }`}
                        >
                          {notification.message}
                        </p>
                        <p className="text-sm text-slate-500">
                          {formatDate(notification.createdAt)}
                        </p>
                      </div>

                      {/* Indicador de no leída */}
                      {!notification.read && (
                        <div className="flex-shrink-0 flex items-center">
                          <div className="h-3 w-3 bg-blue-600 rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
