import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { BookmarkCheck, Calendar, MapPin, Users, ExternalLink, AlertCircle } from "lucide-react"
import { savedPostService } from "@/services/savedPostService"
import { getCurrentUser } from "@/services/authService"
import { useNavigate } from "react-router-dom"
import type { Post } from "@/types/post"

export default function SavedEventsPage() {
  const [savedPosts, setSavedPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState(getCurrentUser())
  const navigate = useNavigate()

  useEffect(() => {
    loadSavedPosts()
  }, [])

  // Recargar cuando el componente vuelve a estar visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // La página volvió a estar visible, recargar datos
        loadSavedPosts()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  const loadSavedPosts = async () => {
    console.log("🔍 [SavedEvents] Iniciando carga de eventos guardados...")
    
    const currentUser = getCurrentUser()
    console.log("👤 [SavedEvents] Usuario actual:", currentUser)
    
    if (!currentUser) {
      console.warn("⚠️ [SavedEvents] No hay usuario logueado")
      setError("Debes iniciar sesión para ver tus eventos guardados")
      setIsLoading(false)
      return
    }

    setUser(currentUser)
    const token = localStorage.getItem("token")
    console.log("🔑 [SavedEvents] Token presente:", !!token)
    console.log("👤 [SavedEvents] Usuario actual:", currentUser)
    
    if (!token) {
      console.warn("⚠️ [SavedEvents] No hay token")
      setError("Sesión expirada. Por favor, inicia sesión nuevamente.")
      setIsLoading(false)
      return
    }

    try {
      console.log("📡 [SavedEvents] Haciendo petición al backend...")
      setIsLoading(true)
      setError(null)
      
      const posts = await savedPostService.getSavedPosts(token)
      console.log("✅ [SavedEvents] Posts recibidos:", posts)
      setSavedPosts(posts)
    } catch (err) {
      console.error("❌ [SavedEvents] Error al cargar eventos guardados:", err)
      setError(err instanceof Error ? err.message : "Error al cargar eventos guardados")
    } finally {
      setIsLoading(false)
      console.log("🏁 [SavedEvents] Carga finalizada")
    }
  }

  const handleViewPost = (postId: number) => {
    navigate(`/post/${postId}`)
  }

  const handleUnsavePost = async (postId: number) => {
    const token = localStorage.getItem("token")
    if (!token) return

    try {
      console.log("🗑️ [SavedEvents] Eliminando post guardado:", postId)
      await savedPostService.unsavePost(postId, token)
      // Recargar la lista después de eliminar
      await loadSavedPosts()
    } catch (error) {
      console.error("❌ [SavedEvents] Error al eliminar post guardado:", error)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long", 
      day: "numeric",
    })
  }

  // Componente de loading
  const LoadingSkeleton = () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card key={index} className="overflow-hidden">
          <CardHeader className="pb-3">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
            <Skeleton className="h-8 w-24" />
          </CardContent>
        </Card>
      ))}
    </div>
  )

  // Mensaje cuando no hay eventos guardados
  const EmptyState = () => (
    <div className="text-center py-12">
      <BookmarkCheck className="mx-auto h-16 w-16 text-gray-300 mb-4" />
      <h3 className="text-xl font-semibold text-gray-600 mb-2">
        No tienes eventos guardados
      </h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        Guarda eventos interesantes haciendo clic en el ícono de bookmark en cualquier publicación.
      </p>
      <Button onClick={() => navigate("/posts")} variant="outline">
        <ExternalLink className="h-4 w-4 mr-2" />
        Explorar eventos
      </Button>
    </div>
  )

  // Si no está logueado
  if (!user && !isLoading) {
    console.log("🚫 [SavedEvents] Renderizando: Usuario no logueado")
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive" className="max-w-md mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Debes iniciar sesión para ver tus eventos guardados.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  // Debug: mostrar estado actual
  console.log("🔍 [SavedEvents] Estado actual:", {
    user: !!user,
    isLoading,
    error,
    postsCount: savedPosts.length
  })

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <BookmarkCheck className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-gray-900">
            Eventos Guardados
          </h1>
        </div>
        {user && (
          <p className="text-gray-600">
            Tus eventos favoritos guardados para ver más tarde
          </p>
        )}
      </div>

      {/* Error State */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {isLoading && <LoadingSkeleton />}

      {/* Empty State */}
      {!isLoading && !error && savedPosts.length === 0 && <EmptyState />}

      {/* Posts Grid */}
      {!isLoading && !error && savedPosts.length > 0 && (
        <>
          <div className="mb-4 text-sm text-gray-600">
            {savedPosts?.length || 0} evento{(savedPosts?.length || 0) !== 1 ? 's' : ''} guardado{(savedPosts?.length || 0) !== 1 ? 's' : ''}
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {(savedPosts || []).filter(post => post && post.id).map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer group">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-semibold">
                        {post.userName?.[0]?.toUpperCase() || '?'}
                      </div>
                      <div>
                        <CardTitle className="text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors">
                          {post.userName || 'Usuario desconocido'}
                        </CardTitle>
                        <p className="text-xs text-gray-500">
                          {post.createdAt ? formatDate(post.createdAt) : 'Fecha no disponible'}
                        </p>
                      </div>
                    </div>
                    <BookmarkCheck className="h-5 w-5 text-primary" />
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Imagen del evento */}
                  {post.imageUrl && (
                    <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                      <img 
                        src={post.imageUrl} 
                        alt="Evento"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                  )}

                  {/* Contenido */}
                  <div>
                    {post.postTitle && (
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {post.postTitle}
                      </h3>
                    )}
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {post.content || 'Contenido no disponible'}
                    </p>
                  </div>

                  {/* Categoría */}
                  {post.category && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {post.category.title}
                      </span>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {post.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {post.commentsCount}
                      </span>
                    </div>
                  </div>

                  {/* Botones de acción */}
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleViewPost(post.id)}
                      variant="outline" 
                      size="sm" 
                      className="flex-1 group-hover:bg-primary group-hover:text-white transition-colors"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Ver detalles
                    </Button>
                    <Button 
                      onClick={() => handleUnsavePost(post.id)}
                      variant="outline" 
                      size="sm" 
                      className="px-3 text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <BookmarkCheck className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Botón de refrescar */}
      {!isLoading && (
        <div className="mt-8 text-center">
          <Button onClick={loadSavedPosts} variant="outline">
            Actualizar lista
          </Button>
        </div>
      )}
    </div>
  )
}
