import { mockComments, type EventComment } from "@/mocks/mockComments";

let nextId = Math.max(...mockComments.map((c) => c.id), 0) + 1;

export const commentService = {
  async getCommentsByEventId(eventId: number): Promise<EventComment[]> {
    // Más adelante aquí se haría un fetch real al backend
    //Cuando cambies al backend real, reemplaza la implementación interna 
    // por fetch('/api/comments?eventId=...') y POST /api/comments.
    // Por ahora devolvemos los mocks simulando un delay
    return new Promise((resolve) => {
      setTimeout(() => {
      //filtrar los comentarios por eventId y ordenarlos por createdAt descendente
      const filtered = mockComments
        .filter((c) => c.eventId === eventId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      resolve(filtered);
    }, 300);
  });
  },

    async addComment(eventId: number, author: string, content: string): Promise<EventComment> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newComment: EventComment = {
          id: nextId++,
          eventId,
          author,
          content,
          createdAt: new Date().toISOString(),
        };
        // simular persistencia en mock
        mockComments.push(newComment);
        resolve(newComment);
      }, 300);
    });
  },

// Método para limpiar mocks para usar ddurante dev/tests)
  async clearForEvent(eventId: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        for (let i = mockComments.length - 1; i >= 0; i--) {
          if (mockComments[i].eventId === eventId) mockComments.splice(i, 1);
        }
        resolve();
      }, 100);
    });
  },
};
