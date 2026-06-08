import axios from 'axios'
import { MarketDataProvider, Quote, OHLC } from '../types'
import { logger } from '../../../lib/logger'

const BASE_URL = 'https://finnhub.io/api/v1'

export class FinnhubAdapter implements MarketDataProvider {
  readonly name = 'finnhub'

  constructor(private apiKey: string) {}

  async getQuote(ticker: string): Promise<Quote> {
    logger.debug('Fetching Finnhub quote', { ticker })
    const { data } = await axios.get(`${BASE_URL}/quote`, {
      params: { symbol: ticker, token: this.apiKey },
      timeout: 10000,
    })
    if (!data.c) throw new Error(`Finnhub: no data for ${ticker}`)
    const changePercent = data.pc > 0 ? ((data.c - data.pc) / data.pc) * 100 : 0
    return {
      ticker,
      price: data.c,
      open: data.o,
      high: data.h,
      low: data.l,
      volume: 0,
      changePercent,
      timestamp: new Date(data.t * 1000),
    }
  }

  async getIntraday(ticker: string): Promise<OHLC[]> {
    const to = Math.floor(Date.now() / 1000)
    const from = to - 24 * 60 * 60
    const { data } = await axios.get(`${BASE_URL}/stock/candle`, {
      params: { symbol: ticker, resolution: '5', from, to, token: this.apiKey },
      timeout: 10000,
    })
    if (data.s !== 'ok' || !data.t) return []
    return data.t.map((ts: number, i: number) => ({
      timestamp: new Date(ts * 1000),
      open: data.o[i],
      high: data.h[i],
      low: data.l[i],
      close: data.c[i],
      volume: data.v[i],
    }))
  }

  async isMarketOpen(): Promise<boolean> {
    const { data } = await axios.get(`${BASE_URL}/stock/market-status`, {
      params: { exchange: 'US', token: this.apiKey },
      timeout: 5000,
    })
    return data.isOpen === true
  }
}
