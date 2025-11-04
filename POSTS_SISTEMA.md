# 📱 Sistema de Posts - ViveMedellín

## 🎯 Descripción General

Sistema completo de posts y comentarios para la comunidad de ViveMedellín. Los usuarios pueden ver posts de otros usuarios, crear sus propios posts, dar "me gusta" y comentar.

---

## 🏗️ Arquitectura

### **Componentes Creados:**

1. **`CreatePost.tsx`** - Formulario para crear nuevos posts
2. **`PostCard.tsx`** - Card individual para mostrar un post con likes y comentarios
3. **`Posts.tsx`** - Página principal del feed de posts

### **Servicios:**

- **`postService.ts`** - Servicio mock con localStorage para CRUD de posts

### **Tipos:**

- **`post.ts`** - Interfaces TypeScript para Post y PostComment

---

## 🔄 Flujo de Usuario

### **1. Login → Redirección**
```
Usuario hace login → LoginDialog guarda token → Redirige a /posts
```

### **2. Ver Posts**
```
Posts.tsx carga → Verifica autenticación → Carga posts desde localStorage → Muestra feed
```

### **3. Crear Post**
```
Usuario escribe en CreatePost → Click "Publicar" → Se guarda en localStorage → Feed se actualiza
```

### **4. Interacciones**
```
Like: Click en corazón → Toggle like → Actualiza contador
Comentar: Click "Comentar" → Se abre textarea → Escribe comentario → Envía
```

---

## 📊 Estructura de Datos

### **Post Interface**
```typescript
interface Post {
  id: string
  userId: string
  userName: string
  userImage?: string
  content: string
  imageUrl?: string
  createdAt: string
  likes: number
  commentsCount: number
  isLiked?: boolean
}
```

### **PostComment Interface**
```typescript
interface PostComment {
  id: string
  postId: string
  userId: string
  userName: string
  content: string
  createdAt: string
}
```

---

## 🎨 Características de UI

### **CreatePost Component**
- ✅ Expandible (click para mostrar textarea completa)
- ✅ Avatar con inicial del usuario
- ✅ Placeholder: "¿Qué está pasando en Medellín?"
- ✅ Botón de imagen (deshabilitado por ahora)
- ✅ Botones Cancelar/Publicar
- ✅ Loading spinner mientras publica
- ✅ Validación: no permite posts vacíos

### **PostCard Component**
- ✅ Avatar con inicial del usuario
- ✅ Nombre de usuario + timestamp relativo (2m, 5h, 3d)
- ✅ Contenido del post
- ✅ Contador de likes y comentarios
- ✅ Botones: Me gusta, Comentar, Compartir (deshabilitado)
- ✅ Corazón relleno cuando el usuario dio like
- ✅ Sección de comentarios expandible
- ✅ Textarea para agregar comentarios
- ✅ Hover effects y transiciones

### **Posts Page**
- ✅ Navbar sticky con:
  - Logo de ViveMedellín
  - Botón "Inicio" (vuelve a /)
  - Botón "Eventos"
  - Avatar y nombre del usuario
  - Botón logout
- ✅ Header con título y descripción
- ✅ CreatePost en la parte superior
- ✅ Feed de posts
- ✅ Estado de carga con spinner
- ✅ Estado vacío con ilustración
- ✅ Footer

---

## 🛠️ Funcionalidades Implementadas

### **Autenticación**
- ✅ Verificación de token al cargar `/posts`
- ✅ Redirección a `/` si no está logueado
- ✅ Logout limpia token y vuelve a home

### **Posts**
- ✅ Ver lista de posts
- ✅ Crear nuevo post
- ✅ Dar/quitar like
- ✅ Ver contador de likes y comentarios
- ✅ Posts ordenados por fecha (más recientes primero)

### **Comentarios**
- ✅ Ver sección de comentarios
- ✅ Agregar comentarios
- ✅ Validación: no permite comentarios vacíos

### **Persistencia**
- ✅ Posts guardados en localStorage (`vivemedellin_posts`)
- ✅ Comentarios guardados en localStorage (`vivemedellin_comments`)
- ✅ Likes persistentes por usuario

---

## 🔧 Métodos del PostService

### **`getPosts()`**
Retorna todos los posts ordenados por fecha descendente.

### **`createPost(content, userId, userName)`**
Crea un nuevo post y lo guarda en localStorage.

### **`toggleLike(postId)`**
Activa/desactiva el like de un post (por ahora global, sin control por usuario).

### **`getComments(postId)`**
Retorna todos los comentarios de un post específico.

### **`addComment(postId, content, userId, userName)`**
Agrega un comentario a un post y actualiza el contador.

---

## 📝 Posts de Ejemplo (Mock Data)

El sistema viene con 4 posts iniciales:

1. **Steven** - Hablando sobre el concierto de Bad Bunny
2. **Dahiana** - Preguntando sobre el concierto de Guns N' Roses
3. **Andrés** - Recomendando eventos culturales
4. **Lucas** - Experiencia en el Parque Explora

---

## 🚀 Próximos Pasos (Backend Real)

Cuando conectes con el backend real, deberás:

1. **Cambiar `postService.ts`** para usar fetch en lugar de localStorage
2. **Endpoints necesarios:**
   ```
   GET    /api/posts              - Listar posts
   POST   /api/posts              - Crear post
   POST   /api/posts/:id/like     - Toggle like
   GET    /api/posts/:id/comments - Listar comentarios
   POST   /api/posts/:id/comments - Crear comentario
   DELETE /api/posts/:id          - Eliminar post (opcional)
   PUT    /api/posts/:id          - Editar post (opcional)
   ```

3. **Headers necesarios:**
   ```typescript
   headers: {
     "Content-Type": "application/json",
     "Authorization": `Bearer ${localStorage.getItem("token")}`
   }
   ```

4. **Manejo de errores HTTP:** 401 (no autorizado), 403 (prohibido), etc.

---

## 🧪 Cómo Probar

### **1. Login**
```
1. Ve a http://localhost:8080
2. Click en "Iniciar Sesión"
3. Ingresa credenciales válidas
4. Deberías ser redirigido a /posts
```

### **2. Ver Posts**
```
1. Deberías ver 4 posts de ejemplo
2. Cada post muestra nombre, contenido, likes y comentarios
```

### **3. Crear Post**
```
1. Click en el input "¿Qué está pasando en Medellín?"
2. Escribe algo (ej: "¡Qué gran ciudad!")
3. Click en "Publicar"
4. Tu post debería aparecer en la parte superior
```

### **4. Dar Like**
```
1. Click en el botón "Me gusta" de cualquier post
2. El corazón se debería llenar de rojo
3. El contador de likes aumenta en 1
4. Click de nuevo para quitar el like
```

### **5. Comentar**
```
1. Click en "Comentar" en cualquier post
2. Escribe un comentario
3. Click en el botón de enviar (→)
4. El contador de comentarios aumenta
```

### **6. Logout**
```
1. Click en el botón de logout (icono de salida)
2. Deberías volver a la página de inicio
3. Ya no deberías poder acceder a /posts sin login
```

---

## 🎨 Colores y Estilos

- **Gradiente principal:** `from-blue-600 to-purple-600`
- **Background:** `from-slate-50 via-blue-50 to-purple-50`
- **Cards:** Fondo blanco con sombra y hover effect
- **Botones:** Gradientes y efectos hover
- **Avatares:** Gradiente circular con inicial

---

## 📱 Responsive Design

- ✅ Mobile first
- ✅ Breakpoints: sm, md, lg
- ✅ Navbar adaptativo
- ✅ Cards fluidas
- ✅ Botones adaptados

---

## 🔒 Seguridad

- ✅ Verificación de token en cada carga de `/posts`
- ✅ Redirección si no está autenticado
- ✅ Validación de campos vacíos
- ⚠️ **NOTA:** El sistema actual es MOCK. En producción necesitarás:
  - Validación de permisos en backend
  - Solo el autor puede editar/eliminar sus posts
  - Rate limiting
  - Sanitización de contenido

---

## 📦 LocalStorage Keys

```typescript
"token"                    // JWT token de autenticación
"user"                     // Objeto de usuario {id, name, email}
"vivemedellin_posts"       // Array de posts
"vivemedellin_comments"    // Array de comentarios
```

---

## ✅ Checklist de Funcionalidades

**Página de Posts:**
- ✅ Protección por autenticación
- ✅ Navbar con usuario y logout
- ✅ Crear posts
- ✅ Ver feed de posts
- ✅ Dar likes
- ✅ Comentar posts
- ✅ Timestamps relativos
- ✅ Estados de loading
- ✅ Estado vacío
- ✅ Persistencia en localStorage

**Redirección:**
- ✅ Login redirige a /posts
- ✅ /posts sin login redirige a /
- ✅ Navbar en home muestra "Comunidad" si está logueado

**UX:**
- ✅ Loading spinners
- ✅ Validaciones en tiempo real
- ✅ Feedback visual (corazón relleno al dar like)
- ✅ Hover effects
- ✅ Transiciones suaves

---

¡Sistema de posts completamente funcional! 🎉
