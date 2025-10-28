export interface User {
  id: number
  username: string
  password?: string
  name: string
  role: 'user' | 'admin' // Rol del usuario para permisos
}

const mockUsers = [
  { id: 1, username: "Steven", password: "1234", name: "Steven Herrera", role: "admin" as const }, // Usuario administrador
  { id: 2, username: "Dahiana", password: "abcd", name: "Dahiana Ruiz", role: "user" as const },
  { id: 3, username: "Andrés", password: "1234", name: "Andrés Pérez", role: "user" as const },
  { id: 4, username: "Lucas", password: "abcd", name: "Lucas Hernández", role: "user" as const },
]

let currentUser: User | null = null

export async function login(username: string, password: string): Promise<User> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = mockUsers.find(
        (u) => u.username === username && u.password === password
      )
      if (user) {
        const loggedUser: User = {
          id: user.id,
          username: user.username,
          name: user.name,
          role: user.role, // Incluir rol en el usuario logueado
        }
        currentUser = loggedUser
        localStorage.setItem("user", JSON.stringify(loggedUser))
        resolve(loggedUser)
      } else {
        reject(new Error("Credenciales inválidas"))
      }
    }, 800) // simulamos delay de red
  })
}

export function setCurrentUser(user: User) {
  currentUser = user;
    localStorage.setItem("user", JSON.stringify(user))
}

export function getCurrentUser(): User | null {
  if (!currentUser) {
    loadUserFromStorage()
  }
  return currentUser;
}

export function clearCurrentUser() {
  currentUser = null
  localStorage.removeItem("user")
}

export function loadUserFromStorage() {
  if (!currentUser) {
    const stored = localStorage.getItem("user")
    if (stored) {
      currentUser = JSON.parse(stored)
    }
  }
  return currentUser
}

export async function logout() {
  return new Promise((resolve) => {
    setTimeout(() => {
      clearCurrentUser()
      resolve(true)
    }, 200)
  })
}

// ========== FUNCIONES DE PERMISOS PARA ELIMINAR COMENTARIOS ==========

/**
 * Verifica si el usuario actual es administrador
 * @returns true si el usuario es admin, false en caso contrario
 */
export function isCurrentUserAdmin(): boolean {
  const user = getCurrentUser()
  return user?.role === 'admin'
}

/**
 * Verifica si el usuario actual puede eliminar un comentario específico
 * @param commentAuthorName - Nombre del autor del comentario
 * @returns true si puede eliminar (es admin o es el autor), false en caso contrario
 */
export function canDeleteComment(commentAuthorName: string): boolean {
  const currentUser = getCurrentUser()
  if (!currentUser) return false
  
  // El administrador puede eliminar cualquier comentario
  if (currentUser.role === 'admin') return true
  
  // El usuario puede eliminar sus propios comentarios
  return currentUser.name === commentAuthorName
}