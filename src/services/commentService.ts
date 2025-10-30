import { mockComments, type EventComment } from "@/mocks/mockComments";
import { getCurrentUser, canDeleteComment } from "@/mocks/mockUsers";
import { createDeletionAuditLog } from "@/services/auditService";

// Función para obtener el siguiente ID disponible
function getNextId(): number {
  if (mockComments.length === 0) return 1;
  return Math.max(...mockComments.map(c => c.id)) + 1;
}

export const commentService = {
  async getCommentsByEventId(eventId: number): Promise<EventComment[]> {
    return mockComments.filter(c => c.eventId === eventId);
  },

   async addComment(eventId: number, content: string, parentId?: number): Promise<EventComment> {
    const user = getCurrentUser()
    if (!user) throw new Error("This user not exists")
    
    const newComment: EventComment = {
      id: getNextId(),
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

  /**
   * Elimina un comentario específico
   * Cumple con los criterios de la HU-06:
   * - Verifica permisos de eliminación
   * - Registra en auditoría
   * - Elimina el comentario de la vista
   * 
   * @param commentId - ID del comentario a eliminar
   * @param deletionReason - Motivo de la eliminación
   * @returns Promise<boolean> - true si se eliminó exitosamente
   */
  async deleteComment(commentId: number, deletionReason: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const currentUser = getCurrentUser()
          if (!currentUser) {
            reject(new Error("Usuario no autenticado"))
            return
          }

          // Buscar el comentario a eliminar
          const commentIndex = mockComments.findIndex(c => c.id === commentId)
          if (commentIndex === -1) {
            reject(new Error("Comentario no encontrado"))
            return
          }

          const commentToDelete = mockComments[commentIndex]

          // Verificar permisos de eliminación
          if (!canDeleteComment(commentToDelete.name)) {
            reject(new Error("No tienes permisos para eliminar este comentario"))
            return
          }

          // Registrar en auditoría ANTES de eliminar
          await createDeletionAuditLog({
            commentId: commentToDelete.id,
            commentAuthorName: commentToDelete.name,
            commentContent: commentToDelete.content,
            deletedByName: currentUser.name,
            deletedByRole: currentUser.role,
            deletionReason: deletionReason,
            eventId: commentToDelete.eventId || 0,
          })

          // Eliminar comentario y sus respuestas
          // Usamos filter para crear un nuevo array sin el comentario y sus respuestas
          const commentsToKeep = mockComments.filter(comment => {
            // Mantener comentarios que NO sean:
            // 1. El comentario a eliminar
            // 2. Respuestas directas al comentario a eliminar
            return comment.id !== commentId && comment.parentId !== commentId
          })

          // Contar cuántos comentarios se eliminaron (antes de modificar el array)
          const originalCount = mockComments.length
          
          // Reemplazar el array completo
          mockComments.length = 0 // Limpiar array original
          mockComments.push(...commentsToKeep) // Agregar comentarios que se mantienen
          
          const deletedCount = originalCount - mockComments.length

          // Persistir cambios en localStorage
          localStorage.setItem("mockComments", JSON.stringify(mockComments))

          console.log(`🗑️ [DELETE] Comentario ${commentId} eliminado por ${currentUser.name} (${currentUser.role})`)
          console.log(`📝 [REASON] ${deletionReason}`)
          console.log(`📊 [COUNT] ${deletedCount} comentario(s) eliminado(s) en total (incluyendo respuestas)`)
          
          resolve(true)
        } catch (error) {
          console.error("Error al eliminar comentario:", error)
          reject(error)
        }
      }, 300) // Simular delay de red
    })
  },

// Método para limpiar mocks para usar durante dev/tests)
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
 
  /**
   * Actualiza el contenido de un comentario.
   * - Verifica que el usuario esté autenticado
   * - Solo el autor puede editar
   * - Solo se permite editar dentro de 1 hora desde la creación
   */
  async updateComment(commentId: number, newContent: string): Promise<EventComment> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const currentUser = getCurrentUser()
          if (!currentUser) {
            reject(new Error("Usuario no autenticado"))
            return
          }

          const idx = mockComments.findIndex(c => c.id === commentId)
          if (idx === -1) {
            reject(new Error("Comentario no encontrado"))
            return
          }

          const comment = mockComments[idx]

          // Solo el autor puede editar
          if (currentUser.name !== comment.name) {
            reject(new Error("No tienes permisos para editar este comentario"))
            return
          }

          // Límite de 1 hora desde createdAt
          const createdMs = new Date(comment.createdAt).getTime()
          if ((Date.now() - createdMs) > (60 * 60 * 1000)) {
            reject(new Error("El periodo de edición (1 hora) ha expirado"))
            return
          }

          // Actualizar contenido y marcar edición
          comment.content = newContent
          // Propiedad opcional editedAt
          ;(comment as any).editedAt = new Date().toISOString()

          // Persistir cambios
          localStorage.setItem("mockComments", JSON.stringify(mockComments))

          resolve(comment)
        } catch (error) {
          reject(error)
        }
      }, 300)
    })
  }
};