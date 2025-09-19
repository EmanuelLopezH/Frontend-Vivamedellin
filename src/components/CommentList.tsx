import { EventComment  } from "@/mocks/mockComments";
import { CommentCard } from "./CommentCard"
import { CommentForm } from "./CommentForm";

type Props = { 
  comments: EventComment[], 
  onReply?: (commentId: number) => void
  replyTo: number | null;
  onAddReply: (content: string, parentId: number) => void;
  isLoggedIn: boolean;
  onLogin?: () => void;
 };

/*export function CommentList({ comments }: Props) {
  if (!comments.length) {
    return <p className="text-muted-foreground">There are no comments for this event yet.</p>;
  }

  return (
    <ul className="space-y-4">
      {comments.map((comment) => (
        <li key={comment.id} className="border-b pb-2">
          <CommentCard {...comment} />
        </li>
      ))}
    </ul>
  );
}*/

// Nueva versión que soporta respuestas anidadas

export function CommentList({ comments, onReply, replyTo, onAddReply, isLoggedIn, onLogin, }: Props) {
  const topLevel = comments.filter((c) => !c.parentId);

  return (
    <ul className="space-y-4">
      {topLevel.map((comment) => (
        <li key={comment.id}>
          <CommentCard {...comment} onReply={() => onReply(comment.id)} />

          {/* Respuestas */}
          <ul className="ml-8 mt-2 space-y-2">
            {comments
              .filter((reply) => reply.parentId === comment.id)
              .map((reply) => (
                <li key={reply.id}>
                  <CommentCard {...reply} onReply={() => onReply(reply.id)} />
                </li>
              ))}

            {/* Formulario de respuesta debajo del comentario actual */}
            {replyTo === comment.id && (
              <div className="mt-2">
                <CommentForm
                  onAddComment={(content) => onAddReply(content, comment.id)}
                  isLoggedIn={isLoggedIn}
                  onLogin={onLogin}
                />
              </div>
            )}
          </ul>
        </li>
      ))}
    </ul>
  );
}