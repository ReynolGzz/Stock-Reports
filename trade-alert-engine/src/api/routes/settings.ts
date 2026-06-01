import { Router, Request, Response, NextFunction } from 'express'
import { prisma } from '../../lib/prisma'

const router = Router()

router.post('/telegram', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { chatId, botToken } = req.body
    if (!chatId) { res.status(400).json({ error: 'chatId is required' }); return }
    const existing = await prisma.notificationChannel.findFirst({ where: { type: 'telegram' } })
    const config = { chatId, ...(botToken && { botToken }) }
    if (existing) {
      await prisma.notificationChannel.update({ where: { id: existing.id }, data: { config, active: true } })
    } else {
      await prisma.notificationChannel.create({ data: { type: 'telegram', config } })
    }
    res.json({ message: 'Telegram configuration saved' })
  } catch (err) { next(err) }
})

router.get('/channels', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const channels = await prisma.notificationChannel.findMany()
    const masked = channels.map((c) => ({
      ...c,
      config: maskConfig(c.config as Record<string, unknown>),
    }))
    res.json(masked)
  } catch (err) { next(err) }
})

function maskConfig(config: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(config)) {
    if (key === 'chatId' && typeof value === 'string') result[key] = value.slice(0, 4) + '***'
    else if (key === 'botToken') result[key] = '***'
    else result[key] = value
  }
  return result
}

export default router
