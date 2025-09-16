import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

function getInitials(name: string) {
  const parts = name.trim().split(" ")
  const initials = parts.map((p) => p[0]).slice(0, 2).join("")
  return initials.toUpperCase()
}

export function CommentCard({ author, content, createdAt, avatarUrl }: { author: string; content: string; createdAt: string, avatarUrl?: string }) {
  return (
    <Card>
      <CardContent className="p-4 flex items-start space-x-3">
        <Avatar>
          {avatarUrl ? (
            <AvatarImage src={avatarUrl} alt={author} />
          ) : (
            <AvatarFallback>{getInitials(author)}</AvatarFallback>
          )}
        </Avatar>
        <div className="flex-4">
            <p className="font-medium">{author}:</p>
            <p className="text-xs text-slate-500">{new Date(createdAt).toLocaleString()}</p>
            <p className="text-slate-700">{content}</p>
        </div>
      </CardContent>
    </Card>
  );
}