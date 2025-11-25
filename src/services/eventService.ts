import { mockEvents, type Event } from "@/mocks/mockEvents";

const API_URL = "https://vivemedellin-backend.onrender.com/api";

export interface SavedEvent {
  id: number;
  eventId: number;
  userId: number;
  savedAt: string;
  event?: Event;
}

export const eventService = {
  async getEvents(): Promise<Event[]> {
    const token = localStorage.getItem("token");
    
    try {
      const response = await fetch(`${API_URL}/events`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.warn("Backend no disponible, usando datos mock:", error);
      // Fallback a datos mock
      return mockEvents;
    }
  },

  async getEventById(id: number): Promise<Event | undefined> {
    const token = localStorage.getItem("token");
    
    try {
      const response = await fetch(`${API_URL}/events/${id}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.warn("Backend no disponible, usando datos mock:", error);
      // Fallback a datos mock
      return mockEvents.find((e) => e.id === id);
    }
  },

  /**
   * Guardar un evento en favoritos
   */
  async saveEvent(eventId: number): Promise<SavedEvent> {
    const token = localStorage.getItem("token");
    
    const response = await fetch(`${API_URL}/saved-events`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ eventId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al guardar evento");
    }

    return await response.json();
  },

  /**
   * Quitar un evento de favoritos
   */
  async unsaveEvent(eventId: number): Promise<void> {
    const token = localStorage.getItem("token");
    
    const response = await fetch(`${API_URL}/saved-events/${eventId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al quitar evento de favoritos");
    }
  },

  /**
   * Obtener eventos guardados por el usuario
   */
  async getSavedEvents(): Promise<SavedEvent[]> {
    const token = localStorage.getItem("token");
    
    const response = await fetch(`${API_URL}/saved-events`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al obtener eventos guardados");
    }

    return await response.json();
  },

  /**
   * Verificar si un evento está guardado
   */
  async isEventSaved(eventId: number): Promise<boolean> {
    try {
      const savedEvents = await this.getSavedEvents();
      return savedEvents.some(saved => saved.eventId === eventId);
    } catch (error) {
      console.error("Error verificando evento guardado:", error);
      return false;
    }
  },
};