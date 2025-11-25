import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"
import { useSavedPosts } from "@/hooks/useSavedPosts"
import { Bookmark, BookmarkCheck, Loader2 } from "lucide-react"

interface SaveButtonProps {
  postId: number
  initialSaved?: boolean
  variant?: "default" | "ghost" | "outline"
  size?: "default" | "sm" | "lg" | "icon"
  showLabel?: boolean
}

export function SaveButton({
  postId,
  initialSaved = false,
  variant = "outline",
  size = "sm",
  showLabel = false,
}: SaveButtonProps) {
  const { toast } = useToast()
  const { isPostSaved, savePost, unsavePost, checkIfSaved, loading } = useSavedPosts()
  const [isSaved, setIsSaved] = useState(initialSaved)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  // Verificar autenticación
  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    const userString = localStorage.getItem("user")

    if (storedToken && userString) {
      setIsLoggedIn(true)
    } else {
      setIsLoggedIn(false)
      setIsChecking(false)
    }
  }, [])

  // Verificar si el post está guardado al montar
  useEffect(() => {
    const checkSavedStatus = async () => {
      if (!isLoggedIn) {
        setIsChecking(false)
        return
      }

      try {
        const saved = await checkIfSaved(postId)
        setIsSaved(saved)
      } catch (error) {
        console.error("Error al verificar estado guardado:", error)
      } finally {
        setIsChecking(false)
      }
    }

    checkSavedStatus()
  }, [postId, isLoggedIn, checkIfSaved])

  // Sincronizar con el estado global del hook
  useEffect(() => {
    setIsSaved(isPostSaved(postId))
  }, [postId, isPostSaved])

  // Manejar click en el botón
  const handleToggleSave = async () => {
    // Si no está logueado, mostrar mensaje
    if (!isLoggedIn) {
      toast({
        variant: "destructive",
        title: "Inicia sesión",
        description: "Debes iniciar sesión para guardar posts.",
      })
      return
    }

    if (isLoading) return

    setIsLoading(true)

    try {
      if (isSaved) {
        // Dejar de guardar
        await unsavePost(postId)
        setIsSaved(false)
      } else {
        // Guardar
        console.log("💾 [SaveButton] Guardando post:", postId)
        await savePost(postId)
        setIsSaved(true)
        console.log("✅ [SaveButton] Post guardado exitosamente:", postId)
      }
    } catch (error) {
      console.error("Error al guardar/quitar post:", error)
      // El hook ya maneja los toasts de error
      // Revertir estado en caso de error
      setIsSaved(prev => !prev)
    } finally {
      setIsLoading(false)
    }
  }

  // Tooltip text
  const getTooltipText = () => {
    if (!isLoggedIn) {
      return "Inicia sesión para guardar"
    }
    return isSaved ? "Guardado" : "Guardar"
  }

  // Si está verificando el estado inicial, mostrar loading
  if (isChecking) {
    return (
      <Button variant={variant} size={size} disabled>
        <Loader2 className="h-4 w-4 animate-spin" />
      </Button>
    )
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={variant}
            size={size}
            onClick={handleToggleSave}
            disabled={isLoading}
            className={`gap-2 transition-all ${
              isSaved
                ? "text-blue-600 hover:text-blue-700 border-blue-300 hover:border-blue-400"
                : ""
            } ${isLoading ? "cursor-not-allowed" : ""}`}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isSaved ? (
              <BookmarkCheck className="h-4 w-4 fill-blue-600 animate-in zoom-in-50 duration-200" />
            ) : (
              <Bookmark className="h-4 w-4 transition-all" />
            )}
            {showLabel && (
              <span className="hidden sm:inline">{isSaved ? "Guardado" : "Guardar"}</span>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{getTooltipText()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
