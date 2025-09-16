import { CommentCard } from "@/components/CommentCard"
import { CommentForm } from "@/components/CommentForm"

interface Comment {
  id: number
  author: string
  content: string
  createdAt: string
  avatarUrl?: string
}

interface CommentSectionProps {
  comments: Comment[]
  isLoggedIn: boolean
  onAddComment: (content: string) => void
  onLogin?: () => void
}

export function CommentSection({ comments, isLoggedIn, onAddComment, onLogin }: CommentSectionProps) {
  return (
    <section>
      <h3 className="text-xl font-semibold mb-10">Comments</h3>

      {/* Aquí se muestra la caja para comentar */}
      <div className="mb-6">
        <CommentForm
          onAddComment={onAddComment}
          isLoggedIn={isLoggedIn}
          onLogin={onLogin}
        />
      </div>

      {/* Lista de comentarios */}
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
}