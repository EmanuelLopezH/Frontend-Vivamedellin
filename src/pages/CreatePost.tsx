import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { categoryService, type Category } from "@/services/categoryService"
import { createPostService } from "@/services/createPostService"
import { getPostUrl } from "@/utils/slugUtils"
import { ArrowLeft, Upload, X, AlertCircle, Loader2, Send, Image as ImageIcon } from "lucide-react"

export default function CreatePost() {
  const navigate = useNavigate()
  const [user, setUser] = useState<{ id: number; name: string } | null>(null)
  const [token, setToken] = useState<string | null>(null)

  // Estados del formulario
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("")
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // Estados de UI
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Validaciones en tiempo real
  const [titleError, setTitleError] = useState<string | null>(null)
  const [contentError, setContentError] = useState<string | null>(null)
  const [imageError, setImageError] = useState<string | null>(null)

  const MAX_TITLE_LENGTH = 100
  const MIN_CONTENT_LENGTH = 10
  const MAX_IMAGE_SIZE = 10 * 1024 * 1024 // 10MB en bytes

  // Verificar autenticación
  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    const userString = localStorage.getItem("user")

    if (!storedToken || !userString) {
      // No está logueado, redirigir a home
      navigate("/")
      return
    }

    try {
      const userData = JSON.parse(userString)
      setUser(userData)
      setToken(storedToken)
    } catch (error) {
      console.error("Error al parsear usuario:", error)
      navigate("/")
    }
  }, [navigate])

  // Cargar categorías
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await categoryService.getCategories()
        setCategories(data)
      } catch (error) {
        console.error("Error al cargar categorías:", error)
        setError("Error al cargar las categorías. Intenta recargar la página.")
      } finally {
        setLoadingCategories(false)
      }
    }

    if (user && token) {
      loadCategories()
    }
  }, [user, token])

  // Validar título en tiempo real
  useEffect(() => {
    if (title.length === 0) {
      setTitleError(null)
    } else if (title.length > MAX_TITLE_LENGTH) {
      setTitleError(`El título no puede superar ${MAX_TITLE_LENGTH} caracteres`)
    } else {
      setTitleError(null)
    }
  }, [title])

  // Validar contenido en tiempo real
  useEffect(() => {
    if (content.length === 0) {
      setContentError(null)
    } else if (content.length < MIN_CONTENT_LENGTH) {
      setContentError(`El contenido debe tener al menos ${MIN_CONTENT_LENGTH} caracteres`)
    } else {
      setContentError(null)
    }
  }, [content])

  // Manejar selección de imagen
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setImageError(null)

    if (!file) {
      setImage(null)
      setImagePreview(null)
      return
    }

    // Validar tipo de archivo
    if (!file.type.startsWith("image/")) {
      setImageError("El archivo debe ser una imagen")
      return
    }

    // Validar tamaño
    if (file.size > MAX_IMAGE_SIZE) {
      setImageError("La imagen no puede superar 10MB")
      return
    }

    // Crear preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    setImage(file)
  }

  // Eliminar imagen seleccionada
  const handleRemoveImage = () => {
    setImage(null)
    setImagePreview(null)
    setImageError(null)
    // Resetear input file
    const fileInput = document.getElementById("image-upload") as HTMLInputElement
    if (fileInput) {
      fileInput.value = ""
    }
  }

  // Validar formulario antes de enviar
  const validateForm = (): boolean => {
    let isValid = true

    if (!title.trim()) {
      setTitleError("El título es requerido")
      isValid = false
    } else if (title.length > MAX_TITLE_LENGTH) {
      setTitleError(`El título no puede superar ${MAX_TITLE_LENGTH} caracteres`)
      isValid = false
    }

    if (!content.trim()) {
      setContentError("El contenido es requerido")
      isValid = false
    } else if (content.length < MIN_CONTENT_LENGTH) {
      setContentError(`El contenido debe tener al menos ${MIN_CONTENT_LENGTH} caracteres`)
      isValid = false
    }

    if (!selectedCategoryId) {
      setError("Debes seleccionar una categoría")
      isValid = false
    }

    if (image && image.size > MAX_IMAGE_SIZE) {
      setImageError("La imagen no puede superar 10MB")
      isValid = false
    }

    return isValid
  }

  // Enviar formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!validateForm()) {
      return
    }

    if (!user || !token) {
      setError("Debes iniciar sesión para crear un post")
      return
    }

    setIsSubmitting(true)

    try {
      const result = await createPostService.createPost(
        user.id,
        parseInt(selectedCategoryId),
        {
          postTitle: title.trim(),
          content: content.trim(),
          image: image || undefined,
        },
        token
      )

      console.log("Post creado exitosamente:", result)

      // Redirigir al post recién creado usando sistema de slugs
      const postUrl = getPostUrl(result.postId, result.postTitle)
      navigate(postUrl)
    } catch (error) {
      console.error("Error al crear post:", error)
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("Error al crear el post. Intenta de nuevo.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Mostrar loading mientras carga categorías
  if (loadingCategories) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-slate-600">Cargando categorías...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/posts")}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-primary">
                Crear Nuevo Post
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Formulario */}
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Comparte algo con la comunidad</CardTitle>
            <CardDescription>
              Cuéntanos sobre un evento, lugar o experiencia en Medellín
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {/* Error global */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Categoría */}
              <div className="space-y-2">
                <Label htmlFor="category">
                  Categoría <span className="text-red-500">*</span>
                </Label>
                <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.categoryId} value={category.categoryId.toString()}>
                        {category.categoryTitle}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-slate-500">
                  Elige la categoría que mejor describa tu publicación
                </p>
              </div>

              {/* Título */}
              <div className="space-y-2">
                <Label htmlFor="title">
                  Título <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="Ej: Festival de Rock en Parque Lleras"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={titleError ? "border-red-300 focus-visible:ring-red-500" : ""}
                  maxLength={MAX_TITLE_LENGTH + 10} // Permitir escribir más para mostrar error
                />
                <div className="flex justify-between items-center">
                  {titleError ? (
                    <p className="text-xs text-red-600">{titleError}</p>
                  ) : (
                    <p className="text-xs text-slate-500">
                      Un título claro y descriptivo
                    </p>
                  )}
                  <p
                    className={`text-xs ${
                      title.length > MAX_TITLE_LENGTH
                        ? "text-red-600"
                        : title.length > MAX_TITLE_LENGTH - 10
                        ? "text-amber-600"
                        : "text-slate-400"
                    }`}
                  >
                    {title.length} / {MAX_TITLE_LENGTH}
                  </p>
                </div>
              </div>

              {/* Contenido */}
              <div className="space-y-2">
                <Label htmlFor="content">
                  Contenido <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="content"
                  placeholder="Describe el evento, comparte detalles, horarios, ubicación..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className={`min-h-[200px] ${contentError ? "border-red-300 focus-visible:ring-red-500" : ""}`}
                />
                {contentError ? (
                  <p className="text-xs text-red-600">{contentError}</p>
                ) : (
                  <p className="text-xs text-slate-500">
                    Mínimo {MIN_CONTENT_LENGTH} caracteres. Sé descriptivo y útil.
                  </p>
                )}
              </div>

              {/* Imagen */}
              <div className="space-y-2">
                <Label htmlFor="image-upload">Imagen (opcional)</Label>
                
                {!imagePreview ? (
                  <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center hover:border-blue-300 transition-colors">
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <div className="flex flex-col items-center gap-2">
                        <div className="rounded-full bg-blue-100 p-3">
                          <Upload className="h-6 w-6 text-blue-600" />
                        </div>
                        <p className="text-sm font-medium text-slate-700">
                          Click para subir una imagen
                        </p>
                        <p className="text-xs text-slate-500">
                          PNG, JPG, WEBP hasta 10MB
                        </p>
                      </div>
                    </label>
                  </div>
                ) : (
                  <div className="relative border border-slate-200 rounded-lg overflow-hidden">
                    <img
                      src={imagePreview}
                      alt="Vista previa"
                      className="w-full h-64 object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={handleRemoveImage}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Eliminar
                    </Button>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm p-2">
                      <p className="text-xs text-white flex items-center gap-1">
                        <ImageIcon className="h-3 w-3" />
                        {image?.name} ({(image!.size / 1024 / 1024).toFixed(2)} MB)
                      </p>
                    </div>
                  </div>
                )}

                {imageError && (
                  <p className="text-xs text-red-600">{imageError}</p>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex justify-between gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/posts")}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !!titleError || !!contentError || !!imageError}
                className="gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Publicando...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Publicar Post
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
