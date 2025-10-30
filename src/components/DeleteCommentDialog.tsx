"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface DeleteCommentDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  commentAuthor: string
  commentContent: string
  isLoading?: boolean
}

/**
 * Componente de diálogo para confirmar la eliminación de comentarios
 * Cumple con el criterio: "El sistema debe solicitar confirmación antes de eliminar"
 */
export function DeleteCommentDialog({
  open,
  onClose,
  onConfirm,
  commentAuthor,
  commentContent,
  isLoading = false
}: DeleteCommentDialogProps) {
  const handleConfirm = () => {
    onConfirm()
  }

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar comentario?</AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <div>
              <strong>Autor:</strong> {commentAuthor}
            </div>
            <div>
              <strong>Comentario:</strong>
            </div>
            <div className="bg-gray-50 p-3 rounded text-sm italic max-h-20 overflow-y-auto border">
              "{commentContent}"
            </div>
            <div className="text-red-600 font-medium">
              Esta acción no se puede deshacer. El comentario desaparecerá para todos los usuarios.
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose} disabled={isLoading}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm} 
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isLoading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}