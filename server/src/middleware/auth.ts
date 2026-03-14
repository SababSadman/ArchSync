import { Request, Response, NextFunction } from 'express'
import { supabaseAdmin } from '../lib/supabase.js'

export interface AuthRequest extends Request {
  user?: any
  userId?: string
}

export const requireAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'No token provided' })

  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
  if (error || !user) return res.status(401).json({ error: 'Invalid or expired token' })

  req.user = user
  req.userId = user.id
  next()
}
