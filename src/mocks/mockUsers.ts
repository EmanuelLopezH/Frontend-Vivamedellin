export interface User {
  id: number
  username: string
  password?: string
  name: string
}

const mockUsers = [
  { id: 1, username: "Steven", password: "1234", name: "Steven Herrera" },
  { id: 2, username: "Dahiana", password: "abcd", name: "Dahiana Ruiz" },
  { id: 3, username: "Andrés", password: "1234", name: "Andrés Pérez" },
  { id: 4, username: "Lucas", password: "abcd", name: "Lucas Hernández" },
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
  return currentUser;
}

export function clearCurrentUser() {
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