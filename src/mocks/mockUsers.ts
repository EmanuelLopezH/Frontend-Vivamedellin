const mockUsers = [
  { id: 1, username: "Steven", password: "1234", name: "Administrador" },
  { id: 2, username: "Dahiana", password: "abcd", name: "Dahiana" },
  { id: 3, username: "Steven", password: "1234", name: "Administrador" },
  { id: 4, username: "Dahiana", password: "abcd", name: "Dahiana" },
]

export async function login(username: string, password: string) {
  // Simulamos delay de red
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = mockUsers.find(
        (u) => u.username === username && u.password === password
      )
      if (user) {
        // En backend real aquí devolvería un token
        resolve({
          id: user.id,
          username: user.username,
          name: user.name,
          token: "fake-jwt-token",
        })
      } else {
        reject(new Error("Credenciales inválidas"))
      }
    }, 800)
  })
}

export async function logout() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), 200)
  })
}