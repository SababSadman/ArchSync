import { Router } from 'express'
const router = Router()

// AI Smart Naming Suggestion
router.post('/suggest-name', (req, res) => {
  const { originalName, phase, projectType, projectName } = req.body
  
  if (!originalName || !phase) {
    return res.status(400).json({ error: 'Missing required parameters' })
  }

  const extension = originalName.split('.').pop()
  const timestamp = new Date().toISOString().split('T')[0].replace(/-/g, '')
  
  // Clean project name and phase for filename
  const cleanProject = (projectName || 'PROJECT').toUpperCase().replace(/\s+/g, '_')
  const cleanPhase = phase.toUpperCase().replace(/\s+/g, '_')
  const cleanType = (projectType || 'DOC').toUpperCase().replace(/\s+/g, '_')

  // Standard Format: [PHASE]_[PROJECT]_[TYPE]_[DATE].[EXT]
  const suggestedName = `${cleanPhase}_${cleanProject}_${cleanType}_${timestamp}.${extension}`

  res.json({ 
    suggestedName,
    reasoning: `Standardized format for ${phase} phase across ${projectName}.`
  })
})

router.get('/status', (req, res) => {
  res.json({ message: 'AI features active' })
})

export default router