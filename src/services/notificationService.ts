const API_URL = "http://localhost:8081/api";

export interface Notification {
  id: number;
  message: string;
  type: "COMMENT" | "LIKE" | "SAVE" | "FOLLOW" | "SYSTEM";
  read: boolean;
  createdAt: string;
  relatedPostId?: number;
  relatedUserId?: number;
}

export interface UnreadCount {
  count: number;
}

/**
 * Obtener todas las notificaciones del usuario
 */
export async function getNotifications(): Promise<Notification[]> {
  const token = localStorage.getItem("token");
  
  const response = await fetch(`${API_URL}/notifications`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Error al obtener notificaciones");
  }

  return response.json();
}

/**
 * Contar notificaciones no leídas
 */
export async function getUnreadCount(): Promise<number> {
  const token = localStorage.getItem("token");
  
  const response = await fetch(`${API_URL}/notifications/unread/count`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Error al contar notificaciones");
  }

  const data: UnreadCount = await response.json();
  return data.count;
}

/**
 * Marcar una notificación como leída
 */
export async function markAsRead(notificationId: number): Promise<void> {
  const token = localStorage.getItem("token");
  
  const response = await fetch(`${API_URL}/notifications/${notificationId}/read`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Error al marcar notificación como leída");
  }
}

/**
 * Marcar todas las notificaciones como leídas
 */
export async function markAllAsRead(): Promise<void> {
  const token = localStorage.getItem("token");
  
  const response = await fetch(`${API_URL}/notifications/read-all`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Error al marcar todas como leídas");
  }
}
