import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { canDeleteComment, getCurrentUser } from "@/mocks/mockUsers"

function getInitials(name: string) {
  if (!name) return "?"   // Manejo de caso sin nombre
  const parts = name.trim().split(" ")
  const initials = parts.map((p) => p[0]).slice(0, 2).join("")
  return initials.toUpperCase()
}

export function CommentCard({ 
  name, 
  content, 
  createdAt, 
  avatarUrl, 
  onReply,
  onDelete, // Nueva función para manejar eliminación
}: { 
  name: string; 
  content: string; 
  createdAt: string, 
  avatarUrl?: string, 
  onReply?: () => void;
  onDelete?: () => void; // Función opcional para eliminar comentario
}) {
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
        <div className="flex-1">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="font-medium">{name}:</p>
                <p className="text-xs text-slate-500">{new Date(createdAt).toLocaleString()}</p>
              </div>
              
              {/* Botón de eliminar - Solo visible para admins y propietarios logueados */}
              {onDelete && getCurrentUser() && canDeleteComment(name) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onDelete}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 h-auto"
                  title="Eliminar comentario"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            <p className="text-slate-700 mt-1">{content}</p>
            
            {/* Botones de acción */}
            <div className="flex gap-2 mt-2">
              {onReply && (
                <button
                  onClick={onReply}
                  className="text-xs text-blue-600 hover:underline">
                  Reply
                </button>
              )}
            </div>
        </div>
      </CardContent>
    </Card>
  );
}