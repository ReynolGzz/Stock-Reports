import { Router, Request, Response, NextFunction } from 'express'
import { prisma } from '../../lib/prisma'
import { ReportIngestionService } from '../../services/ingestion/ReportIngestionService'
import { ExtractionService } from '../../services/extraction/ExtractionService'
import { MarketDataService } from '../../services/market/MarketDataService'
import { ConditionEngine } from '../../services/conditions/ConditionEngine'
import { AlertEngine } from '../../services/alerts/AlertEngine'
import { logger } from '../../lib/logger'

const router = Router()
const ingestion = new ReportIngestionService()
const extraction = new ExtractionService()
const marketData = new MarketDataService()
const conditionEngine = new ConditionEngine()
const alertEngine = new AlertEngine()

router.post('/ingest', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { url, text } = req.body
    if (!url && !text) { res.status(400).json({ error: 'Provide either url or text in request body' }); return }
    const { reportFileId, cleanText } = url
      ? await ingestion.ingestFromUrl(url)
      : await ingestion.ingestFromText(text)
    const thesis = await extraction.extract(cleanText)
    const setup = await prisma.tradeSetup.create({
      data: {
        reportFileId,
        ticker: thesis.ticker,
        companyName: thesis.companyName,
        strategyType: thesis.strategyType,
        bias: thesis.bias,
        entryMode: thesis.entryMode,
        entryZoneMin: thesis.entryZoneMin,
        entryZoneMax: thesis.entryZoneMax,
        maxChasePrice: thesis.maxChasePrice,
        stopLoss: thesis.stopLoss,
        target1: thesis.target1,
        target2: thesis.target2,
        holdWindowDays: thesis.holdWindowDays,
        rawThesisJson: thesis as object,
        conditions: {
          create: thesis.conditions.map((c) => ({
            type: c.type, description: c.description,
            required: c.required ?? true, params: c.params as object,
          })),
        },
        avoidConditions: {
          create: thesis.avoidConditions.map((a) => ({ type: a.type, description: a.description })),
        },
        alertRules: {
          create: thesis.alertRules.map((r) => ({ event: r.event, messageTemplate: r.messageTemplate })),
        },
      },
      include: { conditions: true, avoidConditions: true, alertRules: true },
    })
    logger.info('Setup created', { setupId: setup.id, ticker: setup.ticker })
    res.status(201).json({ setupId: setup.id, ticker: setup.ticker, thesis })
  } catch (err) { next(err) }
})

router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const setups = await prisma.tradeSetup.findMany({
      orderBy: { createdAt: 'desc' },
      include: { conditions: true, avoidConditions: true, _count: { select: { alerts: true } } },
    })
    res.json(setups)
  } catch (err) { next(err) }
})

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const setup = await prisma.tradeSetup.findUnique({
      where: { id: req.params.id },
      include: {
        conditions: true, avoidConditions: true, alertRules: true,
        alerts: { orderBy: { sentAt: 'desc' }, take: 20 },
        snapshots: { orderBy: { capturedAt: 'desc' }, take: 1 },
      },
    })
    if (!setup) { res.status(404).json({ error: 'Setup not found' }); return }
    res.json(setup)
  } catch (err) { next(err) }
})

router.post('/:id/check', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const setup = await prisma.tradeSetup.findUnique({
      where: { id: req.params.id },
      include: { conditions: true, avoidConditions: true },
    })
    if (!setup) { res.status(404).json({ error: 'Setup not found' }); return }
    const quote = await marketData.getQuote(setup.ticker)
    const snapshotId = await marketData.saveSnapshot(setup.id, setup.ticker, quote)
    const snap = await prisma.marketSnapshot.findUnique({ where: { id: snapshotId } })
    if (!snap) throw new Error('Snapshot not saved')
    const result = await conditionEngine.evaluate(setup, snap)
    await alertEngine.process(setup, result, snapshotId, quote.price)
    await prisma.tradeSetup.update({ where: { id: setup.id }, data: { lastCheckedAt: new Date() } })
    res.json({ price: quote.price, result })
  } catch (err) { next(err) }
})

router.put('/:id/status', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = req.body
    const allowed = ['active', 'cancelled', 'completed']
    if (!allowed.includes(status)) { res.status(400).json({ error: `Status must be one of: ${allowed.join(', ')}` }); return }
    const updated = await prisma.tradeSetup.update({ where: { id: req.params.id }, data: { status } })
    res.json(updated)
  } catch (err) { next(err) }
})

export default router
