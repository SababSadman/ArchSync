import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import authRoutes from './routes/auth'
import projectRoutes from './routes/projects'
import fileRoutes from './routes/files'
import commentRoutes from './routes/comments'
import taskRoutes from './routes/tasks'
import clientRoutes from './routes/clients'
import aiRoutes from './routes/ai'

dotenv.config()

const app = express()

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/auth', authRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/files', fileRoutes)
app.use('/api/comments', commentRoutes)
app.use('/api/tasks', taskRoutes)
app.use('/api/clients', clientRoutes)
app.use('/api/ai', aiRoutes)

app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }))

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).json({ error: err.message || 'Internal server error' })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Express running on port ${PORT}`))
