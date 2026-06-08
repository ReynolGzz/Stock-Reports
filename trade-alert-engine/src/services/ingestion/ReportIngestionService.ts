import axios from 'axios'
import { prisma } from '../../lib/prisma'
import { TextExtractor } from './TextExtractor'
import { logger } from '../../lib/logger'

const extractor = new TextExtractor()

export class ReportIngestionService {
  async ingestFromUrl(url: string): Promise<{ reportFileId: string; cleanText: string }> {
    logger.info('Fetching report from URL', { url })
    const response = await axios.get<string>(url, {
      timeout: 15000,
      headers: { 'User-Agent': 'ReymenTradeIntelligence/1.0' },
    })
    const rawContent = response.data
    return this.persist('url', rawContent, url)
  }

  async ingestFromText(text: string): Promise<{ reportFileId: string; cleanText: string }> {
    logger.info('Ingesting pasted report text')
    return this.persist('paste', text, undefined)
  }

  private async persist(
    source: string,
    rawContent: string,
    sourceUrl?: string
  ): Promise<{ reportFileId: string; cleanText: string }> {
    const cleanText = extractor.extract(rawContent)
    const reportFile = await prisma.reportFile.create({
      data: { source, sourceUrl, rawContent },
    })
    logger.info('Report file persisted', { reportFileId: reportFile.id, source })
    return { reportFileId: reportFile.id, cleanText }
  }
}
