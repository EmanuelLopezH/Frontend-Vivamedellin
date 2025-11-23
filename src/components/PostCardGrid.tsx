"use client"

import { useNavigate } from "react-router-dom"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SaveButton } from "@/components/SaveButton"
import { MessageCircle, Heart, Share2, Edit, Trash2 } from "lucide-react"
import type { Post } from "@/types/post"
import { postServiceBackend } from "@/services/postServiceBackend"
import { useState } from "react"

interface PostCardGridProps {
  post: Post
  onUpdate: () => void
  isLoggedIn: boolean
  isAdmin?: boolean
  currentUserId?: number
}

// Colores para categorías
const categoryColors: Record<string, string> = {
  "Música": "bg-purple-100 text-purple-700 hover:bg-purple-200",
  "Deportes": "bg-green-100 text-green-700 hover:bg-green-200",
  "Cultura": "bg-blue-100 text-blue-700 hover:bg-blue-200",
  "Gastronomía": "bg-orange-100 text-orange-700 hover:bg-orange-200",
  "Tecnología": "bg-cyan-100 text-cyan-700 hover:bg-cyan-200",
  "Arte": "bg-pink-100 text-pink-700 hover:bg-pink-200",
  "default": "bg-slate-100 text-slate-700 hover:bg-slate-200"
}

export function PostCardGrid({ post, onUpdate, isLoggedIn, isAdmin, currentUserId }: PostCardGridProps) {
  const navigate = useNavigate()
  const [isDeleting, setIsDeleting] = useState(false)

  const formatTimeAgo = (dateString: string) => {
    // Formato backend: "2025-11-03 04:13:40"
    const date = new Date(dateString.replace(' ', 'T'))
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInMinutes = Math.floor(diffInMs / 60000)
    const diffInHours = Math.floor(diffInMs / 3600000)
    const diffInDays = Math.floor(diffInMs / 86400000)

    if (diffInMinutes < 1) return "ahora"
    if (diffInMinutes < 60) return `hace ${diffInMinutes}m`
    if (diffInHours < 24) return `hace ${diffInHours}h`
    if (diffInDays < 7) return `hace ${diffInDays}d`
    return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })
  }

  const getCategoryColor = (categoryTitle?: string) => {
    if (!categoryTitle) return categoryColors.default
    return categoryColors[categoryTitle] || categoryColors.default
  }

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + "..."
  }

  const handleCardClick = () => {
    navigate(`/post/${post.id}`)
  }

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (!window.confirm("¿Estás seguro de eliminar este post?")) {
      return
    }

    setIsDeleting(true)
    try {
      await postServiceBackend.deletePost(post.id)
      onUpdate()
    } catch (error) {
      console.error("Error al eliminar:", error)
      alert("Error al eliminar el post")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`)
    alert("¡Enlace copiado al portapapeles!")
  }

  const canEditOrDelete = isAdmin || currentUserId === post.userId

  return (
    <Card
      onClick={handleCardClick}
      className="group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white"
    >
      {/* Imagen del evento */}
      <div className="relative w-full h-48 bg-gradient-to-br from-slate-200 to-slate-300 overflow-hidden">
        {post.imageUrl ? (
          <img
            src={post.imageUrl}
            alt={post.postTitle || "Post image"}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <div className="text-6xl">🎉</div>
          </div>
        )}
        
        {/* Badge de categoría */}
        {post.category && (
          <Badge className={`absolute top-3 left-3 font-medium ${getCategoryColor(post.category.title)}`}>
            {post.category.title}
          </Badge>
        )}
      </div>

      {/* Contenido */}
      <div className="p-5">
        {/* Header: Autor y tiempo */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
            {post.userName[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-700 truncate">{post.userName}</p>
          </div>
          <span className="text-xs text-slate-500">{formatTimeAgo(post.createdAt)}</span>
        </div>

        {/* Título del post */}
        {post.postTitle && (
          <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {post.postTitle}
          </h3>
        )}

        {/* Contenido (extracto) */}
        <p className="text-sm text-slate-600 mb-4 line-clamp-3">
          {truncateText(post.content, 150)}
        </p>

        {/* Acciones */}
        <div className="flex items-center gap-2 pt-3 border-t border-slate-200">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 text-slate-600 hover:text-blue-600 hover:bg-blue-50"
            onClick={(e) => {
              e.stopPropagation()
              navigate(`/post/${post.id}`)
            }}
          >
            <MessageCircle className="h-4 w-4 mr-1" />
            <span className="text-xs">{post.commentsCount}</span>
          </Button>

          <div className="flex-1" onClick={(e) => e.stopPropagation()}>
            <SaveButton
              postId={post.id}
              initialSaved={post.isSaved}
              variant="ghost"
              size="sm"
              showLabel
            />
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="flex-1 text-slate-600 hover:text-green-600 hover:bg-green-50"
          >
            <Share2 className="h-4 w-4 mr-1" />
            <span className="text-xs">Compartir</span>
          </Button>

          {/* Botones de editar/eliminar (solo si es admin o autor) */}
          {canEditOrDelete && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  navigate(`/post/${post.id}/edit`)
                }}
                className="text-slate-600 hover:text-blue-600 hover:bg-blue-50"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-slate-600 hover:text-red-600 hover:bg-red-50"
              >
                {isDeleting ? (
                  <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  )
}
