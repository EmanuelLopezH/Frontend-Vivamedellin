"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Send, AlertCircle, LogIn } from "lucide-react";
import { getCurrentUser, type User } from "@/services/authService";

interface AddCommentProps {
  postId: number;
  parentCommentId?: number;
  onCommentAdded: (comment: any) => void;
  placeholder?: string;
  buttonText?: string;
  compact?: boolean;
}

const API_BASE_URL = "https://vivemedellin-backend.onrender.com/api";
const MAX_CHARACTERS = 1000;

export function AddComment({
  postId,
  parentCommentId,
  onCommentAdded,
  placeholder = "Escribe un comentario...",
  buttonText = "Comentar",
  compact = false,
}: AddCommentProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Verificar si el usuario está logueado
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    // Validaciones
    if (!content.trim()) {
      setError("El comentario no puede estar vacío");
      return;
    }

    if (content.length > MAX_CHARACTERS) {
      setError(`El comentario no puede superar ${MAX_CHARACTERS} caracteres`);
      return;
    }

    if (!isLoggedIn || !user) {
      setError("Debes iniciar sesión para comentar");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No hay token de autenticación");
      }

      // Determinar el endpoint según si es respuesta o comentario principal
      const endpoint = parentCommentId
        ? `/comments/${parentCommentId}/replies`
        : `/posts/${postId}/comments`;

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: content.trim(),
          userId: user.id,
          authorName: user.name,
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error(
            "Tu sesión ha expirado. Por favor, inicia sesión nuevamente."
          );
        } else if (response.status === 403) {
          throw new Error("No tienes permisos para comentar.");
        } else if (response.status === 404) {
          throw new Error(
            parentCommentId ? "El comentario no existe." : "El post no existe."
          );
        } else {
          throw new Error("Error al enviar el comentario. Intenta de nuevo.");
        }
      }

      const data = await response.json();

      // Transformar la respuesta al formato esperado
      const newComment = {
        id: data.id,
        postId: postId,
        userId: data.user.id,
        userName: data.user.name,
        userImage: data.user.profileImage || undefined,
        content: data.content,
        createdAt: data.createdDate,
        editedDate: data.editedDate,
        parentCommentId: data.parentCommentId,
        replies: data.replies || [],
      };

      // Limpiar el textarea
      setContent("");
      setError(null);

      // Callback para actualizar la lista
      onCommentAdded(newComment);
    } catch (err: any) {
      console.error("Error al agregar comentario:", err);
      setError(err.message || "Error al enviar el comentario");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Enviar con Ctrl+Enter o Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  const remainingChars = MAX_CHARACTERS - content.length;
  const isNearLimit = remainingChars < 100;
  const isOverLimit = remainingChars < 0;

  // Si no está logueado, mostrar mensaje
  if (!isLoggedIn) {
    return (
      <Alert className="border-blue-200 bg-blue-50">
        <LogIn className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-slate-700">
          <span className="font-semibold">Inicia sesión</span> para comentar y
          participar en la conversación.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Textarea */}
      <div className="relative">
        <Textarea
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            setError(null);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isSubmitting}
          className={`resize-none ${
            compact ? "min-h-[80px]" : "min-h-[100px]"
          } ${isOverLimit ? "border-red-300 focus:border-red-500" : ""}`}
          maxLength={MAX_CHARACTERS + 50} // Permitir escribir un poco más para mostrar error
        />

        {/* Contador de caracteres */}
        <div
          className={`absolute bottom-2 right-2 text-xs font-medium ${
            isOverLimit
              ? "text-red-600"
              : isNearLimit
              ? "text-amber-600"
              : "text-slate-400"
          }`}
        >
          {remainingChars} / {MAX_CHARACTERS}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <Alert variant="destructive" className="py-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">{error}</AlertDescription>
        </Alert>
      )}

      {/* Botones */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500">
          {compact
            ? "Presiona Ctrl+Enter para enviar"
            : "Presiona Ctrl+Enter para enviar rápidamente"}
        </p>

        <Button
          type="submit"
          disabled={!content.trim() || isSubmitting || isOverLimit}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Enviando...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              {buttonText}
            </>
          )}
        </Button>
      </div>

      {/* Indicador de usuario actual */}
      {user && !compact && (
        <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-semibold">
            {user.name[0].toUpperCase()}
          </div>
          <span className="text-sm text-slate-600">
            Comentando como <span className="font-semibold">{user.name}</span>
          </span>
        </div>
      )}
    </form>
  );
}
