import type { Post, PostComment } from "@/types/post"

const API_BASE_URL = "http://localhost:8081/api"

interface BackendPostsResponse {
  content: Array<{
    postId: number
    postTitle: string
    content: string
    imageName: string
    imageUrl: string
    creationDate: string
    user: {
      id: number
      name: string
      profileImage: string | null
    }
    category: {
      categoryId: number
      categoryTitle: string
      categoryDescription: string
    }
    comments: any[]
  }>
  pageNumber: number
  pageSize: number
  totalElements: number
  totalPages: number
  lastpage: boolean
}

export const postServiceBackend = {
  // Obtener posts con paginación desde el backend
  getPosts: async (pageNumber: number = 0, pageSize: number = 10): Promise<{
    posts: Post[]
    pageNumber: number
    pageSize: number
    totalElements: number
    totalPages: number
    lastPage: boolean
  }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/posts?pageNumber=${pageNumber}&pageSize=${pageSize}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: BackendPostsResponse = await response.json()
      
      // Transformar la respuesta del backend al formato de nuestro Post interface
      const posts: Post[] = data.content.map((post) => ({
        id: post.postId,
        userId: post.user.id,
        userName: post.user.name,
        userImage: post.user.profileImage || undefined,
        content: post.content,
        postTitle: post.postTitle,
        imageUrl: post.imageUrl,
        createdAt: post.creationDate,
        likes: 0, // Por ahora, hasta que el backend tenga likes
        commentsCount: post.comments?.length || 0,
        isLiked: false,
        isSaved: false,
        category: {
          id: post.category.categoryId,
          title: post.category.categoryTitle,
          description: post.category.categoryDescription,
        },
      }))

      return {
        posts,
        pageNumber: data.pageNumber,
        pageSize: data.pageSize,
        totalElements: data.totalElements,
        totalPages: data.totalPages,
        lastPage: data.lastpage,
      }
    } catch (error) {
      console.error("Error al cargar posts:", error)
      throw error
    }
  },

  // Crear un nuevo post (requiere autenticación)
  createPost: async (
    title: string,
    content: string,
    categoryId: number
  ): Promise<Post> => {
    const token = localStorage.getItem("token")
    const userString = localStorage.getItem("user")
    
    if (!token || !userString) {
      throw new Error("No autenticado")
    }

    const user = JSON.parse(userString)
    
    try {
      const response = await fetch(`${API_BASE_URL}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          postTitle: title,
          content,
          categoryId,
          userId: user.id,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      return {
        id: data.postId,
        userId: data.user.id,
        userName: data.user.name,
        userImage: data.user.profileImage || undefined,
        content: data.content,
        postTitle: data.postTitle,
        imageUrl: data.imageUrl,
        createdAt: data.creationDate,
        likes: 0,
        commentsCount: 0,
        isLiked: false,
        isSaved: false,
        category: data.category ? {
          id: data.category.categoryId,
          title: data.category.categoryTitle,
          description: data.category.categoryDescription,
        } : undefined,
      }
    } catch (error) {
      console.error("Error al crear post:", error)
      throw error
    }
  },

  // Toggle save/favorito en un post (requiere autenticación)
  toggleSave: async (postId: number): Promise<void> => {
    const token = localStorage.getItem("token")
    
    if (!token) {
      throw new Error("Debes iniciar sesión para guardar posts")
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${postId}/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
    } catch (error) {
      console.error("Error al guardar post:", error)
      throw error
    }
  },

  // Obtener comentarios de un post
  getComments: async (postId: number): Promise<PostComment[]> => {
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
      
      return data.map((comment: any) => ({
        id: comment.commentId,
        postId: comment.postId,
        userId: comment.user.id,
        userName: comment.user.name,
        userImage: comment.user.profileImage || undefined,
        content: comment.content,
        createdAt: comment.creationDate,
      }))
    } catch (error) {
      console.error("Error al cargar comentarios:", error)
      throw error
    }
  },

  // Agregar un comentario (requiere autenticación)
  addComment: async (
    postId: number,
    content: string
  ): Promise<PostComment> => {
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
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      return {
        id: data.commentId,
        postId: data.postId,
        userId: data.user.id,
        userName: data.user.name,
        userImage: data.user.profileImage || undefined,
        content: data.content,
        createdAt: data.creationDate,
      }
    } catch (error) {
      console.error("Error al agregar comentario:", error)
      throw error
    }
  },

  // Eliminar un post (solo admin o autor)
  deletePost: async (postId: number): Promise<void> => {
    const token = localStorage.getItem("token")
    
    if (!token) {
      throw new Error("No autenticado")
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
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
      console.error("Error al eliminar post:", error)
      throw error
    }
  },
}
