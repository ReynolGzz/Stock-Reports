import { MarketDataProvider, Quote, OHLC } from './types'
import { prisma } from '../../lib/prisma'
import { logger } from '../../lib/logger'
import { config } from '../../lib/config'
import { PolygonAdapter } from './adapters/PolygonAdapter'
import { FinnhubAdapter } from './adapters/FinnhubAdapter'

export class MarketDataService {
  private providers: MarketDataProvider[]

  constructor() {
    this.providers = []
    if (config.POLYGON_API_KEY) this.providers.push(new PolygonAdapter(config.POLYGON_API_KEY))
    if (config.FINNHUB_API_KEY) this.providers.push(new FinnhubAdapter(config.FINNHUB_API_KEY))
    if (this.providers.length === 0) {
      logger.warn('No market data providers configured. Set POLYGON_API_KEY or FINNHUB_API_KEY.')
    }
  }

  async getQuote(ticker: string): Promise<Quote> {
    for (const provider of this.providers) {
      try {
        const quote = await provider.getQuote(ticker)
        logger.debug('Quote fetched', { ticker, provider: provider.name, price: quote.price })
        return quote
      } catch (err) {
        logger.warn(`Provider ${provider.name} failed for ${ticker}`, { error: (err as Error).message })
      }
    }
    throw new Error(`All market data providers failed for ${ticker}`)
  }

  async getIntraday(ticker: string): Promise<OHLC[]> {
    for (const provider of this.providers) {
      try { return await provider.getIntraday(ticker) } catch { continue }
    }
    return []
  }

  async isMarketOpen(): Promise<boolean> {
    for (const provider of this.providers) {
      try { return await provider.isMarketOpen() } catch { continue }
    }
    return this.isWithinMarketHours()
  }

  async saveSnapshot(setupId: string, ticker: string, quote: Quote): Promise<string> {
    const snap = await prisma.marketSnapshot.create({
      data: {
        setupId, ticker,
        price: quote.price, open: quote.open, high: quote.high, low: quote.low,
        volume: quote.volume, changePercent: quote.changePercent,
        provider: this.providers[0]?.name ?? 'unknown',
      },
    })
    return snap.id
  }

  private isWithinMarketHours(): boolean {
    const now = new Date()
    const etOffset = -5 * 60
    const etNow = new Date(now.getTime() + etOffset * 60 * 1000)
    const day = etNow.getUTCDay()
    const hours = etNow.getUTCHours()
    const minutes = etNow.getUTCMinutes()
    const timeInMinutes = hours * 60 + minutes
    if (day === 0 || day === 6) return false
    return timeInMinutes >= 9 * 60 + 30 && timeInMinutes < 16 * 60
  }
}
