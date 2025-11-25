const API_URL = "https://vivemedellin-backend.onrender.com/api";

export interface TriggeredByUser {
  id: number;
  name: string;
  profileImage: string;
}

export interface Notification {
  id: number;
  type: string;
  message: string;
  postId?: number;
  postTitle?: string;
  commentId?: number;
  triggeredByUser?: TriggeredByUser;
  isRead: boolean;
  createdDate: string;
}

export interface ApiResponse {
  message: string;
  success: boolean;
  token?: string;
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
    throw new Error(`Error al obtener notificaciones: ${response.status}`);
  }

  return response.json();
}

/**
 * Obtener solo las notificaciones no leídas del usuario
 */
export async function getUnreadNotifications(): Promise<Notification[]> {
  const token = localStorage.getItem("token");
  
  const response = await fetch(`${API_URL}/notifications/unread`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Error al obtener notificaciones no leídas: ${response.status}`);
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
    throw new Error(`Error al contar notificaciones: ${response.status}`);
  }

  // El endpoint retorna directamente el número
  return response.json();
}

/**
 * Marcar una notificación como leída
 */
export async function markAsRead(notificationId: number): Promise<ApiResponse> {
  const token = localStorage.getItem("token");
  
  const response = await fetch(`${API_URL}/notifications/${notificationId}/read`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Error al marcar notificación como leída: ${response.status}`);
  }

  return response.json();
}

/**
 * Marcar todas las notificaciones como leídas
 */
export async function markAllAsRead(): Promise<ApiResponse> {
  const token = localStorage.getItem("token");
  
  const response = await fetch(`${API_URL}/notifications/read-all`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Error al marcar todas como leídas: ${response.status}`);
  }

  return response.json();
}
