"use client"

import { CommentForm } from "@/components/CommentForm"
import { EventComment } from "@/mocks/mockComments";
import { commentService } from "@/services/commentService";
import { useEffect, useState } from "react";
import { CommentList } from "./CommentList";

type Props = {
  eventId: number;
  isLoggedIn: boolean;
  name?: string; // para autor al agregar (simulado)
  onLogin?: () => void;
};

export function CommentSection({ eventId, isLoggedIn, name = "Guest", onLogin }: Props) {
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
      await commentService.addComment(eventId, content, parentId);
      const updated = await commentService.getCommentsByEventId(eventId);
      // llamamos al service (mock ahora, fetch real luego)
      // actualizar estado (nuevo al principio)
      setComments(updated);
      setReplyTo(null); // limpiar respuesta
    } finally {
      setSubmitting(false);
    }
  };

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