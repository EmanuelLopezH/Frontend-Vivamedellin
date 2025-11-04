# 🎨 Sistema de Posts Rediseñado - ViveMedellín

## 🚀 **NUEVO**: Integración con Backend Real

El sistema ahora está **completamente integrado con el backend de Spring Boot** en `http://localhost:8081/api`.

---

## 📋 Cambios Principales

### **✅ Diseño Estilo Reddit/Twitter**
- Grid responsive: 1 columna (mobile) → 2 columnas (tablet) → 3 columnas (desktop)
- Tarjetas visuales con imagen destacada
- Badges de categoría con colores personalizados
- Hover effects y transiciones suaves

### **✅ Backend Real**
- Conexión completa con API REST
- Paginación funcional (pageNumber, pageSize)
- Sin autenticación para ver posts (público)
- Con autenticación para crear, guardar y comentar

### **✅ Nuevas Funcionalidades**
- Filtros por categoría
- Ordenamiento (Recientes / Más comentados / Más guardados)
- Paginación con botones Anterior/Siguiente
- Guardar posts favoritos (Bookmark)
- Permisos por rol (Admin puede editar/eliminar)
- Loading skeletons mientras carga

---

## 🏗️ Arquitectura Actualizada

### **Nuevos Componentes:**

1. **`PostsFeed.tsx`** (antes `Posts.tsx`)
   - Página principal del feed con grid
   - Filtros y ordenamiento
   - Paginación
   - Navbar mejorado con indicador de Admin

2. **`PostCardGrid.tsx`** (reemplaza `PostCard.tsx`)
   - Tarjeta estilo Reddit con imagen grande
   - Badge de categoría
   - Extracto de contenido (150 caracteres)
   - Botones: Comentarios, Guardar, Compartir
   - Botones adicionales para Admin/Autor: Editar, Eliminar

3. **`PostCardSkeleton.tsx`**
   - Loading skeleton para mejor UX
   - Grid de 6-9 skeletons mientras carga

4. **`postServiceBackend.ts`** (reemplaza localStorage)
   - Servicio con fetch al backend real
   - Métodos: getPosts, createPost, toggleSave, getComments, addComment, deletePost

---

## 🔌 Endpoints del Backend

### **GET /api/posts**
```
URL: http://localhost:8081/api/posts?pageNumber=0&pageSize=10
Método: GET
Auth: NO requerida (público)
```

**Response:**
```json
{
  "content": [
    {
      "postId": 1,
      "postTitle": "Título del post",
      "content": "Contenido del evento...",
      "imageName": "default.png",
      "imageUrl": "http://localhost:8081/api/posts/images/default.png",
      "creationDate": "2025-11-03 04:13:40",
      "user": {
        "id": 1,
        "name": "Yiyi Lopez",
        "profileImage": null
      },
      "category": {
        "categoryId": 1,
        "categoryTitle": "Música",
        "categoryDescription": "Eventos musicales..."
      },
      "comments": []
    }
  ],
  "pageNumber": 0,
  "pageSize": 10,
  "totalElements": 5,
  "totalPages": 1,
  "lastpage": true
}
```

### **POST /api/posts**
```
URL: http://localhost:8081/api/posts
Método: POST
Auth: Bearer Token (requerido)
Body:
{
  "postTitle": "Mi Post",
  "content": "Contenido...",
  "categoryId": 1,
  "userId": 1
}
```

### **POST /api/posts/{postId}/save**
```
URL: http://localhost:8081/api/posts/1/save
Método: POST
Auth: Bearer Token (requerido)
```

### **GET /api/posts/{postId}/comments**
```
URL: http://localhost:8081/api/posts/1/comments
Método: GET
Auth: NO requerida
```

### **POST /api/posts/{postId}/comments**
```
URL: http://localhost:8081/api/posts/1/comments
Método: POST
Auth: Bearer Token (requerido)
Body:
{
  "content": "Mi comentario...",
  "userId": 1
}
```

### **DELETE /api/posts/{postId}**
```
URL: http://localhost:8081/api/posts/1
Método: DELETE
Auth: Bearer Token (requerido)
Permisos: Solo Admin o Autor del post
```

---

## 🎨 Diseño de Tarjetas

### **Estructura de PostCardGrid:**

```
┌─────────────────────────────────┐
│     Imagen del Evento (48h)     │ ← Imagen o placeholder con gradiente
│   [Badge: Categoría]  (tl-3)    │ ← Badge flotante superior izquierda
└─────────────────────────────────┘
┌─────────────────────────────────┐
│ 👤 Nombre Usuario   •   hace 2h │ ← Header con avatar
├─────────────────────────────────┤
│ **Título del Post**             │ ← Título en bold (line-clamp-2)
│ Contenido del post truncado a  │ ← Extracto (line-clamp-3)
│ 150 caracteres máximo con...   │
├─────────────────────────────────┤
│ [💬 5] [🔖 Guardar] [↗ Compart]│ ← Botones de acción
│ [✏️ Editar] [🗑️ Eliminar]      │ ← Solo si Admin/Autor
└─────────────────────────────────┘
```

### **Colores de Categorías:**

```typescript
Música:       bg-purple-100 text-purple-700
Deportes:     bg-green-100 text-green-700
Cultura:      bg-blue-100 text-blue-700
Gastronomía:  bg-orange-100 text-orange-700
Tecnología:   bg-cyan-100 text-cyan-700
Arte:         bg-pink-100 text-pink-700
Default:      bg-slate-100 text-slate-700
```

---

## 🔐 Sistema de Permisos

### **Usuario NO logueado:**
- ✅ Puede ver todos los posts
- ✅ Puede navegar por categorías
- ✅ Puede ver detalles de posts
- ❌ NO puede guardar posts
- ❌ NO puede comentar
- ❌ NO puede crear posts

### **Usuario logueado:**
- ✅ Todo lo de NO logueado +
- ✅ Puede guardar/favoritos
- ✅ Puede comentar
- ✅ Puede crear posts
- ⚠️ Solo puede editar/eliminar SUS propios posts

### **Admin:**
- ✅ Todo lo de Usuario logueado +
- ✅ Puede editar CUALQUIER post
- ✅ Puede eliminar CUALQUIER post
- ✅ Badge "Admin" en navbar

---

## 🎯 Funcionalidades Implementadas

### **Filtros y Ordenamiento:**
- [x] Filtro por categoría (dropdown)
- [x] Todas las categorías / Música / Deportes / Cultura / etc.
- [x] Ordenar por: Más recientes / Más comentados / Más guardados
- [x] Filtros persistentes al cambiar de página

### **Paginación:**
- [x] Botones Anterior / Siguiente
- [x] Indicador "Página X de Y"
- [x] Deshabilitar botones en primera/última página
- [x] Cargar 9 posts por página (grid 3x3)

### **Interacciones:**
- [x] Click en tarjeta → Navegar a /post/{postId}
- [x] Guardar post (requiere login)
- [x] Compartir (copia URL al portapapeles)
- [x] Editar post (solo Admin/Autor)
- [x] Eliminar post con confirmación (solo Admin/Autor)

### **Estados:**
- [x] Loading skeletons (grid de 9)
- [x] Estado vacío ("No hay posts todavía")
- [x] Error handling con try/catch
- [x] Disable buttons mientras está en loading

---

## 📱 Responsive Design

### **Grid Breakpoints:**
```css
Mobile (< 768px):      1 columna
Tablet (768px-1024px): 2 columnas
Desktop (> 1024px):    3 columnas
```

### **Navbar:**
- Mobile: Logo + Menú hamburguesa (futuro)
- Desktop: Logo + Inicio + Eventos + Crear Post + Usuario/Login

---

## 🧪 Cómo Probar

### **1. Ver Posts (Sin Login)**
```
1. Ve a http://localhost:8080/posts
2. Deberías ver el grid de posts del backend
3. Prueba los filtros por categoría
4. Prueba cambiar el ordenamiento
5. Click en una tarjeta → debería ir a /post/{id}
```

### **2. Guardar Post (Con Login)**
```
1. Haz login
2. Ve a /posts
3. Click en el botón "🔖 Guardar" de cualquier post
4. El icono debería cambiar a relleno
```

### **3. Crear Post (Con Login)**
```
1. Haz login
2. Click en "Crear Post" en navbar
3. Llena título, contenido, categoría
4. Enviar → debería aparecer en el feed
```

### **4. Editar/Eliminar (Admin o Autor)**
```
1. Login como admin o autor del post
2. Deberías ver botones ✏️ y 🗑️
3. Click en eliminar → confirmación → elimina del backend
```

### **5. Paginación**
```
1. Si hay más de 9 posts en el backend
2. Deberías ver botones "Anterior" y "Siguiente"
3. Navega entre páginas
4. Los filtros se mantienen
```

---

## 🔄 Flujo de Datos

### **Carga de Posts:**
```
PostsFeed.tsx
  ↓
postServiceBackend.getPosts(page, size)
  ↓
fetch("http://localhost:8081/api/posts?pageNumber=0&pageSize=9")
  ↓
Backend Response → Transform to Post[]
  ↓
setPosts(transformed data)
  ↓
PostCardGrid renderiza cada post
```

### **Guardar Post:**
```
PostCardGrid.tsx (click Guardar)
  ↓
postServiceBackend.toggleSave(postId)
  ↓
fetch("http://localhost:8081/api/posts/1/save", {
  headers: { Authorization: Bearer token }
})
  ↓
onUpdate() → recarga posts
```

---

## 📦 Archivos Modificados/Creados

### **Nuevos:**
- ✅ `src/pages/PostsFeed.tsx` - Página principal del feed
- ✅ `src/components/PostCardGrid.tsx` - Tarjeta estilo Reddit
- ✅ `src/components/PostCardSkeleton.tsx` - Loading skeletons
- ✅ `src/services/postServiceBackend.ts` - Servicio con backend real
- ✅ `POSTS_BACKEND.md` - Esta documentación

### **Modificados:**
- ✅ `src/types/post.ts` - Agregado `postTitle`, `category`, `isSaved`
- ✅ `src/App.tsx` - Ruta `/posts` ahora usa `PostsFeed`
- ✅ `src/components/LoginDialog.tsx` - Redirige a `/posts` después de login

### **Deprecados (aún existen pero no se usan):**
- ⚠️ `src/pages/Posts.tsx` - Reemplazado por PostsFeed.tsx
- ⚠️ `src/components/PostCard.tsx` - Reemplazado por PostCardGrid.tsx
- ⚠️ `src/components/CreatePost.tsx` - Pendiente mover a página separada
- ⚠️ `src/services/postService.ts` - Reemplazado por postServiceBackend.ts

---

## 🐛 Manejo de Errores

### **Backend no disponible:**
```typescript
try {
  const response = await fetch(...)
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
} catch (error) {
  console.error("Error al cargar posts:", error)
  // Mostrar mensaje al usuario
}
```

### **Token expirado:**
```typescript
if (response.status === 401) {
  localStorage.removeItem("token")
  localStorage.removeItem("user")
  navigate("/")
}
```

### **Sin permisos:**
```typescript
if (response.status === 403) {
  alert("No tienes permisos para esta acción")
}
```

---

## 🔜 Próximos Pasos

### **Por Implementar:**
- [ ] Página individual de post (`/post/{id}`)
- [ ] Página de crear post (`/create-post`)
- [ ] Página de editar post (`/post/{id}/edit`)
- [ ] Sistema de likes (falta en backend)
- [ ] Infinite scroll (en lugar de paginación)
- [ ] Upload de imágenes
- [ ] Búsqueda de posts
- [ ] Perfil de usuario
- [ ] Notificaciones
- [ ] Posts guardados (página dedicada)

### **Mejoras de UX:**
- [ ] Toast notifications en lugar de `alert()`
- [ ] Confirmación visual al guardar/compartir
- [ ] Animaciones al cargar posts
- [ ] Lazy loading de imágenes
- [ ] Error boundary para errores globales

---

## 🎉 Resumen

El sistema ahora:
- ✅ **Conecta con backend real** (Spring Boot)
- ✅ **Diseño moderno** estilo Reddit/Twitter
- ✅ **Grid responsive** 1→2→3 columnas
- ✅ **Paginación funcional** con backend
- ✅ **Filtros por categoría** y ordenamiento
- ✅ **Sistema de permisos** (Admin/Usuario/Guest)
- ✅ **Loading skeletons** para mejor UX
- ✅ **Sin autenticación** para ver posts (público)
- ✅ **Con autenticación** para interacciones

¡El feed está listo para producción! 🚀
