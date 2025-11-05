/**
 * Utilidades para debugging de autenticación
 * Útil para verificar el estado del usuario y roles
 */

export function debugCurrentUser() {
  console.log("=== 🔍 DEBUG AUTH ===")
  
  const token = localStorage.getItem("token")
  const userString = localStorage.getItem("user")
  
  console.log("📦 Token en localStorage:", token ? "✅ Existe" : "❌ No existe")
  console.log("📦 User en localStorage:", userString ? "✅ Existe" : "❌ No existe")
  
  if (userString) {
    try {
      const user = JSON.parse(userString)
      console.log("👤 Usuario completo:", user)
      console.log("📋 Estructura del usuario:", {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        roles: user.roles
      })
      
      // Verificar si es admin
      const isAdminByRole = user.role === "ROLE_ADMIN"
      const isAdminByRoles = Array.isArray(user.roles) && user.roles.includes("ROLE_ADMIN")
      
      console.log("🛡️ ¿Es Admin (por role)?:", isAdminByRole)
      console.log("🛡️ ¿Es Admin (por roles[])?:", isAdminByRoles)
      console.log("🛡️ ¿Es Admin (final)?:", isAdminByRole || isAdminByRoles)
      
      if (!isAdminByRole && !isAdminByRoles) {
        console.warn("⚠️ ATENCIÓN: Este usuario NO es admin")
        console.warn("   Para que sea admin, debe tener:")
        console.warn("   - role: 'ROLE_ADMIN' O")
        console.warn("   - roles: ['ROLE_ADMIN']")
      } else {
        console.log("✅ Este usuario ES admin")
      }
    } catch (error) {
      console.error("❌ Error al parsear usuario:", error)
    }
  }
  
  console.log("===================")
}

// Ejecutar automáticamente en desarrollo
if (import.meta.env.DEV) {
  // Exponer función en window para debugging desde consola
  (window as any).debugAuth = debugCurrentUser
  console.log("💡 Tip: Ejecuta debugAuth() en la consola para ver el estado de autenticación")
}
