import axios from 'axios'
import { MarketDataProvider, Quote, OHLC } from '../types'
import { logger } from '../../../lib/logger'

const BASE_URL = 'https://api.polygon.io'

export class PolygonAdapter implements MarketDataProvider {
  readonly name = 'polygon'

  constructor(private apiKey: string) {}

  async getQuote(ticker: string): Promise<Quote> {
    const snapshotUrl = `${BASE_URL}/v2/snapshot/locale/us/markets/stocks/tickers/${ticker}?apiKey=${this.apiKey}`
    logger.debug('Fetching Polygon snapshot', { ticker })
    const { data } = await axios.get(snapshotUrl, { timeout: 10000 })
    const snap = data.ticker
    if (!snap) throw new Error(`Polygon: no data for ${ticker}`)
    return {
      ticker,
      price: snap.day?.c ?? snap.prevDay?.c ?? 0,
      open: snap.day?.o ?? 0,
      high: snap.day?.h ?? 0,
      low: snap.day?.l ?? 0,
      volume: snap.day?.v ?? 0,
      changePercent: snap.todaysChangePerc ?? 0,
      timestamp: new Date(),
    }
  }

  async getIntraday(ticker: string): Promise<OHLC[]> {
    const today = new Date().toISOString().split('T')[0]
    const url = `${BASE_URL}/v2/aggs/ticker/${ticker}/range/5/minute/${today}/${today}?adjusted=true&sort=asc&apiKey=${this.apiKey}`
    const { data } = await axios.get(url, { timeout: 10000 })
    if (!data.results) return []
    return data.results.map((bar: any) => ({
      timestamp: new Date(bar.t),
      open: bar.o,
      high: bar.h,
      low: bar.l,
      close: bar.c,
      volume: bar.v,
    }))
  }

  async isMarketOpen(): Promise<boolean> {
    const url = `${BASE_URL}/v1/marketstatus/now?apiKey=${this.apiKey}`
    const { data } = await axios.get(url, { timeout: 5000 })
    return data.market === 'open'
  }
}
