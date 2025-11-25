/**
 * Utilidades de autenticación y autorización
 */

export interface User {
  id: number
  name: string
  email?: string
  role?: string
  roles?: string[]
}

/**
 * Obtener el usuario actual desde localStorage
 */
export function getCurrentUser(): User | null {
  try {
    const userString = localStorage.getItem('user')
    if (!userString) return null
    
    const user = JSON.parse(userString)
    
    // Migrar formato de roles si es necesario (ROLE_ADMIN → ADMIN)
    if (user.roles) {
      user.roles = user.roles.map((role: string) => 
        role.startsWith('ROLE_') ? role.substring(5) : role
      )
    }
    if (user.role && user.role.startsWith('ROLE_')) {
      user.role = user.role.substring(5)
    }
    
    return user
  } catch (error) {
    console.error('Error parsing user data:', error)
    return null
  }
}

/**
 * Verificar si el usuario es administrador
 */
export function isAdminUser(user: User | null): boolean {
  if (!user) return false
  
  // Verificar en roles array
  if (user.roles && Array.isArray(user.roles)) {
    return user.roles.includes('ADMIN')
  }
  
  // Verificar en role string
  if (user.role) {
    return user.role === 'ADMIN'
  }
  
  return false
}

/**
 * Verificar si el usuario puede editar un post
 */
export function canUserEditPost(user: User | null, post: { userId?: number; id?: number } | null): boolean {
  if (!user || !post) return false
  
  // Los admins pueden editar cualquier post
  if (isAdminUser(user)) return true
  
  // Los usuarios solo pueden editar sus propios posts
  return user.id === post.userId
}

/**
 * Verificar si el usuario puede eliminar un comentario
 */
export function canUserDeleteComment(user: User | null, comment: { userId?: number } | null): boolean {
  if (!user || !comment) return false
  
  // Los admins pueden eliminar cualquier comentario
  if (isAdminUser(user)) return true
  
  // Los usuarios solo pueden eliminar sus propios comentarios
  return user.id === comment.userId
}
