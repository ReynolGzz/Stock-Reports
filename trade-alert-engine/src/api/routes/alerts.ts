import { Router, Request, Response, NextFunction } from 'express'
import { prisma } from '../../lib/prisma'

const router = Router()

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = Number(req.query.page ?? 1)
    const limit = Number(req.query.limit ?? 20)
    const skip = (page - 1) * limit
    const [alerts, total] = await Promise.all([
      prisma.alert.findMany({
        skip, take: limit, orderBy: { sentAt: 'desc' },
        include: { setup: { select: { ticker: true, strategyType: true } } },
      }),
      prisma.alert.count(),
    ])
    res.json({ alerts, total, page, limit })
  } catch (err) { next(err) }
})

router.get('/:setupId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const alerts = await prisma.alert.findMany({
      where: { setupId: req.params.setupId },
      orderBy: { sentAt: 'desc' },
    })
    res.json(alerts)
  } catch (err) { next(err) }
})

export default router
