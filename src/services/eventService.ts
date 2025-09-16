import { Event } from '@/types';
import { mockEvents } from '@/mocks/mockEvents';

// Service layer - mañana se puede cambiar por fetch calls sin tocar la UI
export const getEvents = async (): Promise<Event[]> => {
  // Simulamos una llamada async
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockEvents);
    }, 100);
  });
};

export const getEventById = async (id: string): Promise<Event | null> => {
  // Simulamos una llamada async
  return new Promise((resolve) => {
    setTimeout(() => {
      const event = mockEvents.find(event => event.id === id) || null;
      resolve(event);
    }, 100);
  });
};