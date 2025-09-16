import { mockComments, type EventComment } from "@/mocks/mockComments";

export const commentService = {
  async getCommentsByEventId(eventId: number): Promise<EventComment[]> {
    // Más adelante aquí se haría un fetch real al backend
    // Por ahora devolvemos los mocks simulando un delay
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockComments), 300);
    });
  },
};
