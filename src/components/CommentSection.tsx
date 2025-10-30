"use client"

import { CommentForm } from "@/components/CommentForm"
import { EventComment } from "@/mocks/mockComments";
import { commentService } from "@/services/commentService";
import { useEffect, useState } from "react";
import { CommentList } from "./CommentList";
import { DeleteCommentDialog } from "./DeleteCommentDialog";

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
  
  // Estados para el diálogo de eliminación
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<EventComment | null>(null);
  const [deleting, setDeleting] = useState(false);

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

  /**
   * Maneja la apertura del diálogo de confirmación de eliminación
   * @param comment - Comentario a eliminar
   */
  const handleDeleteClick = (comment: EventComment) => {
    setCommentToDelete(comment);
    setDeleteDialogOpen(true);
  };

  /**
   * Confirma y ejecuta la eliminación del comentario
   * @param reason - Motivo de la eliminación
   */
  const handleDeleteConfirm = async (reason: string) => {
    if (!commentToDelete) return;

    setDeleting(true);
    try {
      // Llamar al servicio de eliminación
      await commentService.deleteComment(commentToDelete.id, reason);
      
      // Actualizar la lista de comentarios
      const updated = await commentService.getCommentsByEventId(eventId);
      setComments(updated);
      
      // Cerrar el diálogo
      setDeleteDialogOpen(false);
      setCommentToDelete(null);
      
      console.log(`✅ Comentario eliminado exitosamente`);
    } catch (error) {
      console.error("Error al eliminar comentario:", error);
      alert("Error al eliminar el comentario. Por favor intenta de nuevo.");
    } finally {
      setDeleting(false);
    }
  };

  /**
   * Cancela el proceso de eliminación
   */
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setCommentToDelete(null);
  };

  /**
   * Maneja la edición de un comentario
   * Llama al servicio y refresca la lista
   */
  const handleEdit = async (id: number, newContent: string) => {
    setSubmitting(true)
    try {
      await commentService.updateComment(id, newContent)
      const updated = await commentService.getCommentsByEventId(eventId)
      setComments(updated)
      console.log(`✏️ Comentario ${id} actualizado`)
    } catch (error) {
      console.error("Error al actualizar comentario:", error)
      alert((error as Error)?.message || "Error al actualizar")
    } finally {
      setSubmitting(false)
    }
  }

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
          onDelete={handleDeleteClick} // Nueva prop para manejar eliminación
          onEdit={handleEdit}
          isLoggedIn={isLoggedIn}
          onLogin={onLogin}/>
      )}

      {/* Diálogo de confirmación de eliminación */}
      {commentToDelete && (
        <DeleteCommentDialog
          open={deleteDialogOpen}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          commentAuthor={commentToDelete.name}
          commentContent={commentToDelete.content}
          isLoading={deleting}
        />
      )}
    </section>
  );
}