import { apiRequest } from "./apiClient"

export interface User {
  id: number
  username: string
  name: string
  role: string
  roles?: string[]
}

function normalizeUser(obj: any): User | null {
  if (!obj || typeof obj !== 'object') return null
  if (typeof obj.username === 'string' && typeof obj.name === 'string') {
    return {
      id: typeof obj.id === 'number' ? obj.id : Number(obj.id) || 0,
      username: obj.username,
      name: obj.name,
      role: obj.role || (obj.roles?.includes('ROLE_ADMIN') ? 'ROLE_ADMIN' : 'ROLE_USER'),
      roles: Array.isArray(obj.roles) ? obj.roles : [obj.role || 'ROLE_USER']
    }
  }
  return null
}

interface LoginResponse {
  token: string;
  id: number;
  username: string;
  name: string;
  role: string;
  roles: string[];
}

export async function login(username: string, password: string): Promise<User> {
  const res = await apiRequest<LoginResponse>('/api/users/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })

  console.debug('[authService] login response:', res)

  if (!res.token) {
    throw new Error('Authentication token missing in login response')
  }

  const user = normalizeUser(res)
  if (!user) {
    throw new Error('User data missing in login response')
  }

  localStorage.setItem('token', res.token)
  localStorage.setItem('user', JSON.stringify(user))

  return user
}

export function getCurrentUser(): User | null {
  const s = localStorage.getItem('user')
  try {
    return s ? JSON.parse(s) : null
  } catch {
    return null
  }
}

export async function logout(): Promise<void> {
  try {
    await apiRequest('/api/users/logout', { method: 'POST' })
  } catch {
    /* ignore */
  }
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

export function isCurrentUserAdmin(): boolean {
  const u = getCurrentUser()
  return !!u && (u.role === 'ROLE_ADMIN' || u.roles?.includes('ROLE_ADMIN'))
}

export function canDeleteComment(commentAuthorName: string): boolean {
  const u = getCurrentUser()
  if (!u) return false
  if (u.role === 'ROLE_ADMIN' || u.roles?.includes('ROLE_ADMIN')) return true
  return u.name === commentAuthorName
}