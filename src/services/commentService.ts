import { mockComments, type EventComment } from "@/mocks/mockComments";
import { getCurrentUser } from "@/services/authService"

let nextId = mockComments.length + 1; // contador para nuevos IDs

export const commentService = {
  async getCommentsByEventId(eventId: number): Promise<EventComment[]> {
    return mockComments.filter(c => c.eventId === eventId);
    // Más adelante aquí se haría un fetch real al backend
    //Cuando cambies al backend real, reemplaza la implementación interna 
    // por fetch('/api/comments?eventId=...') y POST /api/comments.
    // Por ahora devolvemos los mocks simulando un delay
    /*return new Promise((resolve) => {
      setTimeout(() => {
      //filtrar los comentarios por eventId y ordenarlos por createdAt descendente
      const filtered = mockComments
        .filter((c) => c.eventId === eventId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      resolve(filtered);
    }, 300);
  })*/
  },

   async addComment(eventId: number, author: string, content: string, parentId?: number): Promise<EventComment> {
    const user = getCurrentUser()
    if (!user) throw new Error("This user not exists")
    
    const newComment: EventComment = {
      id: nextId++,
      eventId,
      author,
      content,
      createdAt: new Date().toISOString(),
      parentId,
    } 
    mockComments.unshift(newComment);
    return newComment;
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