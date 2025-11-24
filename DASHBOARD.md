# 📊 Dashboard de Eventos - ViveMedellín

## 🎯 Descripción General

Dashboard completo con estadísticas en tiempo real de la plataforma, eventos más comentados, usuarios más activos y métricas generales. Integrado con endpoints reales del backend con auto-refresh automático.

---

## 🏗️ Arquitectura

### **Archivos Creados:**

- **`Dashboard.tsx`** - Página principal del dashboard
- **`dashboardService.ts`** - Servicio integrado con endpoints reales del backend

### **Archivos Modificados:**

- **`App.tsx`** - Agregada ruta `/dashboard`
- **`Navbar.tsx`** - Botón "Dashboard" para usuarios autenticados

---

## 🔌 Endpoints del Backend

### **1. Dashboard Completo:**

```
GET https://vivemedellin-backend.onrender.com/api/dashboard
Authorization: Bearer {token}
Content-Type: application/json

Response (200):
{
  "generalStats": {
    "totalPosts": 45,
    "totalComments": 203,
    "totalUsers": 28,
    "totalSavedPosts": 67,
    "activeUsersLast7Days": 12,
    "newPostsLast7Days": 8
  },
  "topCommentedPosts": [
    {
      "postId": 123,
      "postTitle": "Festival de Rock en Parque Lleras",
      "imageName": "festival-rock.jpg",
      "commentCount": 24,
      "savedCount": 15,
      "author": {
        "id": 5,
        "name": "Yiyi Lopez",
        "profileImage": null
      },
      "categoryName": "Música"
    }
  ],
  "mostActiveUsers": [
    {
      "userId": 5,
      "name": "Yiyi Lopez",
      "email": "yiyi@example.com",
      "postCount": 12,
      "commentCount": 45,
      "totalActivity": 150
    }
  ]
}
```

### **2. Estadísticas Generales:**

```
GET https://vivemedellin-backend.onrender.com/api/dashboard/stats
Authorization: Bearer {token}

Response (200):
{
  "totalPosts": 45,
  "totalComments": 203,
  "totalUsers": 28,
  "totalSavedPosts": 67,
  "activeUsersLast7Days": 12,
  "newPostsLast7Days": 8
}
```

### **3. Posts Más Comentados:**

```
GET https://vivemedellin-backend.onrender.com/api/dashboard/top-commented-posts
Authorization: Bearer {token}

Response (200):
[
  {
    "postId": 123,
    "postTitle": "Festival de Rock en Parque Lleras",
    "imageName": "festival-rock.jpg",
    "commentCount": 24,
    "savedCount": 15,
    "author": {
      "id": 5,
      "name": "Yiyi Lopez",
      "profileImage": "profile.jpg"
    },
    "categoryName": "Música"
  }
]
```

### **4. Usuarios Más Activos:**

```
GET https://vivemedellin-backend.onrender.com/api/dashboard/most-active-users
Authorization: Bearer {token}

Response (200):
[
  {
    "userId": 5,
    "name": "Yiyi Lopez",
    "email": "yiyi@example.com",
    "postCount": 12,
    "commentCount": 45,
    "totalActivity": 150
  }
]
```

---

## ✨ Funcionalidades Implementadas

### **1. Validación de Autenticación**

- ✅ Lee `token` de `localStorage`
- ✅ Si NO está logueado → redirecciona a `/` (home)
- ✅ Solo usuarios autenticados pueden acceder
- ✅ Headers con `Authorization: Bearer {token}`

### **2. Estadísticas Generales (Cards Superiores)**

#### **Total de Eventos:**
- ✅ Número total de posts publicados
- ✅ Icono: 📅 Calendar
- ✅ Color: Azul (from-blue-500 to-blue-600)

#### **Total de Comentarios:**
- ✅ Número total de comentarios realizados
- ✅ Icono: 💬 MessageSquare
- ✅ Color: Verde (from-green-500 to-green-600)

#### **Usuarios Activos:**
- ✅ Usuarios activos en los últimos 7 días
- ✅ Icono: 👥 Users
- ✅ Color: Púrpura (from-purple-500 to-purple-600)

#### **Eventos Trending:**
- ✅ Número de eventos más comentados (fijo: 5)
- ✅ Icono: 🔥 TrendingUp
- ✅ Color: Naranja (from-orange-500 to-orange-600)

### **3. Eventos Más Comentados**

- ✅ **Top 5 posts** con más comentarios
- ✅ **Título del evento** con truncado elegante
- ✅ **Autor** con enlace al perfil
- ✅ **Categoría** con badge colorido
- ✅ **Número de comentarios** con icono
- ✅ **Click en título** → navega a `/post/{postId}`
- ✅ **Loading skeleton** mientras carga
- ✅ **Estado vacío** si no hay eventos

### **4. Usuarios Más Activos**

- ✅ **Top usuarios** ordenados por actividad total
- ✅ **Avatar** con iniciales o imagen de perfil
- ✅ **Nombre** con enlace al perfil
- ✅ **Posts creados** y **comentarios realizados**
- ✅ **Puntuación de actividad** total
- ✅ **Badge de posición** (1°, 2°, 3°, etc.)
- ✅ **Loading skeleton** mientras carga

### **5. Auto-Refresh**

- ✅ **Actualización automática** cada 5 minutos
- ✅ **Indicador visual** "Última actualización: hace X minutos"
- ✅ **Botón refresh manual** en el header
- ✅ **No interrumpe** la interacción del usuario
- ✅ **Mantiene scroll position**

### **6. Estados de Carga**

#### **Loading Inicial:**
- ✅ **Skeleton cards** para estadísticas
- ✅ **Skeleton list** para eventos trending
- ✅ **Skeleton avatars** para usuarios activos
- ✅ **Shimmer animation** suave

#### **Refresh Background:**
- ✅ **Spinner pequeño** en botón refresh
- ✅ **Datos antiguos** siguen visibles
- ✅ **Update silencioso** sin skeletons

### **7. Manejo de Errores**

- ✅ **Alert rojo** si falla la carga inicial
- ✅ **Toast notification** si falla el refresh
- ✅ **Retry automático** después de 30 segundos
- ✅ **Fallback a datos cached** si hay error de red

## 🎯 Interfaces TypeScript

### **Frontend Interfaces:**

```typescript
interface DashboardData {
  trendingEvents: TrendingEvent[]
  activeUsers: ActiveUser[]
  stats: DashboardStats
}

interface TrendingEvent {
  id: number
  title: string
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

interface ActiveUser {
  id: number
  name: string
  profileImage?: string
  eventsCount: number
  commentsCount: number
  activityScore: number
}

interface DashboardStats {
  totalEvents: number
  totalComments: number
  activeUsers: number
  trendingEvents: number
}
```

### **Backend Interfaces:**

```typescript
interface BackendDashboardResponse {
  generalStats: BackendDashboardStats
  topCommentedPosts: BackendTopCommentedPost[]
  mostActiveUsers: BackendActiveUser[]
}

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
```

---

## 🎨 Componentes UI Utilizados

### **Shadcn Components:**

```typescript
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
```

## 🧪 Cómo Probar

### **1. Acceso al Dashboard:**

```
✅ CON LOGIN:
1. Login en /
2. Navbar muestra botón "Dashboard"
3. Click "Dashboard" → /dashboard
4. Página carga con datos reales

❌ SIN LOGIN:
1. Ve directamente a /dashboard
2. Debería redirigir a /
3. Muestra página de login
```

### **2. Datos en Tiempo Real:**

```
1. Ve a /dashboard
2. Observa las estadísticas actuales
3. Ve al backend y crea un nuevo post
4. Espera 5 minutos O click "Actualizar"
5. Las estadísticas deberían reflejar el cambio
```

### **3. Navegación desde Dashboard:**

```
1. Ve a /dashboard
2. Click en título de evento trending
3. Debería navegar a /post/{id}
4. Vuelve al dashboard
5. Click en nombre de usuario activo
6. Debería navegar a perfil (cuando esté implementado)
```


## 🔄 Servicios Implementados

### **dashboardService.ts:**

```typescript
// Método principal
export const getDashboardData = async (): Promise<DashboardData>

// Métodos individuales (para uso futuro)
export const getTrendingEvents = async (token: string): Promise<TrendingEvent[]>
export const getActiveUsers = async (token: string): Promise<ActiveUser[]>
export const getDashboardStats = async (token: string): Promise<DashboardStats>

// Export del servicio
export const dashboardService = {
  getDashboardData,
  getTrendingEvents,
  getActiveUsers,
  getDashboardStats
}
```

### **Uso en Dashboard.tsx:**

```typescript
import { getDashboardData } from "@/services/dashboardService"

const loadDashboardData = async () => {
  try {
    setLoading(true)
    const data = await getDashboardData()
    setDashboardData(data)
    setError(null)
  } catch (error) {
    setError("Error al cargar el dashboard")
  } finally {
    setLoading(false)
    setLastUpdate(new Date())
  }
}
```

## 📊 Métricas Mostradas

### **Estadísticas Generales:**
- ✅ **Total de Eventos:** Todos los posts publicados
- ✅ **Total de Comentarios:** Suma de todos los comentarios
- ✅ **Usuarios Activos:** Usuarios activos últimos 7 días
- ✅ **Eventos Trending:** Número fijo (5) de top events

### **Eventos Más Comentados:**
- ✅ **Top 5** posts ordenados por número de comentarios
- ✅ **Título** del evento
- ✅ **Autor** del evento
- ✅ **Categoría** del evento
- ✅ **Número de comentarios**

### **Usuarios Más Activos:**
- ✅ **Top usuarios** ordenados por actividad total
- ✅ **Nombre** del usuario
- ✅ **Posts creados** por el usuario
- ✅ **Comentarios realizados** por el usuario
- ✅ **Puntuación total** de actividad

---

## 🚀 Ruta de Acceso

### **URL:**
```
http://localhost:3000/dashboard
```

### **Navegación:**
```
Navbar → Click "Dashboard" → /dashboard
```

### **Protección:**
```
✅ Requiere autenticación (token en localStorage)
✅ Redirige a "/" si no está logueado
✅ Headers Authorization en todas las requests
```
¡Dashboard completo y funcional con datos reales! 📊✨