import type { Post, PostComment } from "@/types/post"

// Mock data de posts
export const mockPosts: Post[] = [
  {
    id: 1,
    userId: 1,
    userName: "Steven Herrera",
    userImage: undefined,
    content: "¡No puedo esperar para el concierto de Bad Bunny! 🐰🔥 ¿Quién más va?",
    imageUrl: undefined,
    createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hora atrás
    likes: 24,
    commentsCount: 5,
    isLiked: false
  },
  {
    id: 2,
    userId: 2,
    userName: "Dahiana Ruiz",
    userImage: undefined,
    content: "Acabo de comprar mis boletas para Guns N' Roses! 🎸 Después de tantos años, finalmente vienen a Medellín. ¡Será épico!",
    imageUrl: undefined,
    createdAt: new Date(Date.now() - 7200000).toISOString(), // 2 horas atrás
    likes: 42,
    commentsCount: 8,
    isLiked: false
  },
  {
    id: 3,
    userId: 3,
    userName: "Andrés Pérez",
    userImage: undefined,
    content: "¿Alguien sabe de eventos culturales este fin de semana? Busco algo diferente 🎭",
    imageUrl: undefined,
    createdAt: new Date(Date.now() - 14400000).toISOString(), // 4 horas atrás
    likes: 12,
    commentsCount: 15,
    isLiked: false
  },
  {
    id: 4,
    userId: 4,
    userName: "Lucas Hernández",
    userImage: undefined,
    content: "El ambiente en el Parque Lleras anoche estuvo increíble! Medellín tiene la mejor vida nocturna 🌃✨",
    imageUrl: undefined,
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 día atrás
    likes: 67,
    commentsCount: 12,
    isLiked: false
  }
]

// Mock data de comentarios
export const mockComments: PostComment[] = [
  {
    id: 1,
    postId: 1,
    userId: 2,
    userName: "Dahiana Ruiz",
    userImage: undefined,
    content: "¡Yo voy! Ya tengo mi boleta en zona VIP 🎉",
    createdAt: new Date(Date.now() - 1800000).toISOString()
  },
  {
    id: 2,
    postId: 1,
    userId: 3,
    userName: "Andrés Pérez",
    userImage: undefined,
    content: "Yo también! Nos vemos allá 🙌",
    createdAt: new Date(Date.now() - 1200000).toISOString()
  }
]

// Servicio para posts (mock por ahora, luego se conectará al backend)
export const postService = {
  // Obtener todos los posts
  async getPosts(): Promise<Post[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const storedPosts = localStorage.getItem("mockPosts")
        if (storedPosts) {
          resolve(JSON.parse(storedPosts))
        } else {
          localStorage.setItem("mockPosts", JSON.stringify(mockPosts))
          resolve(mockPosts)
        }
      }, 500)
    })
  },

  // Crear un nuevo post
  async createPost(content: string, userId: number, userName: string): Promise<Post> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const storedPosts = localStorage.getItem("mockPosts")
        const posts = storedPosts ? JSON.parse(storedPosts) : mockPosts
        
        const newPost: Post = {
          id: posts.length + 1,
          userId,
          userName,
          userImage: undefined,
          content,
          imageUrl: undefined,
          createdAt: new Date().toISOString(),
          likes: 0,
          commentsCount: 0,
          isLiked: false
        }
        
        const updatedPosts = [newPost, ...posts]
        localStorage.setItem("mockPosts", JSON.stringify(updatedPosts))
        resolve(newPost)
      }, 500)
    })
  },

  // Dar like a un post
  async toggleLike(postId: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const storedPosts = localStorage.getItem("mockPosts")
        const posts: Post[] = storedPosts ? JSON.parse(storedPosts) : mockPosts
        
        const postIndex = posts.findIndex(p => p.id === postId)
        if (postIndex !== -1) {
          posts[postIndex].isLiked = !posts[postIndex].isLiked
          posts[postIndex].likes += posts[postIndex].isLiked ? 1 : -1
          localStorage.setItem("mockPosts", JSON.stringify(posts))
        }
        
        resolve()
      }, 300)
    })
  },

  // Obtener comentarios de un post
  async getComments(postId: number): Promise<PostComment[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const storedComments = localStorage.getItem("mockPostComments")
        const comments = storedComments ? JSON.parse(storedComments) : mockComments
        resolve(comments.filter(c => c.postId === postId))
      }, 300)
    })
  },

  // Agregar comentario a un post
  async addComment(postId: number, content: string, userId: number, userName: string): Promise<PostComment> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const storedComments = localStorage.getItem("mockPostComments")
        const comments = storedComments ? JSON.parse(storedComments) : mockComments
        
        const newComment: PostComment = {
          id: comments.length + 1,
          postId,
          userId,
          userName,
          userImage: undefined,
          content,
          createdAt: new Date().toISOString()
        }
        
        const updatedComments = [...comments, newComment]
        localStorage.setItem("mockPostComments", JSON.stringify(updatedComments))
        
        // Actualizar contador de comentarios del post
        const storedPosts = localStorage.getItem("mockPosts")
        const posts: Post[] = storedPosts ? JSON.parse(storedPosts) : mockPosts
        const postIndex = posts.findIndex(p => p.id === postId)
        if (postIndex !== -1) {
          posts[postIndex].commentsCount++
          localStorage.setItem("mockPosts", JSON.stringify(posts))
        }
        
        resolve(newComment)
      }, 500)
    })
  }
}
