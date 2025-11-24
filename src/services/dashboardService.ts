/**
 * Servicio para obtener datos del Dashboard de eventos
 * HU-09: Dashboard de eventos
 */

const API_BASE_URL = "https://vivemedellin-backend.onrender.com/api"

// Interfaces para los endpoints del backend
interface BackendDashboardStats {
  totalPosts: number
  totalComments: number
  totalUsers: number
  totalSavedPosts: number
  activeUsersLast7Days: number
  newPostsLast7Days: number
}

interface BackendTopCommentedPost {
  postId: number
  postTitle: string
  imageName: string
  commentCount: number
  savedCount: number
  author: {
    id: number
    name: string
    profileImage: string
  }
  categoryName: string
}

interface BackendActiveUser {
  userId: number
  name: string
  email: string
  postCount: number
  commentCount: number
  totalActivity: number
}

interface BackendDashboardResponse {
  generalStats: BackendDashboardStats
  topCommentedPosts: BackendTopCommentedPost[]
  mostActiveUsers: BackendActiveUser[]
}

// Alias para el endpoint /dashboard/stats
type BackendGeneralStats = BackendDashboardStats

export interface TrendingEvent {
  id: number
  title?: string
  content: string
  authorName: string
  authorId: number
  commentsCount: number
  createdAt: string
  category?: {
    id: number
    title: string
  }
}

export interface ActiveUser {
  id: number
  name: string
  profileImage?: string
  eventsCount: number
  commentsCount: number
  activityScore: number
}

export interface DashboardStats {
  totalEvents: number
  totalComments: number
  activeUsers: number
  trendingEvents: number
}

export interface DashboardData {
  trendingEvents: TrendingEvent[]
  activeUsers: ActiveUser[]
  stats: DashboardStats
}

/**
 * Obtener datos completos del dashboard usando endpoints reales del backend
 */
export const getDashboardData = async (): Promise<DashboardData> => {
  const token = localStorage.getItem("token")
  
  if (!token) {
    throw new Error("Debes iniciar sesión para ver el dashboard")
  }

  try {
    console.log("📊 [Dashboard] Obteniendo datos del dashboard...")

    const response = await fetch(`${API_BASE_URL}/dashboard`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Error del servidor: ${response.status}`)
    }

    const data: BackendDashboardResponse = await response.json()
    console.log("✅ [Dashboard] Datos obtenidos del backend:", data)

    // Transformar los datos al formato que espera el frontend
    const dashboardData: DashboardData = {
      trendingEvents: data.topCommentedPosts.map(post => ({
        id: post.postId,
        title: post.postTitle,
        content: post.postTitle, // Usamos el título como contenido por ahora
        authorName: post.author.name,
        authorId: post.author.id,
        commentsCount: post.commentCount,
        createdAt: new Date().toISOString(), // El backend no devuelve fecha
        category: {
          id: 0,
          title: post.categoryName
        }
      })),
      activeUsers: data.mostActiveUsers.map(user => ({
        id: user.userId,
        name: user.name,
        profileImage: undefined, // El backend no incluye profileImage en este endpoint
        eventsCount: user.postCount,
        commentsCount: user.commentCount,
        activityScore: user.totalActivity
      })),
      stats: {
        totalEvents: data.generalStats.totalPosts,
        totalComments: data.generalStats.totalComments,
        activeUsers: data.generalStats.activeUsersLast7Days,
        trendingEvents: data.topCommentedPosts.length
      }
    }

    return dashboardData

  } catch (error) {
    console.error("❌ [Dashboard] Error al obtener datos:", error)
    throw error
  }
}

/**
 * Obtener eventos más comentados recientemente usando endpoints reales
 */
export const getTrendingEvents = async (token: string): Promise<TrendingEvent[]> => {
  try {
    console.log("📈 [Dashboard] Obteniendo eventos más comentados...")

    const response = await fetch(`${API_BASE_URL}/dashboard/top-commented-posts`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Error del servidor: ${response.status}`)
    }

    const data: BackendTopCommentedPost[] = await response.json()
    console.log("✅ [Dashboard] Trending events obtenidos:", data)

    return data.map(post => ({
      id: post.postId,
      title: post.postTitle,
      content: post.postTitle, // Usar título como contenido temporalmente
      authorName: post.author.name,
      authorId: post.author.id,
      commentsCount: post.commentCount,
      createdAt: new Date().toISOString(), // El endpoint no devuelve fecha
      category: {
        id: 0,
        title: post.categoryName
      }
    }))

  } catch (error) {
    console.error("❌ [Dashboard] Error en getTrendingEvents:", error)
    return []
  }
}

/**
 * Obtener usuarios más activos
 */
export const getActiveUsers = async (token: string): Promise<ActiveUser[]> => {
  try {
    console.log("👑 [Dashboard] Obteniendo usuarios más activos...")

    const response = await fetch(`${API_BASE_URL}/dashboard/most-active-users`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Error del servidor: ${response.status}`)
    }

    const data: BackendActiveUser[] = await response.json()
    console.log("✅ [Dashboard] Usuarios activos obtenidos:", data)

    return data.map(user => ({
      id: user.userId,
      name: user.name,
      profileImage: undefined, // El endpoint no incluye profileImage
      eventsCount: user.postCount,
      commentsCount: user.commentCount,
      activityScore: user.totalActivity
    }))

  } catch (error) {
    console.error("❌ [Dashboard] Error en getActiveUsers:", error)
    return []
  }
}

/**
 * Obtener estadísticas generales del dashboard
 */
export const getDashboardStats = async (token: string): Promise<DashboardStats> => {
  try {
    console.log("📈 [Dashboard] Obteniendo estadísticas...")

    const response = await fetch(`${API_BASE_URL}/dashboard/stats`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Error del servidor: ${response.status}`)
    }

    const data: BackendGeneralStats = await response.json()
    console.log("✅ [Dashboard] Estadísticas obtenidas:", data)

    return {
      totalEvents: data.totalPosts,
      totalComments: data.totalComments,
      activeUsers: data.activeUsersLast7Days,
      trendingEvents: 5 // Valor fijo ya que el endpoint específico maneja los trending
    }

  } catch (error) {
    console.error("❌ [Dashboard] Error en getDashboardStats:", error)
    return {
      totalEvents: 0,
      totalComments: 0,
      activeUsers: 0,
      trendingEvents: 0
    }
  }
}

export const dashboardService = {
  getDashboardData,
  getTrendingEvents,
  getActiveUsers,
  getDashboardStats
}
