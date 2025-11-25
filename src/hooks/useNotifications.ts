import { useState, useEffect, useCallback, useRef } from "react";
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  type Notification,
} from "@/services/notificationService";
import { useToast } from "@/hooks/use-toast";

interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  loadNotifications: () => Promise<void>;
  markNotificationAsRead: (id: number) => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;
  refreshNotifications: () => void;
}

/**
 * Hook personalizado para gestionar notificaciones con integración completa del backend
 */
export function useNotifications(): UseNotificationsReturn {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loadNotificationsRef = useRef<() => Promise<void>>();

  // Cargar notificaciones del backend
  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Verificar token
      const token = localStorage.getItem("token");
      console.log('🔔 [useNotifications] Token disponible:', !!token);

      const [notifs, count] = await Promise.all([
        getNotifications(),
        getUnreadCount(),
      ]);

      setNotifications(notifs);
      setUnreadCount(count);
      
      console.log('🔔 [useNotifications] Datos cargados del backend:', {
        notificationsLength: notifs.length,
        unreadCount: count
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al cargar notificaciones";
      setError(errorMessage);
      console.error("Error en useNotifications:", err);
      
      // No mostrar toast para errores 401/403 (no autenticado)
      if (!errorMessage.includes("401") && !errorMessage.includes("403") && !errorMessage.includes("unauthorized")) {
        toast({
          title: "Error de conexión",
          description: "No se pudieron cargar las notificaciones. Verifica tu conexión.",
          variant: "destructive",
        });
      }
      
      // Limpiar estado en caso de error
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Asignar la función a la ref para evitar dependencias circulares
  loadNotificationsRef.current = loadNotifications;

  // Función para recalcular unreadCount desde las notificaciones actuales
  const recalculateUnreadCount = useCallback(() => {
    setNotifications(prev => {
      const newUnreadCount = prev.filter(n => !n.isRead).length;
      setUnreadCount(newUnreadCount);
      console.log('🔔 [useNotifications] Recalculando unreadCount:', {
        total: prev.length,
        unread: newUnreadCount,
        notifications: prev
      });
      return prev;
    });
  }, []);

  // Marcar una notificación como leída
  const markNotificationAsRead = useCallback(async (notificationId: number) => {
    try {
      await markAsRead(notificationId);
      
      // Actualizar estado local inmediatamente para UI responsive
      setNotifications(prev => {
        const updated = prev.map(n => 
          n.id === notificationId ? { ...n, isRead: true } : n
        );
        const newUnreadCount = updated.filter(n => !n.isRead).length;
        setUnreadCount(newUnreadCount);
        return updated;
      });
      
      console.log('✓ Notificación marcada como leída en backend:', notificationId);
    } catch (err) {
      console.error("Error al marcar como leída:", err);
      toast({
        title: "Error",
        description: "No se pudo marcar la notificación como leída",
        variant: "destructive",
      });
      throw err;
    }
  }, [toast]);

  // Marcar todas las notificaciones como leídas
  const markAllNotificationsAsRead = useCallback(async () => {
    if (loading) return; // Prevenir múltiples llamados simultáneos
    
    try {
      setLoading(true);
      await markAllAsRead();
      
      // Actualizar estado local inmediatamente para UI responsive
      setNotifications(prev => {
        const updated = prev.map(n => ({ ...n, isRead: true }));
        setUnreadCount(0); // Todas marcadas como leídas
        return updated;
      });
      
      toast({
        title: "✓ Notificaciones marcadas",
        description: "Todas las notificaciones se marcaron como leídas",
      });
      
      console.log('✓ Todas las notificaciones marcadas como leídas en backend');
    } catch (err) {
      console.error("Error al marcar todas:", err);
      toast({
        title: "Error",
        description: "No se pudieron marcar las notificaciones como leídas",
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loading, toast]);

  // Función para refrescar notificaciones manualmente
  const refreshNotifications = useCallback(() => {
    loadNotificationsRef.current?.();
  }, []);

  // Auto-actualización cada 30 segundos
  useEffect(() => {
    // Carga inicial
    loadNotificationsRef.current?.();

    // Configurar intervalo para actualizaciones automáticas
    const interval = setInterval(() => {
      loadNotificationsRef.current?.();
    }, 30000); // 30 segundos

    return () => {
      clearInterval(interval);
    };
  }, []);

  // Efecto para recalcular cuando cambien las notificaciones
  useEffect(() => {
    const newUnreadCount = notifications.filter(n => !n.isRead).length;
    if (newUnreadCount !== unreadCount) {
      console.log('🔔 [useNotifications] Sincronizando unreadCount:', {
        anterior: unreadCount,
        nuevo: newUnreadCount,
        notificaciones: notifications.length
      });
      setUnreadCount(newUnreadCount);
    }
  }, [notifications, unreadCount]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    loadNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    refreshNotifications,
  };
}
