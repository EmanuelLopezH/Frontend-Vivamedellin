const API_BASE = 'https://vivemedellin-backend.onrender.com'

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = API_BASE + (path.startsWith('/') ? path : '/' + path)
  const token = localStorage.getItem('token')
  
  console.debug('[apiRequest]', options.method || 'GET', url)
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  try {
    const response = await fetch(url, { ...options, headers })
    const data = await response.json()
    
    if (!response.ok) {
      console.error('[apiRequest] Error response:', data)
      throw new Error(data.message || `HTTP error! status: ${response.status}`)
    }
    
    return data
  } catch (error) {
    console.error('[apiRequest] Fetch error:', error)
    throw error
  }
}