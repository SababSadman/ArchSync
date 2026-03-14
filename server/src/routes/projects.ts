import { Router } from 'express'
const router = Router()

router.get('/test', (req, res) => {
  res.json({ route: 'projects' })
})

export default router
