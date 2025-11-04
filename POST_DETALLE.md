# 📄 Detalle de Post con Comentarios Anidados - ViveMedellín

## 🎯 Descripción General

Sistema completo de detalle de post con comentarios anidados (respuestas a respuestas), edición, eliminación y permisos por rol.

---

## 🏗️ Arquitectura

### **Nuevos Archivos Creados:**

1. **`pages/PostDetail.tsx`** - Página de detalle del post
2. **`components/CommentItem.tsx`** - Componente de comentario individual con respuestas
3. **`components/CommentSectionNested.tsx`** - Sección completa de comentarios
4. **`services/postDetailService.ts`** - Servicio para posts y comentarios

---

## 🔌 Endpoints del Backend

### **1. Obtener Post Individual**
```
GET http://localhost:8081/api/posts/{postId}
```

**Response:**
```json
{
  "postId": 1,
  "postTitle": "Título del post",
  "content": "Contenido completo...",
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
```

### **2. Obtener Comentarios con Respuestas Anidadas**
```
GET http://localhost:8081/api/posts/{postId}/comments
```

**Response:**
```json
[
  {
    "id": 1,
    "content": "¡Me encanta este evento!",
    "createdDate": "2025-11-02T23:25:45.923+00:00",
    "editedDate": null,
    "user": {
      "id": 1,
      "name": "Yiyi Lopez",
      "profileImage": null
    },
    "parentCommentId": null,
    "replies": [
      {
        "id": 2,
        "content": "Yo también asistiré",
        "createdDate": "2025-11-02T23:30:00.000+00:00",
        "user": { 
          "id": 2, 
          "name": "Carlos" 
        },
        "parentCommentId": 1,
        "replies": []
      }
    ]
  }
]
```

### **3. Agregar Comentario o Respuesta**
```
POST http://localhost:8081/api/posts/{postId}/comments
Authorization: Bearer {token}

Body:
{
  "content": "Mi comentario",
  "userId": 1,
  "parentCommentId": null  // o ID del comentario padre para respuestas
}
```

### **4. Editar Comentario**
```
PUT http://localhost:8081/api/comments/{commentId}
Authorization: Bearer {token}

Body:
{
  "content": "Contenido editado"
}
```

### **5. Eliminar Comentario**
```
DELETE http://localhost:8081/api/comments/{commentId}
Authorization: Bearer {token}
```

---

## 🎨 Diseño de la Página

### **Estructura de PostDetail.tsx:**

```
┌───────────────────────────────────────────────────────┐
│ [← Volver]                                            │
├───────────────────────────────────────────────────────┤
│                                                       │
│           IMAGEN GRANDE DEL POST (h-96)              │
│           [Badge: Categoría] (tl-4)                  │
│                                                       │
├───────────────────────────────────────────────────────┤
│  👤 Nombre Usuario                                    │
│     📅 3 de noviembre de 2025, 10:30                 │
│                                                       │
│                    [🔖 Guardar] [↗ Compartir]        │
│                    [✏️ Editar] [🗑️ Eliminar]         │
├───────────────────────────────────────────────────────┤
│                                                       │
│  TÍTULO DEL POST EN GRANDE (text-3xl)                │
│                                                       │
│  Contenido completo del post sin truncar...          │
│  Lorem ipsum dolor sit amet, consectetur adipiscing  │
│  elit. Sed do eiusmod tempor incididunt ut labore    │
│  et dolore magna aliqua.                             │
│                                                       │
├───────────────────────────────────────────────────────┤
│  💬 5 comentarios                                     │
└───────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────┐
│  COMENTARIOS (5)                                      │
├───────────────────────────────────────────────────────┤
│  [Textarea: ¿Qué opinas sobre este evento?]          │
│                              [Publicar comentario →]  │
├───────────────────────────────────────────────────────┤
│  👤 Yiyi Lopez • hace 2h                              │
│     ¡Me encanta este evento!                          │
│     [Responder] [⋮ Editar/Eliminar]                  │
│                                                       │
│     ├─ 👤 Carlos • hace 1h                            │
│     │  Yo también asistiré                            │
│     │  [Responder] [⋮]                                │
│     │                                                 │
│     │  ├─ 👤 Ana • hace 30m                           │
│     │     ¡Genial! Nos vemos allá                     │
│     │     [Responder] [⋮]                             │
│                                                       │
│  👤 Pedro • hace 3h                                   │
│     ¿A qué hora empieza?                              │
│     [Responder] [⋮]                                   │
└───────────────────────────────────────────────────────┘
```

---

## 🎯 Funcionalidades Implementadas

### **Página de Detalle:**
- ✅ Botón "← Volver" que regresa a `/posts`
- ✅ Imagen grande del post (h-96)
- ✅ Badge de categoría con colores
- ✅ Información del autor con avatar
- ✅ Fecha completa formateada (ej: "3 de noviembre de 2025, 10:30")
- ✅ Título del post (text-3xl, bold)
- ✅ Contenido completo sin truncar
- ✅ Botones: Guardar, Compartir
- ✅ Botones Admin/Autor: Editar, Eliminar
- ✅ Contador de comentarios
- ✅ Loading skeleton mientras carga
- ✅ Error state si no se encuentra el post

### **Comentarios Principales:**
- ✅ Textarea para nuevo comentario (solo si está logueado)
- ✅ Botón "Publicar comentario" con loading
- ✅ Mensaje "Inicia sesión para comentar" si no está logueado
- ✅ Lista de comentarios ordenados por fecha (más recientes primero)
- ✅ Avatar con inicial del usuario
- ✅ Nombre de usuario + timestamp relativo
- ✅ Indicador "(editado)" si el comentario fue editado
- ✅ Botón "Responder" en cada comentario
- ✅ Menú dropdown (⋮) con Editar/Eliminar (solo autor/admin)

### **Respuestas Anidadas:**
- ✅ Respuestas indentadas con borde izquierdo
- ✅ Máximo 3 niveles de anidación
- ✅ Botón "Responder" desaparece en nivel 3
- ✅ Textarea se muestra debajo del comentario al responder
- ✅ Botones Enviar/Cancelar en formulario de respuesta
- ✅ Loading mientras envía respuesta

### **Edición de Comentarios:**
- ✅ Click en "Editar" → muestra textarea con contenido actual
- ✅ Botones Guardar/Cancelar
- ✅ Actualiza comentario en backend
- ✅ Muestra indicador "(editado)" después de editar

### **Eliminación de Comentarios:**
- ✅ Confirmación antes de eliminar
- ✅ Elimina del backend
- ✅ Recarga comentarios después de eliminar

---

## 🔐 Sistema de Permisos

### **Usuario NO logueado:**
- ✅ Puede ver post completo
- ✅ Puede ver todos los comentarios
- ❌ NO puede comentar
- ❌ NO puede responder
- ❌ NO puede guardar post

### **Usuario logueado:**
- ✅ Todo lo de NO logueado +
- ✅ Puede comentar
- ✅ Puede responder a comentarios
- ✅ Puede guardar post
- ✅ Puede editar SUS propios comentarios
- ✅ Puede eliminar SUS propios comentarios

### **Autor del Post:**
- ✅ Todo lo de Usuario logueado +
- ✅ Puede editar el post
- ✅ Puede eliminar el post

### **Admin:**
- ✅ Todo +
- ✅ Puede editar CUALQUIER comentario
- ✅ Puede eliminar CUALQUIER comentario
- ✅ Puede editar CUALQUIER post
- ✅ Puede eliminar CUALQUIER post

---

## 🎨 Características de UI

### **CommentItem Component:**
- Avatar circular con inicial
- Nombre en bold + timestamp relativo
- Indicador "(editado)" si aplica
- Contenido con `whitespace-pre-wrap`
- Botón "Responder" (icono + texto)
- Dropdown menu (⋮) con Editar/Eliminar
- Indentación con `ml-8 pl-4 border-l-2` para respuestas
- Máximo 3 niveles de profundidad

### **Estados de Comentarios:**
```typescript
Normal:   Muestra contenido + botones acción
Editando: Muestra textarea + Guardar/Cancelar
Respond:  Muestra textarea debajo + Enviar/Cancelar
Deleting: Opacity 0.5 mientras elimina
```

### **Responsive:**
- Mobile: 1 columna, botones apilados
- Desktop: Botones en fila, max-w-4xl

---

## 🔄 Flujo de Datos

### **Carga Inicial:**
```
PostDetail.tsx (useEffect)
  ↓
Promise.all([
  postDetailService.getPost(postId),
  postDetailService.getCommentsWithReplies(postId)
])
  ↓
Backend → Transform → setState
  ↓
Renderiza post + CommentSection
```

### **Agregar Comentario:**
```
CommentSection.tsx (handleSubmit)
  ↓
postDetailService.addComment(postId, content)
  ↓
POST /api/posts/{postId}/comments
  ↓
onUpdate() → loadPostAndComments()
  ↓
Recarga todo desde backend
```

### **Responder Comentario:**
```
CommentItem.tsx (handleReply)
  ↓
postDetailService.addComment(postId, content, parentCommentId)
  ↓
POST /api/posts/{postId}/comments { parentCommentId: X }
  ↓
onUpdate() → loadPostAndComments()
```

### **Editar Comentario:**
```
CommentItem.tsx (handleEdit)
  ↓
postDetailService.editComment(commentId, newContent)
  ↓
PUT /api/comments/{commentId}
  ↓
onUpdate() → recarga comentarios
```

---

## 🧪 Cómo Probar

### **1. Ver Detalle de Post (Sin Login)**
```
1. Ve a http://localhost:8080/posts
2. Click en cualquier tarjeta de post
3. Deberías ver el post completo con imagen grande
4. Puedes ver comentarios pero no puedes comentar
```

### **2. Comentar (Con Login)**
```
1. Haz login
2. Ve a cualquier post
3. Escribe en el textarea "¿Qué opinas sobre este evento?"
4. Click "Publicar comentario"
5. Tu comentario debería aparecer arriba
```

### **3. Responder a Comentario**
```
1. Click en "Responder" en cualquier comentario
2. Se abre textarea debajo del comentario
3. Escribe tu respuesta
4. Click "Responder" (botón azul con →)
5. La respuesta aparece indentada debajo
```

### **4. Editar Comentario (Solo Autor)**
```
1. En tu propio comentario, click en ⋮
2. Click en "Editar"
3. Modifica el texto
4. Click "Guardar"
5. El comentario se actualiza con indicador "(editado)"
```

### **5. Eliminar Comentario (Solo Autor/Admin)**
```
1. En tu comentario (o cualquiera si eres admin), click ⋮
2. Click "Eliminar" (texto rojo)
3. Confirmar en el diálogo
4. El comentario se elimina
```

### **6. Guardar Post**
```
1. Haz login
2. Ve a detalle de post
3. Click en "🔖 Guardar"
4. El icono se rellena
5. Click de nuevo para quitar
```

### **7. Compartir Post**
```
1. Click en "↗ Compartir"
2. La URL se copia al portapapeles
3. Mensaje de confirmación
```

### **8. Editar/Eliminar Post (Admin o Autor)**
```
1. Si eres autor o admin, verás botones adicionales
2. Click "✏️ Editar" → va a página de edición (futuro)
3. Click "🗑️ Eliminar" → confirmación → elimina y vuelve a /posts
```

---

## 📦 Estructura de Código

### **postDetailService.ts**
```typescript
interface CommentWithReplies extends PostComment {
  parentCommentId: number | null
  replies: CommentWithReplies[]
  editedDate?: string
}

Methods:
- getPost(postId)
- getCommentsWithReplies(postId)
- addComment(postId, content, parentCommentId?)
- editComment(commentId, content)
- deleteComment(commentId)
```

### **CommentItem.tsx**
```typescript
Props:
- comment: CommentWithReplies
- postId: number
- currentUserId?: number
- isAdmin?: boolean
- onUpdate: () => void
- depth?: number (para controlar anidación)

Estados:
- showReplyForm: boolean
- replyText: string
- isReplying: boolean
- isEditing: boolean
- editText: string
- isDeleting: boolean
```

### **CommentSectionNested.tsx**
```typescript
Props:
- postId: number
- comments: CommentWithReplies[]
- currentUserId?: number
- isAdmin?: boolean
- isLoggedIn: boolean
- onUpdate: () => void

Características:
- Formulario de nuevo comentario arriba
- Ordenamiento por fecha (más recientes primero)
- Mapea comentarios recursivamente
```

---

## 🎨 Estilos y Animaciones

### **Indentación de Respuestas:**
```css
depth 0: sin indentación
depth 1: ml-8 pl-4 border-l-2 border-slate-200
depth 2: ml-8 pl-4 border-l-2 border-slate-200 (anidado)
depth 3: ml-8 pl-4 border-l-2 border-slate-200 (máximo)
```

### **Estados Visuales:**
```css
Normal:    opacity-100
Deleting:  opacity-50
Loading:   spinner animado
Editando:  textarea expandido
```

### **Botones:**
```css
Responder:  text-slate-600 hover:text-blue-600
Editar:     text con icono ✏️
Eliminar:   text-red-600 con icono 🗑️
```

---

## 🐛 Manejo de Errores

### **Post no encontrado:**
```typescript
if (error || !post) {
  return (
    <AlertCircle + "Post no encontrado" />
    <Button>Volver al feed</Button>
  )
}
```

### **Error al cargar comentarios:**
```typescript
catch (err) {
  console.error("Error al cargar post:", err)
  setError("No se pudo cargar el post...")
}
```

### **Error al comentar sin login:**
```typescript
if (!isLoggedIn) {
  alert("Debes iniciar sesión para comentar")
  return
}
```

### **Error al editar/eliminar sin permisos:**
```typescript
if (!token) {
  throw new Error("No autenticado")
}
```

---

## 🔜 Mejoras Futuras

- [ ] Rich text editor para comentarios (markdown)
- [ ] Reacciones a comentarios (👍 ❤️ 😂)
- [ ] Menciones de usuarios (@usuario)
- [ ] Notificaciones cuando te responden
- [ ] Scroll infinito de comentarios
- [ ] Ordenar comentarios (recientes/populares)
- [ ] Reportar comentarios inapropiados
- [ ] Previsualización de enlaces en comentarios
- [ ] Upload de imágenes en comentarios

---

## ✅ Checklist de Funcionalidades

**Página de Detalle:**
- ✅ Botón volver
- ✅ Imagen grande del post
- ✅ Información completa del autor
- ✅ Fecha formateada
- ✅ Título y contenido sin truncar
- ✅ Botones guardar/compartir
- ✅ Botones editar/eliminar (autor/admin)
- ✅ Loading skeleton
- ✅ Error state

**Comentarios:**
- ✅ Formulario para nuevo comentario
- ✅ Lista de comentarios ordenados
- ✅ Respuestas anidadas (máx 3 niveles)
- ✅ Botón responder
- ✅ Editar comentarios
- ✅ Eliminar comentarios
- ✅ Indicador "(editado)"
- ✅ Timestamps relativos
- ✅ Permisos por rol
- ✅ Estado vacío

**Integración:**
- ✅ Backend real (no mock)
- ✅ Autenticación con JWT
- ✅ Manejo de errores
- ✅ Loading states
- ✅ Confirmaciones

---

## 📚 Resumen

El sistema de detalle de post incluye:
- ✅ **Vista completa del post** con imagen grande
- ✅ **Comentarios anidados** hasta 3 niveles
- ✅ **Respuestas a comentarios** con UI intuitiva
- ✅ **Edición de comentarios** con indicador
- ✅ **Eliminación con confirmación**
- ✅ **Permisos por rol** (Guest/Usuario/Admin)
- ✅ **Backend real** integrado
- ✅ **UX profesional** con loading y errores

¡Sistema completo de detalle de posts listo! 🎉
