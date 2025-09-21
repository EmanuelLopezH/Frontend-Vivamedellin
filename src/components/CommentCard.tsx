import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

function getInitials(name: string) {
  if (!name) return "?"   // Manejo de caso sin nombre
  const parts = name.trim().split(" ")
  const initials = parts.map((p) => p[0]).slice(0, 2).join("")
  return initials.toUpperCase()
}

export function CommentCard({ name, content, createdAt, avatarUrl, onReply, }: { name: string; content: string; createdAt: string, avatarUrl?: string, onReply?: () => void; }) {
  return (
    <Card>
      <CardContent className="p-4 flex items-start space-x-3">
        <Avatar>
          {avatarUrl ? (
            <AvatarImage src={avatarUrl} alt={name} />
          ) : (
            <AvatarFallback>{getInitials(name)}</AvatarFallback>
          )}
        </Avatar>
        <div className="flex-4">
            <p className="font-medium">{name}:</p>
            <p className="text-xs text-slate-500">{new Date(createdAt).toLocaleString()}</p>
            <p className="text-slate-700">{content}</p>
            {onReply && (
            <button
              onClick={onReply}
              className="text-xs text-blue-600 hover:underline mt-2">
              Reply
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}