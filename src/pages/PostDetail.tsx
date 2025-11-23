import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { SaveButton } from "@/components/SaveButton"
import { CommentSection } from "@/components/CommentSectionNested"
import { postDetailService, type CommentWithReplies } from "@/services/postDetailService"
import { postServiceBackend } from "@/services/postServiceBackend"
import type { Post } from "@/types/post"
import { debugCurrentUser } from "@/utils/debugAuth"
import { 
  ArrowLeft, 
  Share2, 
  Edit, 
  Trash2, 
  Calendar,
  User,
  MessageCircle,
  AlertCircle
} from "lucide-react"

// Colores para categorías (igual que PostCardGrid)
const categoryColors: Record<string, string> = {
  "Música": "bg-purple-100 text-purple-700",
  "Deportes": "bg-green-100 text-green-700",
  "Cultura": "bg-blue-100 text-blue-700",
  "Gastronomía": "bg-orange-100 text-orange-700",
  "Tecnología": "bg-cyan-100 text-cyan-700",
  "Arte": "bg-pink-100 text-pink-700",
  "default": "bg-slate-100 text-slate-700"
}

export default function PostDetail() {
  const { postId } = useParams<{ postId: string }>()
  const navigate = useNavigate()
  
  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<CommentWithReplies[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<{ id: number; name: string; role?: string; roles?: string[] } | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userString = localStorage.getItem("user")

    if (token && userString) {
      try {
        const userData = JSON.parse(userString)
        setUser(userData)
        
        // Debug: Mostrar información del usuario
        debugCurrentUser()
      } catch (error) {
        console.error("Error al parsear usuario:", error)
      }
    }
  }, [])

  const loadPostAndComments = async () => {
    if (!postId) return

    setLoading(true)
    setError(null)

    try {
      const [postData, commentsData] = await Promise.all([
        postDetailService.getPost(Number(postId)),
        postDetailService.getCommentsWithReplies(Number(postId))
      ])

      setPost(postData)
      setComments(commentsData)
    } catch (err) {
      console.error("Error al cargar post:", err)
      setError("No se pudo cargar el post. Puede que no exista o haya un error de conexión.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPostAndComments()
  }, [postId])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString.replace(' ', 'T'))
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric',
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getCategoryColor = (categoryTitle?: string) => {
    if (!categoryTitle) return categoryColors.default
    return categoryColors[categoryTitle] || categoryColors.default
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    alert("¡Enlace copiado al portapapeles!")
  }

  const handleDelete = async () => {
    if (!post) return
    
    if (!window.confirm("¿Estás seguro de eliminar este post?")) {
      return
    }

    setIsDeleting(true)
    try {
      await postServiceBackend.deletePost(post.id)
      navigate("/posts")
    } catch (error) {
      console.error("Error al eliminar:", error)
      alert("Error al eliminar el post")
    } finally {
      setIsDeleting(false)
    }
  }

  const isAdmin = user?.roles?.includes("ROLE_ADMIN") || user?.role === "ROLE_ADMIN"
  const canEditOrDelete = isAdmin || (user && post && user.id === post.userId)

  // Debug: Verificar si el usuario es admin
  console.log("🔍 [PostDetail] Usuario actual:", user)
  console.log("🔍 [PostDetail] user?.roles:", user?.roles)
  console.log("🔍 [PostDetail] user?.role:", user?.role)
  console.log("🔍 [PostDetail] isAdmin:", isAdmin)

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Skeleton className="h-10 w-32 mb-6" />
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <Skeleton className="w-full h-96" />
            <div className="p-8 space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/posts")}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Post no encontrado
            </h2>
            <p className="text-slate-600 mb-6">
              {error || "El post que buscas no existe o fue eliminado."}
            </p>
            <Button onClick={() => navigate("/posts")}>
              Volver al feed
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Botón volver */}
        <Button
          variant="ghost"
          onClick={() => navigate("/posts")}
          className="mb-6 hover:bg-white"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>

        {/* Post detail card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          {/* Imagen del post */}
          {post.imageUrl ? (
            <div className="relative w-full h-96 bg-slate-200">
              <img
                src={post.imageUrl}
                alt={post.postTitle || "Post image"}
                className="w-full h-full object-cover"
              />
              {post.category && (
                <Badge className={`absolute top-4 left-4 font-medium ${getCategoryColor(post.category.title)}`}>
                  {post.category.title}
                </Badge>
              )}
            </div>
          ) : (
            <div className="relative w-full h-96 bg-gray-200 flex items-center justify-center">
              <div className="text-8xl">🎉</div>
              {post.category && (
                <Badge className={`absolute top-4 left-4 font-medium ${getCategoryColor(post.category.title)}`}>
                  {post.category.title}
                </Badge>
              )}
            </div>
          )}

          {/* Contenido */}
          <div className="p-8">
            {/* Header: Autor y fecha */}
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-200">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white text-lg font-semibold">
                {post.userName[0].toUpperCase()}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900">{post.userName}</h3>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(post.createdAt)}</span>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex items-center gap-2">
                <SaveButton
                  postId={post.id}
                  initialSaved={post.isSaved}
                  variant="outline"
                  size="sm"
                  showLabel
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Compartir
                </Button>

                {canEditOrDelete && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/post/${post.id}/edit`)}
                      className="text-blue-600 border-blue-300"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="text-red-600 border-red-300"
                    >
                      {isDeleting ? (
                        <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Eliminar
                        </>
                      )}
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Título del post */}
            {post.postTitle && (
              <h1 className="text-3xl font-bold text-slate-900 mb-4">
                {post.postTitle}
              </h1>
            )}

            {/* Contenido del post */}
            <div className="prose prose-slate max-w-none mb-6">
              <p className="text-slate-700 text-lg leading-relaxed whitespace-pre-wrap">
                {post.content}
              </p>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 pt-6 border-t border-slate-200">
              <div className="flex items-center gap-2 text-slate-600">
                <MessageCircle className="h-5 w-5" />
                <span className="font-medium">{comments.length} comentarios</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de comentarios */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <CommentSection
            postId={post.id}
            comments={comments}
            currentUserId={user?.id}
            isAdmin={isAdmin}
            isLoggedIn={!!user}
            onUpdate={loadPostAndComments}
          />
        </div>
      </div>
    </div>
  )
}
