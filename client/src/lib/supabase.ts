import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Guard against undefined env vars crashing the app
if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'your_url_here') {
  console.warn('[ArchSync] Supabase env vars not configured — running in demo mode')
}

export const supabase = supabaseUrl && supabaseAnonKey && supabaseUrl !== 'your_url_here'
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://placeholder.supabase.co', 'placeholder-key')
