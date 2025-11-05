import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { CreatePost } from "@/components/CreatePost"
import { PostCard } from "@/components/PostCard"
import { postService } from "@/services/postService"
import type { Post } from "@/types/post"
import { LogOut, Home, Calendar } from "lucide-react"

export default function Posts() {
  const navigate = useNavigate()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<{ name: string } | null>(null)

  // Verificar si el usuario está logueado
  useEffect(() => {
    const token = localStorage.getItem("token")
    const userString = localStorage.getItem("user")

    if (!token || !userString) {
      navigate("/")
      return
    }

    try {
      const userData = JSON.parse(userString)
      setUser(userData)
    } catch (error) {
      console.error("Error al parsear usuario:", error)
      navigate("/")
    }
  }, [navigate])

  // Cargar posts
  const loadPosts = async () => {
    setLoading(true)
    try {
      const postsData = await postService.getPosts()
      setPosts(postsData)
    } catch (error) {
      console.error("Error al cargar posts:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      loadPosts()
    }
  }, [user])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/")
  }

  if (!user) {
    return null // O un spinner de carga
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ViveMedellín
              </span>
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/")}
                className="text-slate-600 hover:text-blue-600"
              >
                <Home className="h-4 w-4 mr-2" />
                Inicio
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-600 hover:text-purple-600"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Eventos
              </Button>

              {/* User menu */}
              <div className="flex items-center gap-3 ml-2 pl-2 border-l border-slate-200">
                <div className="hidden sm:flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                    {user.name[0].toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-slate-700">{user.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-slate-600 hover:text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Feed de la Comunidad
          </h1>
          <p className="text-slate-600">
            Descubre qué está pasando en Medellín y comparte tus experiencias
          </p>
        </div>

        {/* Create post */}
        <CreatePost onPostCreated={loadPosts} />

        {/* Posts feed */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-slate-600">Cargando posts...</p>
            </div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
              <Calendar className="h-10 w-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              No hay posts todavía
            </h3>
            <p className="text-slate-600 mb-6">
              Sé el primero en compartir algo sobre Medellín
            </p>
            <Button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Crear el primer post
            </Button>
          </div>
        ) : (
          <div>
            {posts.map((post) => (
              <PostCard key={post.id} post={post} onUpdate={loadPosts} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-slate-200 bg-white/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-slate-600 text-sm">
            © 2024 ViveMedellín. Plataforma comunitaria para descubrir la ciudad.
          </p>
        </div>
      </footer>
    </div>
  )
}
