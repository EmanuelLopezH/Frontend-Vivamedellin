"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { isCurrentUserAdmin } from "@/services/authService";

interface DeleteCommentDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason?: string) => void;
  commentAuthor: string;
  commentContent: string;
  isLoading?: boolean;
}

// Motivos predefinidos para administradores
const ADMIN_DELETION_REASONS = [
  "Lenguaje ofensivo",
  "Contenido discriminatorio",
  "Spam",
  "Contenido inapropiado",
  "Violación de términos de uso",
  "Otro (especificar)",
];

/**
 * Componente de diálogo para confirmar la eliminación de comentarios
 * - Usuarios normales: confirmación simple
 * - Administradores: requiere seleccionar motivo para auditoría
 */
export function DeleteCommentDialog({
  open,
  onClose,
  onConfirm,
  commentAuthor,
  commentContent,
  isLoading = false,
}: DeleteCommentDialogProps) {
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [customReason, setCustomReason] = useState<string>("");
  const isAdmin = isCurrentUserAdmin();

  const handleConfirm = () => {
    if (isAdmin) {
      // Admin debe seleccionar motivo
      const finalReason =
        selectedReason === "Otro (especificar)" ? customReason : selectedReason;

      if (!finalReason.trim()) {
        alert(
          "Por favor seleccione o especifique un motivo para la eliminación"
        );
        return;
      }

      onConfirm(finalReason.trim());
    } else {
      // Usuario normal: confirmación simple
      onConfirm();
    }

    // Limpiar estado al confirmar
    setSelectedReason("");
    setCustomReason("");
  };

  const handleClose = () => {
    // Limpiar estado al cerrar
    setSelectedReason("");
    setCustomReason("");
    onClose();
  };

  return (
    // Only call the external onClose when the dialog is closed (isOpen === false).
    // Previous code forwarded handleClose directly which caused the dialog to
    // immediately close when it was opened (onOpenChange fires with true).
    <AlertDialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) handleClose();
      }}
    >
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isAdmin ? "Eliminar comentario (Admin)" : "¿Eliminar comentario?"}
          </AlertDialogTitle>
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
              Esta acción no se puede deshacer. El comentario desaparecerá para
              todos los usuarios.
              {isAdmin && " La acción quedará registrada para auditoría."}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Selección de motivo SOLO para administradores */}
        {isAdmin && (
          <div className="space-y-4 p-6 border-t">
            <div className="space-y-2">
              <Label htmlFor="deletion-reason">Motivo de eliminación *</Label>
              <select
                id="deletion-reason"
                value={selectedReason}
                onChange={(e) => setSelectedReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Seleccione un motivo...</option>
                {ADMIN_DELETION_REASONS.map((reason) => (
                  <option key={reason} value={reason}>
                    {reason}
                  </option>
                ))}
              </select>
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
                  className="min-h-[80px]"
                />
                <div className="text-xs text-gray-500 text-right">
                  {customReason.length}/500 caracteres
                </div>
              </div>
            )}
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleClose} disabled={isLoading}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading || (isAdmin && !selectedReason)}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isLoading ? "Eliminando..." : "Eliminar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
