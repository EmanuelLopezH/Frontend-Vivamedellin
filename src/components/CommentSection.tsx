"use client"

import { CommentCard } from "@/components/CommentCard"
import { CommentForm } from "@/components/CommentForm"
import { EventComment } from "@/mocks/mockComments";
import { commentService } from "@/services/commentService";
import { useEffect, useState } from "react";
import { CommentList } from "./CommentList";

type Props = {
  eventId: number;
  isLoggedIn: boolean;
  currentUserName?: string; // para autor al agregar (simulado)
  onLogin?: () => void;
};

/*interface Comment {
  id: number
  author: string
  content: string
  createdAt: string
  avatarUrl?: string
}*/

/*interface CommentSectionProps {
  comments: Comment[]
  isLoggedIn: boolean
  onAddComment: (content: string) => void
  onLogin?: () => void
}*/

export function CommentSection({ eventId, isLoggedIn, currentUserName = "Guest", onLogin }: Props) {
  const [comments, setComments] = useState<EventComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [replyTo, setReplyTo] = useState<number | null>(null); // id del comentario al que se responde

  useEffect(() => {
    setLoading(true);
    commentService.getCommentsByEventId(eventId).then((data) => {
      setComments(data);
      setLoading(false);
    });
  }, [eventId]);

  
  const handleAddComment = async (content: string, parentId?: number) => {
    if (!content.trim()) return;
    setSubmitting(true);
    try {
      // llamamos al service (mock ahora, fetch real luego)
      const newComment = await commentService.addComment(eventId, currentUserName, content, parentId);
      // actualizar estado (nuevo al principio)
      setComments((prev) => [newComment, ...prev]);
      setReplyTo(null); // limpiar respuesta
    } finally {
      setSubmitting(false);
    }
  };
  
  /*return (
    <section>
      <h3 className="text-xl font-semibold mb-10">Comments</h3>

      {/* Aquí se muestra la caja para comentar }
      <div className="mb-6">
        <CommentForm
          onAddComment={onAddComment}
          isLoggedIn={isLoggedIn}
          onLogin={onLogin}
        />
      </div>

      {/* Lista de comentarios }
      {comments.length > 0 ? (
        <div className="space-y-3">
          {comments.map((c) => (
            <CommentCard
              key={c.id}
              author={c.author}
              content={c.content}
              createdAt={c.createdAt}
              avatarUrl={c.avatarUrl}
            />
          ))}
        </div>
      ) : (
        <p className="text-slate-500">There are no comments for this event yet.</p>
      )}
    </section>
  )
}*/

  return (
    <section>
      <h3 className="text-xl font-semibold mb-6">Comments</h3>

      {/* Aquí se muestra el formulario de comentario principal */}
      <div className="mb-6">
        <CommentForm
          onAddComment={handleAddComment}
          isLoggedIn={isLoggedIn}
          onLogin={onLogin}
        />
      </div>

      {loading ? (
        <p className="text-slate-500">Cargando comentarios...</p>
      ) : (
        <CommentList 
          comments={comments}
          onReply={(id) => setReplyTo(id)}
          replyTo={replyTo}
          onAddReply={(content, parentId) => handleAddComment(content, parentId)}
          isLoggedIn={isLoggedIn}
          onLogin={onLogin}/>
      )}
    </section>
  );
}