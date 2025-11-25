# Sistema de Posts Guardados - Documentación

## Descripción General

Sistema completo para guardar y gestionar posts favoritos usando la API del backend de Viva Medellín. Los usuarios pueden marcar posts como guardados y visualizarlos en una página dedicada.

## Estructura de Archivos

```
src/
├── hooks/
│   └── useSavedPosts.ts           # Hook personalizado para gestión de posts guardados
├── services/
│   └── savedPostService.ts       # Servicio de API para posts guardados
├── components/
│   └── SaveButton.tsx           # Componente botón de guardar
└── pages/
    └── SavedEventsPage.tsx      # Página de posts guardados
```

## API Endpoints

### Estructura de Datos del Backend

```typescript
interface SavedPost {
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
  comments: Array<{
    id: number
    content: string
    createdDate: string
    editedDate: string
    user: User
    parentCommentId: number
    replies: string[]
  }>
}
```

### Endpoints Implementados

1. **POST /api/saved-posts/{postId}** - Guardar un post
   - Headers: `Authorization: Bearer {token}`
   - Response: `{ message: string, success: boolean, token: string }`

2. **DELETE /api/saved-posts/{postId}** - Quitar un post guardado
   - Headers: `Authorization: Bearer {token}`
   - Response: `{ message: string, success: boolean, token: string }`

3. **GET /api/saved-posts/{postId}/check** - Verificar si un post está guardado
   - Headers: `Authorization: Bearer {token}`
   - Response: `boolean` (true si está guardado)

4. **GET /api/saved-posts** - Obtener posts guardados del usuario autenticado
   - Headers: `Authorization: Bearer {token}`
   - Response: `SavedPost[]`

## Componentes Principales

### useSavedPosts Hook

Gestiona el estado global de posts guardados:

```typescript
const {
  savedPosts,      // Array de posts guardados
  savedPostIds,    // Set de IDs guardados para verificación rápida
  loading,         // Estado de carga
  error,          // Errores
  savePost,       // Función para guardar
  unsavePost,     // Función para quitar de guardados
  isPostSaved,    // Verificar si está guardado (local)
  checkIfSaved,   // Verificar en servidor
  loadSavedPosts  // Recargar lista
} = useSavedPosts()
```

### SaveButton Componente

Botón reutilizable para guardar/quitar posts:

```tsx
<SaveButton
  postId={123}
  variant="outline"
  size="sm"
  showLabel={true}
/>
```

**Props:**
- `postId`: ID del post (requerido)
- `initialSaved`: Estado inicial (opcional)
- `variant`: Estilo del botón ("default", "outline", "ghost")
- `size`: Tamaño ("sm", "default", "lg", "icon")
- `showLabel`: Mostrar texto del botón (opcional)

### SavedEventsPage

Página completa con lista de posts guardados:

**Características:**
- Grid responsivo de posts guardados
- Información completa del post (título, autor, fecha, categoría)
- Imágenes con efecto hover
- Botones de acción (Ver detalles, Quitar de guardados)
- Estados de loading y error
- Recarga automática al cambiar visibilidad

## Flujo de Funcionamiento

### 1. Verificación de Estado Inicial
```
Usuario navega a post → SaveButton se monta → checkIfSaved(postId) → UI actualizada
```

### 2. Guardar Post
```
Click en SaveButton → savePost(postId) → API POST → Estado actualizado → Toast confirmación
```

### 3. Quitar de Guardados
```
Click en SaveButton guardado → unsavePost(postId) → API DELETE → Estado actualizado → Toast confirmación
```

### 4. Cargar Posts Guardados
```
Navegar a /saved-posts → loadSavedPosts() → API GET → Renderizar lista
```

## Manejo de Estados

### Estados de Loading
- Verificación inicial del estado de guardado
- Operaciones de guardar/quitar
- Carga de lista completa

### Manejo de Errores
- Autenticación expirada (401)
- Sin permisos (403)
- Post no encontrado (404)
- Errores de red
- Errores del servidor (500)

### Sincronización
- Estado local sincronizado con API
- Hook compartido mantiene consistencia entre componentes
- Recarga automática después de operaciones

## Integración con Autenticación

### Token JWT
- Automáticamente obtenido del localStorage
- Incluido en headers de todas las peticiones
- Manejo de tokens expirados

### Verificación de Usuario
- Botones deshabilitados si no hay autenticación
- Mensajes informativos para usuarios no logueados
- Redirección automática si es necesario

## Optimizaciones

### Performance
- Verificación rápida con Set de IDs
- Lazy loading de estado inicial
- Debounce en verificaciones repetidas

### UX/UI
- Estados de loading visuales
- Transiciones suaves
- Tooltips informativos
- Confirmaciones con toast

### Cache y Sincronización
- Estado global compartido entre componentes
- Recarga inteligente solo cuando es necesario
- Persistencia durante sesión de usuario

## Uso en Otros Componentes

### En Lista de Posts
```tsx
import { SaveButton } from "@/components/SaveButton"

function PostCard({ post }) {
  return (
    <Card>
      {/* Contenido del post */}
      <SaveButton postId={post.id} variant="outline" size="sm" />
    </Card>
  )
}
```

### En Página de Detalle
```tsx
function PostDetail({ post }) {
  return (
    <div>
      {/* Contenido */}
      <SaveButton 
        postId={post.id} 
        variant="default" 
        size="lg" 
        showLabel={true} 
      />
    </div>
  )
}
```

### Verificación Programática
```tsx
function SomeComponent() {
  const { isPostSaved, checkIfSaved } = useSavedPosts()
  
  // Verificación local (rápida)
  const isSaved = isPostSaved(postId)
  
  // Verificación en servidor (precisa)
  const checkServer = async () => {
    const saved = await checkIfSaved(postId)
    console.log('Post guardado:', saved)
  }
}
```

## Troubleshooting

### Problemas Comunes

1. **Posts no aparecen en guardados**
   - Verificar autenticación
   - Comprobar response de API
   - Revisar logs de red en DevTools

2. **Estado inconsistente**
   - Usar `checkIfSaved` para verificar servidor
   - Llamar `loadSavedPosts()` para refrescar

3. **Errores de permisos**
   - Verificar token JWT válido
   - Comprobar headers de autorización
   - Revisar configuración de backend

### Debug
```typescript
// Activar logs detallados
console.log('Estado hook:', {
  savedPosts: savedPosts.length,
  savedIds: Array.from(savedPostIds),
  loading,
  error
})
```

## Roadmap

### Próximas Mejoras
- [ ] Sincronización offline
- [ ] Categorización de guardados
- [ ] Búsqueda en posts guardados
- [ ] Exportar lista de guardados
- [ ] Compartir colecciones de guardados
- [ ] Notificaciones de nuevos posts de autores guardados

---

**Versión:** 1.0  
**Última actualización:** Noviembre 2025  
**Estado:** ✅ Producción Ready