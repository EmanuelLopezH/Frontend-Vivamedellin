import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Wrench } from "lucide-react"

export default function EditPost() {
  const { slug } = useParams()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-8">
            <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Wrench className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-3xl font-bold text-slate-900 mb-2">
              Editar Post
            </CardTitle>
            <p className="text-slate-600">
              Funcionalidad en desarrollo
            </p>
          </CardHeader>

          <CardContent className="text-center pb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                🚧 TODO
              </h3>
              <p className="text-blue-700">
                La funcionalidad de edición de posts está en desarrollo. 
                Próximamente podrás editar títulos, contenido e imágenes.
              </p>
            </div>

            <div className="space-y-3 text-sm text-slate-600 mb-6">
              <p>• ✏️ Edición de título y contenido</p>
              <p>• 🖼️ Subida y edición de imágenes</p>
              <p>• 🏷️ Cambio de categorías</p>
              <p>• ✅ Validaciones y permisos</p>
            </div>

            <Button
              onClick={() => navigate(`/post/${slug}`)}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver al Post
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
