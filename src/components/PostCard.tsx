"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Heart, MessageCircle, Share2, Send } from "lucide-react"
import { OptimizedImage } from "@/components/OptimizedImage"
import type { Post } from "@/types/post"
import { postService } from "@/services/postService"

interface PostCardProps {
  post: Post
  onUpdate: () => void
}

export function PostCard({ post, onUpdate }: PostCardProps) {
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState("")
  const [isLiking, setIsLiking] = useState(false)
  const [isCommenting, setIsCommenting] = useState(false)

  const getUserInfo = () => {
    const userString = localStorage.getItem("user")
    if (userString) {
      const user = JSON.parse(userString)
      return { id: user.id, name: user.name }
    }
    return null
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInMinutes = Math.floor(diffInMs / 60000)
    const diffInHours = Math.floor(diffInMs / 3600000)
    const diffInDays = Math.floor(diffInMs / 86400000)

    if (diffInMinutes < 1) return "Ahora"
    if (diffInMinutes < 60) return `${diffInMinutes}m`
    if (diffInHours < 24) return `${diffInHours}h`
    if (diffInDays < 7) return `${diffInDays}d`
    return date.toLocaleDateString()
  }

  const handleLike = async () => {
    setIsLiking(true)
    try {
      await postService.toggleLike(post.id)
      onUpdate()
    } finally {
      setIsLiking(false)
    }
  }

  const handleComment = async () => {
    if (!commentText.trim()) return

    const user = getUserInfo()
    if (!user) {
      alert("Debes iniciar sesión para comentar")
      return
    }

    setIsCommenting(true)
    try {
      await postService.addComment(post.id, commentText, user.id, user.name)
      setCommentText("")
      onUpdate()
    } catch (error) {
      console.error("Error al comentar:", error)
      alert("Error al agregar comentario")
    } finally {
      setIsCommenting(false)
    }
  }

  return (
    <Card className="p-6 mb-4 bg-white shadow-md hover:shadow-lg transition-shadow">
      {/* Header del post */}
      <div className="flex items-start gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-semibold flex-shrink-0">
          {post.userName?.[0]?.toUpperCase() || "?"}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-slate-900 truncate">{post.userName}</h3>
            <span className="text-slate-500 text-sm">·</span>
            <span className="text-slate-500 text-sm">{formatTimeAgo(post.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Contenido del post */}
      <div className="mb-4">
        <p className="text-slate-800 whitespace-pre-wrap">{post.content}</p>
      </div>

      {/* Imagen (si existe) */}
      <div className="mb-4">
        <OptimizedImage
          imageName={post.imageName}
          alt="Post image"
          className="w-full rounded-lg max-h-96"
          fallback={null}
        />
      </div>

      {/* Estadísticas */}
      <div className="flex items-center gap-4 py-3 border-t border-b border-slate-200 text-sm text-slate-600">
        <span>{post.likes} me gusta</span>
        <span>{post.commentsCount} comentarios</span>
      </div>

      {/* Acciones */}
      <div className="flex items-center gap-2 pt-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLike}
          disabled={isLiking}
          className={`flex-1 ${post.isLiked ? "text-red-600 hover:text-red-700" : "text-slate-600 hover:text-red-600"}`}
        >
          <Heart className={`h-4 w-4 mr-2 ${post.isLiked ? "fill-current" : ""}`} />
          Me gusta
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowComments(!showComments)}
          className="flex-1 text-slate-600 hover:text-blue-600"
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Comentar
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex-1 text-slate-600 hover:text-green-600"
          disabled
        >
          <Share2 className="h-4 w-4 mr-2" />
          Compartir
        </Button>
      </div>

      {/* Sección de comentarios */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-slate-200">
          <div className="flex gap-2">
            <Textarea
              placeholder="Escribe un comentario..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="min-h-[60px] resize-none"
            />
            <Button
              onClick={handleComment}
              disabled={!commentText.trim() || isCommenting}
              size="sm"
              className="self-end"
            >
              {isCommenting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}
