import { Router } from 'express'
const router = Router()

router.get('/status', (req, res) => {
  res.json({ message: 'AI features coming soon' })
})

export default router