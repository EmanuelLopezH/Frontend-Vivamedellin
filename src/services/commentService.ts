import { mockComments, type EventComment } from "@/mocks/mockComments";
import { getCurrentUser } from "@/mocks/mockUsers";

let nextId = mockComments.length + 1; // contador para nuevos IDs

export const commentService = {
  async getCommentsByEventId(eventId: number): Promise<EventComment[]> {
    return mockComments.filter(c => c.eventId === eventId);
  },

   async addComment(eventId: number, content: string, parentId?: number): Promise<EventComment> {
    const user = getCurrentUser()
    if (!user) throw new Error("This user not exists")
    
    const newComment: EventComment = {
      id: nextId++,
      eventId,
      name: user.name,
      content,
      createdAt: new Date().toISOString(),
      parentId,
      avatarUrl: `https://i.pravatar.cc/150?u=${user.id}`
    } 
    mockComments.unshift(newComment);
    localStorage.setItem("mockComments", JSON.stringify(mockComments))
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