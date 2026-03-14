import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

// SERVICE ROLE key — bypasses RLS, full DB access. NEVER expose to frontend.
export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
