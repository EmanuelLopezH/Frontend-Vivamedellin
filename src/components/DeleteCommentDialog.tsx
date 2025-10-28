"use client"

import { useState } from "react"
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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DeleteCommentDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: (reason: string) => void
  commentAuthor: string
  commentContent: string
  isLoading?: boolean
}

// Motivos predefinidos para facilitar la selección del administrador
const DELETION_REASONS = [
  "Lenguaje ofensivo",
  "Contenido discriminatorio",
  "Spam",
  "Contenido inapropiado",
  "Violación de términos de uso",
  "Otro (especificar)"
]

/**
 * Componente de diálogo para confirmar la eliminación de comentarios
 * Cumple con el criterio: "El sistema debe solicitar confirmación antes de eliminar"
 * Incluye la captura del motivo para auditoría
 */
export function DeleteCommentDialog({
  open,
  onClose,
  onConfirm,
  commentAuthor,
  commentContent,
  isLoading = false
}: DeleteCommentDialogProps) {
  const [selectedReason, setSelectedReason] = useState<string>("")
  const [customReason, setCustomReason] = useState<string>("")

  const handleConfirm = () => {
    // Si seleccionó "Otro", usar el motivo personalizado
    const finalReason = selectedReason === "Otro (especificar)" ? customReason : selectedReason
    
    if (!finalReason.trim()) {
      alert("Por favor seleccione o especifique un motivo para la eliminación")
      return
    }
    
    onConfirm(finalReason.trim())
    
    // Limpiar el estado al confirmar
    setSelectedReason("")
    setCustomReason("")
  }

  const handleClose = () => {
    // Limpiar el estado al cerrar
    setSelectedReason("")
    setCustomReason("")
    onClose()
  }

  return (
    <AlertDialog open={open} onOpenChange={handleClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar eliminación de comentario</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <div>
              <strong>Autor:</strong> {commentAuthor}
            </div>
            <div>
              <strong>Comentario:</strong>
            </div>
            <div className="bg-gray-50 p-2 rounded text-sm italic max-h-20 overflow-y-auto">
              "{commentContent}"
            </div>
            <div className="text-red-600">
              Esta acción no se puede deshacer. El comentario desaparecerá para todos los usuarios.
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="deletion-reason">Motivo de eliminación *</Label>
            <Select value={selectedReason} onValueChange={setSelectedReason}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione un motivo..." />
              </SelectTrigger>
              <SelectContent>
                {DELETION_REASONS.map((reason) => (
                  <SelectItem key={reason} value={reason}>
                    {reason}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Campo de texto personalizado cuando selecciona "Otro" */}
          {selectedReason === "Otro (especificar)" && (
            <div className="space-y-2">
              <Label htmlFor="custom-reason">Especifique el motivo:</Label>
              <Textarea
                id="custom-reason"
                placeholder="Describa el motivo de la eliminación..."
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                maxLength={500}
              />
              <div className="text-xs text-gray-500 text-right">
                {customReason.length}/500 caracteres
              </div>
            </div>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleClose} disabled={isLoading}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm} 
            disabled={isLoading || !selectedReason}
            className="bg-red-600 hover:bg-red-700"
          >
            {isLoading ? "Eliminando..." : "Eliminar comentario"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}