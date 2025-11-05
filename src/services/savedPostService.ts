/**
 * Servicio para manejar operaciones de posts guardados
 */

const API_BASE_URL = "http://localhost:8080/api"

export interface SavePostResponse {
  message: string
}

export interface CheckSavedResponse {
  saved: boolean
}

/**
 * Guardar un post
 * @param postId - ID del post a guardar
 * @param token - Token JWT de autenticación
 */
export const savePost = async (postId: number, token: string): Promise<SavePostResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/saved-posts/${postId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (response.status === 401) {
      throw new Error("Tu sesión ha expirado. Inicia sesión nuevamente.")
    } else if (response.status === 403) {
      throw new Error("No tienes permisos para guardar posts.")
    } else if (response.status === 404) {
      throw new Error("El post no existe.")
    } else if (!response.ok) {
      throw new Error("Error al guardar el post. Intenta de nuevo.")
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error en savePost:", error)
    throw error
  }
}

/**
 * Dejar de guardar un post
 * @param postId - ID del post a eliminar de guardados
 * @param token - Token JWT de autenticación
 */
export const unsavePost = async (postId: number, token: string): Promise<SavePostResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/saved-posts/${postId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (response.status === 401) {
      throw new Error("Tu sesión ha expirado. Inicia sesión nuevamente.")
    } else if (response.status === 403) {
      throw new Error("No tienes permisos.")
    } else if (response.status === 404) {
      throw new Error("El post no existe.")
    } else if (!response.ok) {
      throw new Error("Error al quitar el post de guardados. Intenta de nuevo.")
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error en unsavePost:", error)
    throw error
  }
}

/**
 * Verificar si un post está guardado
 * @param postId - ID del post a verificar
 * @param token - Token JWT de autenticación
 */
export const checkIfSaved = async (postId: number, token: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/saved-posts/${postId}/check`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (response.status === 401) {
      // Sesión expirada, no está guardado
      return false
    } else if (!response.ok) {
      return false
    }

    const data: CheckSavedResponse = await response.json()
    return data.saved
  } catch (error) {
    console.error("Error en checkIfSaved:", error)
    return false
  }
}

export const savedPostService = {
  savePost,
  unsavePost,
  checkIfSaved,
}
