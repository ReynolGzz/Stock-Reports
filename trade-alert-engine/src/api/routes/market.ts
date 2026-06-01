import { Router, Request, Response, NextFunction } from 'express'
import { MarketDataService } from '../../services/market/MarketDataService'

const router = Router()
const marketData = new MarketDataService()

router.get('/:ticker', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ticker = req.params.ticker.toUpperCase()
    const quote = await marketData.getQuote(ticker)
    const isOpen = await marketData.isMarketOpen()
    res.json({ ...quote, marketOpen: isOpen })
  } catch (err) { next(err) }
})

export default router
