import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PostCardGrid } from "@/components/PostCardGrid"
import { PostGridSkeleton } from "@/components/PostCardSkeleton"
import { postServiceBackend } from "@/services/postServiceBackend"
import type { Post } from "@/types/post"
import { Filter, Calendar, Plus } from "lucide-react"

type SortOption = "recent" | "most-commented" | "most-saved"

export default function PostsFeed() {
  const navigate = useNavigate()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<{ id: number; name: string; role?: string } | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [lastPage, setLastPage] = useState(false)
  const [sortBy, setSortBy] = useState<SortOption>("recent")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  // Verificar si el usuario está logueado
  useEffect(() => {
    const token = localStorage.getItem("token")
    const userString = localStorage.getItem("user")

    if (!token || !userString) {
      // No es obligatorio estar logueado para ver posts
      setUser(null)
    } else {
      try {
        const userData = JSON.parse(userString)
        setUser(userData)
      } catch (error) {
        console.error("Error al parsear usuario:", error)
      }
    }
  }, [])

  // Cargar posts
  const loadPosts = async (page: number = 0) => {
    setLoading(true)
    try {
      const response = await postServiceBackend.getPosts(page, 9) // 9 posts para grid 3x3
      setPosts(response.posts)
      setCurrentPage(response.pageNumber)
      setTotalPages(response.totalPages)
      setLastPage(response.lastPage)
    } catch (error) {
      console.error("Error al cargar posts:", error)
      // En caso de error, mostrar mensaje al usuario
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPosts(0)
  }, [])

  const handleNextPage = () => {
    if (!lastPage) {
      loadPosts(currentPage + 1)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 0) {
      loadPosts(currentPage - 1)
    }
  }

  const isAdmin = user?.role === "ADMIN"

  // Categorías únicas de los posts
  const categories = Array.from(new Set(posts.map(p => p.category?.title).filter(Boolean))) as string[]

  return (
    <div className="min-h-screen">
      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Comunidad ViveMedellín
          </h1>
          <p className="text-slate-600 text-lg">
            Descubre eventos, comparte experiencias y conecta con la ciudad
          </p>
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8 p-4 bg-white rounded-lg shadow-sm">
          <div className="flex items-center gap-2 flex-1">
            <Filter className="h-5 w-5 text-slate-600" />
            <span className="font-medium text-slate-700">Filtros:</span>
          </div>

          <div className="flex flex-wrap gap-3 w-full sm:w-auto">
            {/* Filtro por categoría */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Filtro por ordenamiento */}
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Más recientes</SelectItem>
                <SelectItem value="most-commented">Más comentados</SelectItem>
                <SelectItem value="most-saved">Más guardados</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Posts grid */}
        {loading ? (
          <PostGridSkeleton count={9} />
        ) : posts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-md">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
              <Calendar className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="text-2xl font-semibold text-slate-900 mb-3">
              No hay posts todavía
            </h3>
            <p className="text-slate-600 mb-8 max-w-md mx-auto">
              Sé el primero en compartir eventos y experiencias sobre Medellín
            </p>
            {user && (
              <Button
                onClick={() => navigate("/create-post")}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Crear el primer post
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {posts
                .filter((post) => selectedCategory === "all" || post.category?.title === selectedCategory)
                .map((post) => (
                  <PostCardGrid
                    key={post.id}
                    post={post}
                    onUpdate={() => loadPosts(currentPage)}
                    isLoggedIn={!!user}
                    isAdmin={isAdmin}
                    currentUserId={user?.id}
                  />
                ))}
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-12">
                <Button
                  variant="outline"
                  onClick={handlePrevPage}
                  disabled={currentPage === 0}
                  className="px-6"
                >
                  ← Anterior
                </Button>
                <span className="text-sm text-slate-600 font-medium">
                  Página {currentPage + 1} de {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={handleNextPage}
                  disabled={lastPage}
                  className="px-6"
                >
                  Siguiente →
                </Button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-slate-200 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-slate-600 text-sm">
            © 2024 ViveMedellín. Plataforma comunitaria para descubrir la ciudad.
          </p>
        </div>
      </footer>
    </div>
  )
}
