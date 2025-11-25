/**
 * Servicio para manejar operaciones de posts guardados
 */

interface User {
  id: number
  name: string
  profileImage: string
}

interface Category {
  categoryId: number
  categoryTitle: string
  categoryDescription: string
}

interface Comment {
  id: number
  content: string
  createdDate: string
  editedDate: string
  user: User
  parentCommentId: number
  replies: string[]
}

export interface SavedPost {
  postId: number
  postTitle: string
  content: string
  imageName: string
  imageUrl: string
  creationDate: string
  user: User
  category: Category
  comments: Comment[]
}

export interface SavePostResponse {
  message: string
  success: boolean
  token: string
}

const API_BASE_URL = "https://vivemedellin-backend.onrender.com/api"

/**
 * Guardar un post
 * @param postId - ID del post a guardar
 */
export const savePost = async (postId: number): Promise<SavePostResponse> => {
  const token = localStorage.getItem("token")
  if (!token) {
    throw new Error("No hay token de autenticación")
  }

  try {
    console.log("📡 [savePost] Enviando petición para guardar post:", postId)
    
    const response = await fetch(`${API_BASE_URL}/saved-posts/${postId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
    
    console.log("📡 [savePost] Status response:", response.status)

    if (response.status === 401) {
      throw new Error("Tu sesión ha expirado. Inicia sesión nuevamente.")
    } else if (response.status === 403) {
      throw new Error("No tienes permisos para guardar posts.")
    } else if (response.status === 404) {
      throw new Error("El post no existe.")
    } else if (!response.ok) {
      throw new Error("Error al guardar el post. Intenta de nuevo.")
    }

    const data: SavePostResponse = await response.json()
    console.log("✅ [savePost] Post guardado exitosamente:", data)
    return data
  } catch (error) {
    console.error("Error en savePost:", error)
    throw error
  }
}

/**
 * Dejar de guardar un post
 * @param postId - ID del post a eliminar de guardados
 */
export const unsavePost = async (postId: number): Promise<SavePostResponse> => {
  const token = localStorage.getItem("token")
  if (!token) {
    throw new Error("No hay token de autenticación")
  }

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

    const data: SavePostResponse = await response.json()
    return data
  } catch (error) {
    console.error("Error en unsavePost:", error)
    throw error
  }
}

/**
 * Verificar si un post está guardado
 * @param postId - ID del post a verificar
 */
export const checkIfSaved = async (postId: number): Promise<boolean> => {
  const token = localStorage.getItem("token")
  if (!token) {
    return false
  }

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

    // El endpoint devuelve directamente un boolean
    const isaved: boolean = await response.json()
    return isaved
  } catch (error) {
    console.error("Error en checkIfSaved:", error)
    return false
  }
}

/**
 * Obtener todos los posts guardados por el usuario
 */
export const getSavedPosts = async (): Promise<SavedPost[]> => {
  const token = localStorage.getItem("token")
  if (!token) {
    throw new Error("No hay token de autenticación")
  }

  try {
    console.log("🔍 [getSavedPosts] Consultando:", `${API_BASE_URL}/saved-posts`)
    
    const response = await fetch(`${API_BASE_URL}/saved-posts`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    console.log("📡 [getSavedPosts] Status:", response.status)
    
    if (response.status === 401) {
      throw new Error("Tu sesión ha expirado. Inicia sesión nuevamente.")
    } else if (!response.ok) {
      throw new Error("Error al cargar posts guardados.")
    }

    const data: SavedPost[] = await response.json()
    console.log("📋 [getSavedPosts] Posts guardados recibidos:", data)
    
    return data
  } catch (error) {
    console.error("Error en getSavedPosts:", error)
    throw error
  }
}

export const savedPostService = {
  savePost,
  unsavePost,
  checkIfSaved,
  getSavedPosts,
}
