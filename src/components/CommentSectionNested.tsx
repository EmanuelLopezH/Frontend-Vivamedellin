"use client"

import { CommentItem } from "@/components/CommentItem"
import { AddComment } from "@/components/AddComment"
import { type CommentWithReplies } from "@/services/postDetailService"

interface CommentSectionProps {
  postId: number
  comments: CommentWithReplies[]
  currentUserId?: number
  isAdmin?: boolean
  isLoggedIn: boolean
  onUpdate: () => void
}

export function CommentSection({
  postId,
  comments,
  currentUserId,
  isAdmin,
  isLoggedIn,
  onUpdate,
}: CommentSectionProps) {
  // Ordenar comentarios por fecha (más recientes primero)
  const sortedComments = [...comments].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  const handleCommentAdded = (newComment: any) => {
    // Callback cuando se agrega un nuevo comentario
    onUpdate()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
        <h2 className="text-2xl font-bold text-slate-900">
          Comentarios
        </h2>
        <span className="text-slate-500 text-sm">
          ({comments.length})
        </span>
      </div>

      {/* Formulario de nuevo comentario */}
      <AddComment
        postId={postId}
        onCommentAdded={handleCommentAdded}
        placeholder="¿Qué opinas sobre este evento?"
        buttonText="Publicar comentario"
      />

      {/* Lista de comentarios */}
      <div className="space-y-4">
        {sortedComments.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-lg">
            <p className="text-slate-600">
              Sé el primero en comentar sobre este evento
            </p>
          </div>
        ) : (
          sortedComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              postId={postId}
              currentUserId={currentUserId}
              isAdmin={isAdmin}
              onUpdate={onUpdate}
            />
          ))
        )}
      </div>
    </div>
  )
}
