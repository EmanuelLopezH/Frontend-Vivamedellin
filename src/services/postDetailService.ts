import type { Post, PostComment } from "@/types/post"
import { imageService } from "@/services/imageService"

const API_BASE_URL = "https://vivemedellin-backend.onrender.com/api"

export interface CommentWithReplies extends PostComment {
  parentCommentId: number | null
  replies: CommentWithReplies[]
  editedDate?: string
}

export const postDetailService = {
  // Obtener un post individual
  getPost: async (postId: number): Promise<Post> => {
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      return {
        id: data.postId,
        userId: data.user.id,
        userName: data.user.name,
        userImage: imageService.getImageUrl(data.user.profileImage),
        content: data.content,
        postTitle: data.postTitle,
        imageName: data.imageName,
        imageUrl: imageService.getImageUrl(data.imageName),
        createdAt: data.creationDate,
        likes: 0,
        commentsCount: data.comments?.length || 0,
        isLiked: false,
        isSaved: false,
        category: data.category ? {
          id: data.category.categoryId,
          title: data.category.categoryTitle,
          description: data.category.categoryDescription,
        } : undefined,
      }
    } catch (error) {
      console.error("Error al cargar post:", error)
      throw error
    }
  },

  // Obtener comentarios con respuestas anidadas
  getCommentsWithReplies: async (postId: number): Promise<CommentWithReplies[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      const transformComment = (comment: any): CommentWithReplies => ({
        id: comment.id,
        postId: postId,
        userId: comment.user.id,
        userName: comment.user.name,
        userImage: imageService.getImageUrl(comment.user.profileImage),
        content: comment.content,
        createdAt: comment.createdDate,
        editedDate: comment.editedDate,
        parentCommentId: comment.parentCommentId,
        replies: comment.replies?.map(transformComment) || [],
      })

      return data.map(transformComment)
    } catch (error) {
      console.error("Error al cargar comentarios:", error)
      throw error
    }
  },

  // Agregar un comentario o respuesta
  addComment: async (
    postId: number,
    content: string,
    parentCommentId?: number
  ): Promise<CommentWithReplies> => {
    const token = localStorage.getItem("token")
    const userString = localStorage.getItem("user")
    
    if (!token || !userString) {
      throw new Error("No autenticado")
    }

    const user = JSON.parse(userString)
    
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          content,
          userId: user.id,
          parentCommentId: parentCommentId || null,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      return {
        id: data.id,
        postId: postId,
        userId: data.user.id,
        userName: data.user.name,
        userImage: imageService.getImageUrl(data.user.profileImage),
        content: data.content,
        createdAt: data.createdDate,
        editedDate: data.editedDate,
        parentCommentId: data.parentCommentId,
        replies: [],
      }
    } catch (error) {
      console.error("Error al agregar comentario:", error)
      throw error
    }
  },

  // Editar un comentario
  editComment: async (
    commentId: number,
    content: string
  ): Promise<void> => {
    const token = localStorage.getItem("token")
    
    if (!token) {
      throw new Error("No autenticado")
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
    } catch (error) {
      console.error("Error al editar comentario:", error)
      throw error
    }
  },

  // Eliminar un comentario
  deleteComment: async (commentId: number): Promise<void> => {
    const token = localStorage.getItem("token")
    
    if (!token) {
      throw new Error("No autenticado")
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
    } catch (error) {
      console.error("Error al eliminar comentario:", error)
      throw error
    }
  },
}
