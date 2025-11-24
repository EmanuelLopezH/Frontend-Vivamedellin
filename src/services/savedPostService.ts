/**
 * Servicio para manejar operaciones de posts guardados
 */

import type { Post } from "@/types/post"

const API_BASE_URL = "https://vivemedellin-backend.onrender.com/api"

interface BackendSavedPost {
  postId: number
  postTitle?: string
  content: string
  imageName?: string
  imageUrl?: string
  userName?: string
  createdAt?: string
  likes?: number
  commentsCount?: number
}

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
    console.log("📡 [savePost] Enviando petición para guardar post:", postId)
    console.log("🔑 [savePost] URL:", `${API_BASE_URL}/saved-posts/${postId}`)
    
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
    } else if (response.status === 500) {
      throw new Error("Error interno del servidor. El backend necesita ser corregido.")
    } else if (!response.ok) {
      throw new Error("Error al guardar el post. Intenta de nuevo.")
    }

    const data = await response.json()
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

/**
 * Obtener todos los posts guardados por el usuario
 * @param token - Token JWT de autenticación
 */
export const getSavedPosts = async (token: string): Promise<Post[]> => {
  try {
    console.log("🔍 [getSavedPosts] Consultando:", `${API_BASE_URL}/saved-posts`)
    console.log("🔑 [getSavedPosts] Token usado:", token.substring(0, 20) + "...")
    
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

    const data = await response.json()
    console.log("📋 [getSavedPosts] Datos recibidos del backend:", data)
    console.log("⚠️ [getSavedPosts] ADVERTENCIA: Backend devolviendo posts para todos los usuarios")
    
    // Mapear los datos del backend al formato esperado por el frontend
    const mappedData = data.map((item: BackendSavedPost) => ({
      ...item,
      id: item.postId, // Mapear postId a id
      userName: item.userName || 'Usuario desconocido',
      createdAt: item.createdAt || new Date().toISOString()
    }))
    
    console.log("🔄 [getSavedPosts] Datos mapeados:", mappedData)
    
    // SOLUCIÓN TEMPORAL: Validar cada post individualmente
    // TODO: El backend debería filtrar correctamente por usuario
    const validatedPosts = []
    for (const post of mappedData) {
      try {
        const isReallyValid = await checkIfSaved(post.id, token)
        if (isReallyValid) {
          validatedPosts.push(post)
          console.log("✅ [getSavedPosts] Post confirmado como guardado:", post.id)
        } else {
          console.log("❌ [getSavedPosts] Post NO está realmente guardado:", post.id)
        }
      } catch (error) {
        console.log("⚠️ [getSavedPosts] Error validando post:", post.id, error)
      }
    }
    
    console.log("🎯 [getSavedPosts] Posts realmente guardados:", validatedPosts)
    return validatedPosts
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
