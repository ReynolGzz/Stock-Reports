export interface Quote {
  ticker: string
  price: number
  open: number
  high: number
  low: number
  volume: number
  changePercent: number
  timestamp: Date
}

export interface OHLC {
  timestamp: Date
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface MarketDataProvider {
  readonly name: string
  getQuote(ticker: string): Promise<Quote>
  getIntraday(ticker: string): Promise<OHLC[]>
  isMarketOpen(): Promise<boolean>
}
