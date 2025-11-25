/**
 * Utilidades para crear y manejar URLs amigables (slugs)
 * Convierte títulos de posts en URLs SEO-friendly
 */

/**
 * Crear un slug a partir de un texto
 * Ejemplo: "Guns N' Roses in Medellín" → "guns-n-roses-in-medellin"
 */
export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD') // Separar caracteres con acentos
    .replace(/[\u0300-\u036f]/g, '') // Eliminar diacríticos
    .replace(/[^a-z0-9\s-]/g, '') // Solo letras, números, espacios y guiones
    .trim()
    .replace(/\s+/g, '-') // Espacios → guiones
    .replace(/-+/g, '-') // Múltiples guiones → uno solo
}

/**
 * Crear URL de post usando ID y título
 * Ejemplo: createPostUrl(123, "Bad Bunny Concert") → "/post/bad-bunny-concert-123"
 */
export function createPostUrl(postId: number, postTitle: string): string {
  const slug = createSlug(postTitle)
  return `/post/${slug}-${postId}`
}

/**
 * Extraer ID del post desde una URL slug
 * Ejemplo: "bad-bunny-concert-123" → 123
 */
export function extractIdFromSlug(slug: string): number | null {
  const match = slug.match(/-(\d+)$/)
  return match ? parseInt(match[1], 10) : null
}

/**
 * Obtener URL completa del post (alias para createPostUrl)
 */
export function getPostUrl(postId: number, postTitle: string): string {
  return createPostUrl(postId, postTitle)
}

/**
 * Obtener objeto con datos del slug
 */
export function getPostUrlFromPost(post: { id: number; postTitle: string }): string {
  return createPostUrl(post.id, post.postTitle)
}
