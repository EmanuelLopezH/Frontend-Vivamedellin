// Utilidad para limpiar localStorage durante desarrollo
// Este archivo es solo para testing y desarrollo

export function resetMockData() {
  localStorage.removeItem("mockComments")
  localStorage.removeItem("commentDeletionAuditLogs")
  localStorage.removeItem("user")
  
  console.log("🧹 [RESET] Datos mock reseteados")
  console.log("🔄 [INFO] Recarga la página para ver los datos iniciales")
}

// Función para mostrar en consola los datos actuales
export function showCurrentData() {
  const comments = localStorage.getItem("mockComments")
  const auditLogs = localStorage.getItem("commentDeletionAuditLogs")
  const user = localStorage.getItem("user")
  
  console.log("📊 [CURRENT DATA]")
  console.log("Comments:", comments ? JSON.parse(comments) : "Usando datos por defecto")
  console.log("Audit Logs:", auditLogs ? JSON.parse(auditLogs) : "Sin logs")
  console.log("Current User:", user ? JSON.parse(user) : "No hay usuario logueado")
}

// Exportar funciones globalmente para usar en consola del navegador durante desarrollo
if (typeof window !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).resetMockData = resetMockData;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).showCurrentData = showCurrentData;
}