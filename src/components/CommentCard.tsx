import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Trash2, Edit2 } from "lucide-react"
import { getCurrentUser, canDeleteComment } from "@/mocks/mockUsers"
import { useState } from "react"

function getInitials(name: string) {
  if (!name) return "?"   // Manejo de caso sin nombre
  const parts = name.trim().split(" ")
  const initials = parts.map((p) => p[0]).slice(0, 2).join("")
  return initials.toUpperCase()
}

export function CommentCard({ 
  id,
  name, 
  content, 
  createdAt, 
  avatarUrl, 
  onReply,
  onDelete, // Nueva función para manejar eliminación
  onEdit, // (id, newContent) => void
}: { 
  id?: number;
  name: string; 
  content: string; 
  createdAt: string, 
  avatarUrl?: string, 
  onReply?: () => void;
  onDelete?: () => void; // Función opcional para eliminar comentario
  onEdit?: (id: number, newContent: string) => Promise<void> | void;
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(content)
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
              <div className="flex items-center gap-2">
                {/* Edit - visible SOLO para el autor y dentro de 1 hora */}
                {onEdit && (() => {
                  const currentUser = getCurrentUser()
                  const isAuthor = currentUser && currentUser.name === name
                  const createdMs = new Date(createdAt).getTime()
                  const canEdit = isAuthor && (Date.now() - createdMs) <= (60 * 60 * 1000)
                  if (!canEdit) return null
                  return (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                      className="text-slate-600 hover:text-slate-900 p-1 h-auto"
                      title="Editar comentario"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  )
                })()}

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
            </div>
            
            {!isEditing ? (
              <p className="text-slate-700 mt-1">{content}</p>
            ) : (
              <div className="mt-2">
                <textarea
                  className="w-full border rounded p-2 text-sm"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  rows={4}
                />
                <div className="flex gap-2 mt-2">
                  <Button
                    size="sm"
                    onClick={async () => {
                      if (!id) return
                      if (editText.trim() === "") {
                        alert("El comentario no puede estar vacío")
                        return
                      }
                      try {
                        await onEdit?.(id, editText.trim())
                        setIsEditing(false)
                      } catch (err) {
                        console.error("Error al actualizar comentario", err)
                        alert("No se pudo actualizar el comentario")
                      }
                    }}
                  >
                    Save
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => { setIsEditing(false); setEditText(content) }}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
            
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