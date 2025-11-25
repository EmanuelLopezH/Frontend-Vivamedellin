# Sistema de Imágenes - Documentación

## Descripción General

Sistema optimizado para manejo de imágenes del backend, que resuelve los problemas de URLs incorrectas y Mixed Content al cargar imágenes desde el servidor de producción.

## Problema Resuelto

**Antes:**
```
❌ Mixed Content Error
❌ localhost:8081 URLs en producción  
❌ net::ERR_CONNECTION_REFUSED
❌ Imágenes rotas sin fallback
```

**Después:**
```
✅ URLs correctas del backend de producción
✅ Fallback automático para imágenes faltantes
✅ Loading states optimizados  
✅ Componente reutilizable OptimizedImage
```

## Estructura de Archivos

```
src/
├── services/
│   └── imageService.ts          # Servicio centralizado de imágenes
├── components/
│   └── OptimizedImage.tsx       # Componente optimizado para imágenes
└── types/
    └── post.ts                  # Tipos actualizados con imageName
```

## API Endpoints

### Estructura del Backend

**GET `/api/posts/images/{imageName}`** - Obtener imagen por nombre
- URL completa: `https://vivemedellin-backend.onrender.com/api/posts/images/{imageName}`
- Response: Binary image data

**POST `/api/posts/image/upload/{postId}`** - Subir imagen a un post
- Headers: `Authorization: Bearer {token}`, `Content-Type: multipart/form-data`
- Body: FormData con archivo de imagen
- Response: Post actualizado con nueva imagen

## Servicios Principales

### imageService.ts

```typescript
export const imageService = {
  // Construir URL completa para una imagen
  getImageUrl: (imageName: string | null | undefined): string | null
  
  // Subir imagen para un post  
  uploadImage: (postId: number, file: File): Promise<PostResponse>
  
  // Validar archivo de imagen
  validateImageFile: (file: File): { isValid: boolean; error?: string }
  
  // Obtener imagen como blob
  getImageBlob: (imageName: string): Promise<Blob>
}
```

**Características:**
- ✅ Maneja URLs completas y nombres de archivo
- ✅ Construye URLs correctas del backend  
- ✅ Validación de tipos y tamaños
- ✅ Manejo de errores robusto

### OptimizedImage.tsx

```typescript
interface OptimizedImageProps {
  imageName?: string | null    // Nombre del archivo de imagen
  alt: string                  // Texto alternativo
  className?: string           // Clases CSS
  fallback?: React.ReactNode   // Componente fallback
  onLoad?: () => void         // Callback al cargar
  onError?: () => void        // Callback de error
}
```

**Características:**
- ✅ Loading skeleton automático
- ✅ Fallback personalizable
- ✅ Lazy loading nativo
- ✅ Estados de error manejados
- ✅ Transiciones suaves

## Integración en Componentes

### Posts con Imágenes

```tsx
// Antes (problemático)
<img src={post.imageUrl} alt={post.title} />

// Después (optimizado)
<OptimizedImage
  imageName={post.imageName}
  alt={post.postTitle}
  className="w-full h-48"
  fallback={
    <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
      Sin imagen disponible
    </div>
  }
/>
```

### Perfiles de Usuario

```tsx
<OptimizedImage
  imageName={user.profileImage}
  alt={user.name}
  className="w-8 h-8 rounded-full"
  fallback={
    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white">
      {user.name[0].toUpperCase()}
    </div>
  }
/>
```

## Componentes Actualizados

### ✅ PostDetail.tsx
- Imagen principal del post con OptimizedImage
- Fallback con emoji por defecto
- Badge de categoría superpuesto

### ✅ PostCard.tsx  
- Imágenes de posts con loading states
- Fallback null (sin mostrar si no hay imagen)

### ✅ PostCardGrid.tsx
- Grid de posts con imágenes optimizadas
- Efectos hover preservados
- Fallback con emoji de fiesta

### ✅ SavedEventsPage.tsx
- Lista de posts guardados
- Imágenes de perfil y posts
- Fallbacks personalizados por contexto

## Flujo de Carga de Imágenes

```mermaid
graph TD
    A[Componente con imageName] --> B[OptimizedImage]
    B --> C[imageService.getImageUrl]
    C --> D{¿imageName válido?}
    D -->|No| E[Mostrar fallback]
    D -->|Sí| F[Construir URL completa]
    F --> G[https://vivemedellin-backend.onrender.com/api/posts/images/{imageName}]
    G --> H{¿Carga exitosa?}
    H -->|No| I[Mostrar fallback de error]
    H -->|Sí| J[Mostrar imagen con transición]
```

## Configuración de URLs

### Desarrollo vs Producción

```typescript
// imageService.ts - Auto-detecta entorno
const API_BASE_URL = "https://vivemedellin-backend.onrender.com/api"

// Siempre usa la URL de producción para consistencia
getImageUrl: (imageName: string) => {
  return `${API_BASE_URL}/posts/images/${imageName}`
}
```

### Tipos de URLs Soportadas

```typescript
// ✅ Nombres de archivo (desde backend)
"b99fa5ca-c8e6-43a5-a68b-a687bc46aef5.webp"

// ✅ URLs completas (legacy)  
"https://vivemedellin-backend.onrender.com/api/posts/images/image.jpg"

// ✅ URLs externas
"https://external-site.com/image.png"

// ❌ URLs localhost (corregidas automáticamente)
"http://localhost:8081/api/posts/images/image.jpg"
```

## Validaciones y Límites

### Tipos de Archivo Permitidos
- ✅ JPEG (.jpg, .jpeg)
- ✅ PNG (.png)  
- ✅ WebP (.webp)

### Límites de Tamaño
- 📏 Máximo: **10MB** por imagen
- ⚡ Compresión automática recomendada en frontend

### Validación de Archivos

```typescript
const validation = imageService.validateImageFile(file)
if (!validation.isValid) {
  console.error(validation.error)
  // Mostrar error al usuario
}
```

## Optimizaciones de Performance

### Loading States
- 🔄 Skeleton loading durante carga
- ⚡ Transiciones opacity suaves  
- 🎯 Lazy loading nativo del navegador

### Cache y Optimización
- 📦 Cache automático del navegador
- 🔄 Reutilización de URLs construidas
- 📱 Responsive images con CSS

### Error Handling
- 🛡️ Fallbacks siempre disponibles
- 🔍 Logs detallados para debugging
- 🔄 Retry automático en algunos casos

## Subida de Imágenes

### Flujo de Upload

```typescript
// 1. Validar archivo
const validation = imageService.validateImageFile(file)

// 2. Subir al servidor  
const updatedPost = await imageService.uploadImage(postId, file)

// 3. Actualizar estado local
setPost(updatedPost)
```

### Componente de Upload (Futuro)

```tsx
<ImageUploader
  postId={post.id}
  onUpload={(updatedPost) => setPost(updatedPost)}
  maxSize={5 * 1024 * 1024} // 5MB
  allowedTypes={['image/jpeg', 'image/png', 'image/webp']}
/>
```

## Troubleshooting

### Problemas Comunes

1. **Imagen no carga**
   ```typescript
   // Debug: Verificar URL generada
   console.log('URL imagen:', imageService.getImageUrl(imageName))
   ```

2. **Mixed Content Error**
   ```typescript  
   // ✅ Solucionado: Siempre usa HTTPS en producción
   // El imageService maneja esto automáticamente
   ```

3. **Imagen muy lenta**
   ```typescript
   // Agregar timeout o compression
   // Considerar múltiples tamaños/CDN
   ```

### Debug Mode

```typescript
// Activar logs detallados
const DEBUG_IMAGES = process.env.NODE_ENV === 'development'

if (DEBUG_IMAGES) {
  console.log('🖼️ Cargando imagen:', imageName)
  console.log('🔗 URL construida:', finalUrl)
}
```
