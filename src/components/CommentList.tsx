import { EventComment  } from "@/mocks/mockComments";
import { CommentCard } from "./CommentCard"

type Props = { comments: EventComment[] };

export function CommentList({ comments }: Props) {
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
}