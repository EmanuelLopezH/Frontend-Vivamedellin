import { mockEvents, type Event } from "@/mocks/mockEvents";

export const eventService = {
  async getEvents(): Promise<Event[]> {
    // Simula un fetch al backend
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockEvents);
      }, 300);
    });
  },

  async getEventById(id: number): Promise<Event | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockEvents.find((e) => e.id === id));
      }, 300);
    });
  },
};