/**
 * Sistema de auditoría para registrar eliminaciones de comentarios
 * Cumple con el criterio: "El sistema debe registrar la acción de eliminación para auditoría"
 * 
 * Los datos registrados incluyen:
 * - Id del comentario eliminado
 * - Usuario autor del comentario  
 * - Administrador que eliminó el comentario
 * - Fecha y hora de la eliminación
 * - Motivo de la eliminación
 * - Contenido del comentario
 */

export interface CommentDeletionAuditLog {
  id: number                    // ID único del registro de auditoría
  commentId: number             // ID del comentario eliminado
  commentAuthorName: string     // Nombre del autor del comentario
  commentContent: string        // Contenido del comentario eliminado
  deletedByName: string         // Nombre del administrador que eliminó
  deletedByRole: 'admin' | 'user' // Rol del usuario que eliminó
  deletionReason: string        // Motivo de eliminación proporcionado
  deletionDate: string          // Fecha y hora de eliminación (ISO string)
  eventId: number               // ID del evento al que pertenecía el comentario
}

// Almacén en memoria para el mock (en producción sería una base de datos)
const auditLogs: CommentDeletionAuditLog[] = (() => {
  // Intentar cargar desde localStorage para persistencia durante desarrollo
  const stored = localStorage.getItem("commentDeletionAuditLogs")
  return stored ? JSON.parse(stored) : []
})()

let nextAuditId = auditLogs.length + 1

/**
 * Registra una eliminación de comentario en el log de auditoría
 * @param logData - Datos de la eliminación a registrar
 * @returns Promise con el registro de auditoría creado
 */
export async function createDeletionAuditLog(
  logData: Omit<CommentDeletionAuditLog, 'id' | 'deletionDate'>
): Promise<CommentDeletionAuditLog> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const auditRecord: CommentDeletionAuditLog = {
        id: nextAuditId++,
        ...logData,
        deletionDate: new Date().toISOString(),
      }
      
      auditLogs.unshift(auditRecord) // Agregar al inicio para mostrar más recientes primero
      
      // Persistir en localStorage para desarrollo
      localStorage.setItem("commentDeletionAuditLogs", JSON.stringify(auditLogs))
      
      console.log("🔍 [AUDIT LOG] Comentario eliminado:", auditRecord)
      resolve(auditRecord)
    }, 100) // Simular delay de red
  })
}

/**
 * Obtiene todos los registros de auditoría de eliminaciones
 * @returns Promise con array de registros de auditoría
 */
export async function getAuditLogs(): Promise<CommentDeletionAuditLog[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...auditLogs])
    }, 100)
  })
}

/**
 * Obtiene registros de auditoría filtrados por evento
 * @param eventId - ID del evento
 * @returns Promise con registros de auditoría del evento
 */
export async function getAuditLogsByEvent(eventId: number): Promise<CommentDeletionAuditLog[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const eventLogs = auditLogs.filter(log => log.eventId === eventId)
      resolve(eventLogs)
    }, 100)
  })
}

/**
 * Limpia todos los logs de auditoría (solo para desarrollo/testing)
 */
export async function clearAuditLogs(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      auditLogs.length = 0
      localStorage.removeItem("commentDeletionAuditLogs")
      console.log("🧹 [AUDIT LOG] Logs de auditoría limpiados")
      resolve()
    }, 100)
  })
}