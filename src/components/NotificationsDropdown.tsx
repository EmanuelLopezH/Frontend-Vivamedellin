import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, Check, MessageSquare, Heart, Bookmark, User, Info } from "lucide-react";
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  type Notification,
} from "@/services/notificationService";
import { useToast } from "@/hooks/use-toast";

export function NotificationsDropdown() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  // Cargar notificaciones
  const loadNotifications = async () => {
    try {
      const [notifs, count] = await Promise.all([
        getNotifications(),
        getUnreadCount(),
      ]);
      setNotifications(notifs);
      setUnreadCount(count);
    } catch (error) {
      console.error("Error al cargar notificaciones:", error);
    }
  };

  // Cargar al abrir el dropdown
  useEffect(() => {
    if (open) {
      loadNotifications();
    }
  }, [open]);

  // Auto-actualizar cada 30 segundos
  useEffect(() => {
    loadNotifications(); // Carga inicial

    const interval = setInterval(() => {
      loadNotifications();
    }, 30000); // 30 segundos

    return () => clearInterval(interval);
  }, []);

  // Manejar click en notificación
  const handleNotificationClick = async (notification: Notification) => {
    try {
      // Marcar como leída si no lo está
      if (!notification.read) {
        await markAsRead(notification.id);
        setUnreadCount((prev) => Math.max(0, prev - 1));
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notification.id ? { ...n, read: true } : n
          )
        );
      }

      // Navegar al post relacionado si existe
      if (notification.relatedPostId) {
        setOpen(false);
        navigate(`/post/${notification.relatedPostId}`);
      }
    } catch (error) {
      console.error("Error al marcar notificación:", error);
    }
  };

  // Marcar todas como leídas
  const handleMarkAllAsRead = async () => {
    try {
      setLoading(true);
      await markAllAsRead();
      setUnreadCount(0);
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read: true }))
      );
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
      setLoading(false);
    }
  };

  // Obtener icono según tipo de notificación
  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "COMMENT":
        return <MessageSquare className="h-4 w-4" />;
      case "LIKE":
        return <Heart className="h-4 w-4" />;
      case "SAVE":
        return <Bookmark className="h-4 w-4" />;
      case "FOLLOW":
        return <User className="h-4 w-4" />;
      case "SYSTEM":
        return <Info className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  // Formatear fecha relativa
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Ahora";
    if (diffMins < 60) return `Hace ${diffMins}m`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 7) return `Hace ${diffDays}d`;
    return date.toLocaleDateString("es-CO", { month: "short", day: "numeric" });
  };

  // Últimas 5 notificaciones
  const recentNotifications = notifications.slice(0, 5);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notificaciones</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              disabled={loading}
              className="h-auto py-1 px-2 text-xs"
            >
              <Check className="h-3 w-3 mr-1" />
              Marcar todas
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {recentNotifications.length === 0 ? (
          <div className="py-8 text-center">
            <Bell className="h-12 w-12 text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-500">No tienes notificaciones</p>
          </div>
        ) : (
          <>
            <ScrollArea className="max-h-[400px]">
              {recentNotifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className="cursor-pointer p-3 focus:bg-slate-50"
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex gap-3 w-full">
                    {/* Icono */}
                    <div
                      className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
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
                        className={`text-sm ${
                          notification.read
                            ? "text-slate-600"
                            : "text-slate-900 font-medium"
                        }`}
                      >
                        {notification.message}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {getRelativeTime(notification.createdAt)}
                      </p>
                    </div>

                    {/* Indicador de no leída */}
                    {!notification.read && (
                      <div className="flex-shrink-0">
                        <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                      </div>
                    )}
                  </div>
                </DropdownMenuItem>
              ))}
            </ScrollArea>

            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer justify-center text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              onClick={() => {
                setOpen(false);
                navigate("/notifications");
              }}
            >
              Ver todas las notificaciones
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
