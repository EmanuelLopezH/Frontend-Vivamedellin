// Tipos para el sistema de Posts

export interface Post {
  id: number
  userId: number
  userName: string
  userImage?: string
  content: string
  postTitle?: string
  imageUrl?: string
  createdAt: string
  likes: number
  commentsCount: number
  isLiked?: boolean
  isSaved?: boolean
  category?: {
    id: number
    title: string
    description: string
  }
}

export interface PostComment {
  id: number
  postId: number
  userId: number
  userName: string
  userImage?: string
  content: string
  createdAt: string
}

export interface CreatePostRequest {
  content: string
  imageUrl?: string
}

export interface CreateCommentRequest {
  postId: number
  content: string
}
