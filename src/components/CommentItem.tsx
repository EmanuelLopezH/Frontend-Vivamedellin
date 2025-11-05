"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { MessageCircle, Edit, Trash2, MoreVertical } from "lucide-react"
import { AddComment } from "@/components/AddComment"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { postDetailService, type CommentWithReplies } from "@/services/postDetailService"

interface CommentItemProps {
  comment: CommentWithReplies
  postId: number
  currentUserId?: number
  isAdmin?: boolean
  onUpdate: () => void
  depth?: number
}

export function CommentItem({ 
  comment, 
  postId, 
  currentUserId, 
  isAdmin, 
  onUpdate,
  depth = 0 
}: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(comment.content)
  const [isDeleting, setIsDeleting] = useState(false)

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
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

  const handleReplyAdded = (newReply: any) => {
    // Callback cuando se agrega una respuesta
    setShowReplyForm(false)
    onUpdate()
  }

  const handleEdit = async () => {
    if (!editText.trim()) return

    try {
      await postDetailService.editComment(comment.id, editText)
      setIsEditing(false)
      onUpdate()
    } catch (error) {
      console.error("Error al editar:", error)
      alert("Error al editar comentario")
    }
  }

  const handleDelete = async () => {
    if (!window.confirm("¿Estás seguro de eliminar este comentario?")) {
      return
    }

    setIsDeleting(true)
    try {
      await postDetailService.deleteComment(comment.id)
      onUpdate()
    } catch (error) {
      console.error("Error al eliminar:", error)
      alert("Error al eliminar comentario")
    } finally {
      setIsDeleting(false)
    }
  }

  const canEditOrDelete = isAdmin || currentUserId === comment.userId
  const maxDepth = 3 // Máximo nivel de anidación

  // Debug: Verificar permisos
  console.log("🔍 [CommentItem]", {
    commentId: comment.id,
    isAdmin,
    currentUserId,
    commentUserId: comment.userId,
    canEditOrDelete
  })

  return (
    <div 
      className={`${depth > 0 ? 'ml-8 pl-4 border-l-2 border-slate-200' : ''} mb-4`}
      style={{ opacity: isDeleting ? 0.5 : 1 }}
    >
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
          {comment.userName[0].toUpperCase()}
        </div>

        {/* Contenido */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-slate-900 text-sm">
              {comment.userName}
            </span>
            <span className="text-slate-500 text-xs">
              {formatTimeAgo(comment.createdAt)}
            </span>
            {comment.editedDate && (
              <span className="text-slate-400 text-xs italic">(editado)</span>
            )}
          </div>

          {/* Texto del comentario o formulario de edición */}
          {isEditing ? (
            <div className="mb-3">
              <Textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="mb-2 text-sm"
                rows={3}
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleEdit}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Guardar
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setIsEditing(false)
                    setEditText(comment.content)
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-slate-700 text-sm mb-2 whitespace-pre-wrap">
              {comment.content}
            </p>
          )}

          {/* Acciones */}
          {!isEditing && (
            <div className="flex items-center gap-3">
              {depth < maxDepth && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowReplyForm(!showReplyForm)}
                  className="h-7 text-xs text-slate-600 hover:text-blue-600"
                >
                  <MessageCircle className="h-3 w-3 mr-1" />
                  Responder
                </Button>
              )}

              {canEditOrDelete && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 text-slate-500 hover:text-slate-700"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setIsEditing(true)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={handleDelete}
                      className="text-red-600 focus:text-red-700"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          )}

          {/* Formulario de respuesta */}
          {showReplyForm && (
            <div className="mt-3 mb-3">
              <AddComment
                postId={postId}
                parentCommentId={comment.id}
                onCommentAdded={handleReplyAdded}
                placeholder="Escribe tu respuesta..."
                buttonText="Responder"
                compact
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowReplyForm(false)}
                className="mt-2"
              >
                Cancelar
              </Button>
            </div>
          )}

          {/* Respuestas anidadas */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-3">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  postId={postId}
                  currentUserId={currentUserId}
                  isAdmin={isAdmin}
                  onUpdate={onUpdate}
                  depth={depth + 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
