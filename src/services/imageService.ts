/**
 * Servicio para manejo de imágenes
 */

const API_BASE_URL = "https://vivemedellin-backend.onrender.com/api"

export const imageService = {
  /**
   * Construir URL completa para una imagen
   * @param imageName - Nombre del archivo de imagen
   * @returns URL completa de la imagen
   */
  getImageUrl: (imageName: string | null | undefined): string | null => {
    if (!imageName) return null
    
    // Si ya es una URL completa, devolverla tal como está
    if (imageName.startsWith('http://') || imageName.startsWith('https://')) {
      return imageName
    }
    
    // Construir URL usando el endpoint del backend
    return `${API_BASE_URL}/posts/images/${imageName}`
  },

  /**
   * Subir imagen para un post
   * @param postId - ID del post
   * @param file - Archivo de imagen
   */
  uploadImage: async (postId: number, file: File): Promise<{
    postId: number
    postTitle: string
    content: string
    imageName: string
    imageUrl: string
    creationDate: string
    user: {
      id: number
      name: string
      profileImage: string
    }
    category: {
      categoryId: number
      categoryTitle: string
      categoryDescription: string
    }
  }> => {
    const token = localStorage.getItem("token")
    if (!token) {
      throw new Error("No hay token de autenticación")
    }

    const formData = new FormData()
    formData.append('image', file)

    try {
      const response = await fetch(`${API_BASE_URL}/posts/image/upload/${postId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Error al subir imagen: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Error al subir imagen:", error)
      throw error
    }
  },

  /**
   * Validar si un archivo es una imagen válida
   * @param file - Archivo a validar
   */
  validateImageFile: (file: File): { isValid: boolean; error?: string } => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    const maxSize = 5 * 1024 * 1024 // 5MB

    if (!validTypes.includes(file.type)) {
      return {
        isValid: false,
        error: 'Tipo de archivo no válido. Solo se permiten: JPG, PNG, WebP, GIF'
      }
    }

    if (file.size > maxSize) {
      return {
        isValid: false,
        error: 'El archivo es demasiado grande. Máximo 5MB'
      }
    }

    return { isValid: true }
  },

  /**
   * Obtener imagen como blob para preview
   * @param imageName - Nombre del archivo de imagen
   */
  getImageBlob: async (imageName: string): Promise<Blob> => {
    const imageUrl = imageService.getImageUrl(imageName)
    if (!imageUrl) {
      throw new Error('URL de imagen no válida')
    }

    try {
      const response = await fetch(imageUrl)
      if (!response.ok) {
        throw new Error(`Error al cargar imagen: ${response.status}`)
      }
      return await response.blob()
    } catch (error) {
      console.error("Error al obtener imagen:", error)
      throw error
    }
  }
}