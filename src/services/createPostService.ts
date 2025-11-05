/**
 * Servicio para crear nuevos posts con imágenes
 */

const API_BASE_URL = "http://localhost:8080/api"

export interface CreatePostData {
  postTitle: string
  content: string
  image?: File
}

export interface CreatePostResponse {
  postId: number
  postTitle: string
  content: string
  imageName: string | null
  addedDate: string
  category: {
    categoryId: number
    categoryTitle: string
  }
  user: {
    id: number
    name: string
    profileImage: string | null
  }
}

/**
 * Crear un nuevo post
 * @param userId - ID del usuario que crea el post
 * @param categoryId - ID de la categoría del post
 * @param data - Datos del post (título, contenido, imagen)
 * @param token - Token JWT de autenticación
 */
export const createPost = async (
  userId: number,
  categoryId: number,
  data: CreatePostData,
  token: string
): Promise<CreatePostResponse> => {
  try {
    // Crear FormData para enviar multipart/form-data
    const formData = new FormData()
    formData.append("postTitle", data.postTitle)
    formData.append("content", data.content)
    
    if (data.image) {
      formData.append("image", data.image)
    }

    const response = await fetch(
      `${API_BASE_URL}/user/${userId}/category/${categoryId}/posts`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // NO incluir Content-Type, el navegador lo establece automáticamente con boundary
        },
        body: formData,
      }
    )

    if (response.status === 401) {
      throw new Error("Tu sesión ha expirado. Inicia sesión nuevamente.")
    } else if (response.status === 403) {
      throw new Error("No tienes permisos para crear posts.")
    } else if (response.status === 404) {
      throw new Error("Usuario o categoría no encontrados.")
    } else if (!response.ok) {
      throw new Error("Error al crear el post. Intenta de nuevo.")
    }

    const result = await response.json()
    return result
  } catch (error) {
    console.error("Error en createPost:", error)
    throw error
  }
}

export const createPostService = {
  createPost,
}
