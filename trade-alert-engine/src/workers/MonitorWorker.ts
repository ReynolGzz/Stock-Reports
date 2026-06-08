import cron from 'node-cron'
import { prisma } from '../lib/prisma'
import { logger } from '../lib/logger'
import { MarketDataService } from '../services/market/MarketDataService'
import { ConditionEngine } from '../services/conditions/ConditionEngine'
import { AlertEngine } from '../services/alerts/AlertEngine'

const marketData = new MarketDataService()
const conditionEngine = new ConditionEngine()
const alertEngine = new AlertEngine()

export async function checkAllSetups(): Promise<void> {
  const isOpen = await marketData.isMarketOpen()
  if (!isOpen) {
    logger.debug('Market closed — skipping monitor cycle')
    return
  }
  const setups = await prisma.tradeSetup.findMany({
    where: { status: 'active' },
    include: { conditions: true, avoidConditions: true },
  })
  if (setups.length === 0) { logger.debug('No active setups to check'); return }
  logger.info('Starting monitor cycle', { setupCount: setups.length })
  for (const setup of setups) {
    try {
      const quote = await marketData.getQuote(setup.ticker)
      const snapshotId = await marketData.saveSnapshot(setup.id, setup.ticker, quote)
      const snap = await prisma.marketSnapshot.findUnique({ where: { id: snapshotId } })
      if (!snap) throw new Error('Snapshot not saved')
      const result = await conditionEngine.evaluate(setup, snap)
      await alertEngine.process(setup, result, snapshotId, quote.price)
      await prisma.tradeSetup.update({ where: { id: setup.id }, data: { lastCheckedAt: new Date() } })
      logger.debug('Setup checked', { ticker: setup.ticker, price: quote.price, shouldAlert: result.shouldAlert })
    } catch (err) {
      logger.error('Error checking setup', { setupId: setup.id, ticker: setup.ticker, error: (err as Error).message })
    }
  }
  logger.info('Monitor cycle complete', { setupCount: setups.length })
}

export function startWorker(): void {
  cron.schedule('*/5 * * * 1-5', async () => {
    try { await checkAllSetups() } catch (err) {
      logger.error('Monitor worker error', { error: (err as Error).message })
    }
  })
  logger.info('Monitor worker started — polling every 5 minutes on weekdays')
}
