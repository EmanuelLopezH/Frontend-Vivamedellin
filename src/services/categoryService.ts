/**
 * Servicio para manejar operaciones con categorías
 */

const API_BASE_URL = "https://vivemedellin-backend.onrender.com/api"

export interface Category {
  categoryId: number
  categoryTitle: string
  categoryDescription: string
}

/**
 * Obtener todas las categorías disponibles
 */
export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Error al cargar categorías")
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error en getCategories:", error)
    throw error
  }
}

export const categoryService = {
  getCategories,
}
