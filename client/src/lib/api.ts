import { supabase } from './supabase'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

async function apiFetch(path: string, options: RequestInit = {}) {
  const { data: { session } } = await supabase.auth.getSession()
  const token = session?.access_token

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers
    }
  })

  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export const api = {
  get: (path: string) => apiFetch(path),
  post: (path: string, body: any) => apiFetch(path, { method: 'POST', body: JSON.stringify(body) }),
  patch: (path: string, body: any) => apiFetch(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (path: string) => apiFetch(path, { method: 'DELETE' }),
}
