import 'dotenv/config'
import { createServer } from './api/server'
import { startWorker } from './workers/MonitorWorker'
import { config } from './lib/config'
import { logger } from './lib/logger'
import { prisma } from './lib/prisma'

async function main(): Promise<void> {
  await prisma.$connect()
  logger.info('Database connected')
  const app = createServer()
  const server = app.listen(config.PORT, () => {
    logger.info(`API server running on port ${config.PORT}`, { env: config.NODE_ENV })
  })
  startWorker()
  const shutdown = async (signal: string) => {
    logger.info(`Received ${signal}, shutting down gracefully`)
    server.close(async () => {
      await prisma.$disconnect()
      logger.info('Shutdown complete')
      process.exit(0)
    })
  }
  process.on('SIGTERM', () => shutdown('SIGTERM'))
  process.on('SIGINT', () => shutdown('SIGINT'))
}

main().catch((err) => {
  console.error('Fatal startup error:', err)
  process.exit(1)
})
