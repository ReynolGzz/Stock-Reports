import express from 'express'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import { config } from '../lib/config'
import { errorHandler, notFound } from './middleware/errorHandler'
import setupsRouter from './routes/setups'
import alertsRouter from './routes/alerts'
import marketRouter from './routes/market'
import settingsRouter from './routes/settings'

export function createServer(): express.Application {
  const app = express()
  app.use(cors())
  app.use(express.json({ limit: '2mb' }))
  const limiter = rateLimit({
    windowMs: config.RATE_LIMIT_WINDOW_MS,
    max: config.RATE_LIMIT_MAX,
    standardHeaders: true,
    legacyHeaders: false,
  })
  app.use('/api/setups/ingest', limiter)
  app.use('/api/setups', setupsRouter)
  app.use('/api/alerts', alertsRouter)
  app.use('/api/market', marketRouter)
  app.use('/api/settings', settingsRouter)
  app.get('/api/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }))
  app.use(notFound)
  app.use(errorHandler)
  return app
}
