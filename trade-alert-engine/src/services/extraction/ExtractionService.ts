import Anthropic from '@anthropic-ai/sdk'
import { config } from '../../lib/config'
import { logger } from '../../lib/logger'
import { SYSTEM_PROMPT, buildUserPrompt } from './ExtractionPrompt'
import { validateThesis, parseRawJson, ValidatedThesis } from './ThesisValidator'

const FAST_MODEL = 'claude-haiku-4-5-20251001'
const FALLBACK_MODEL = 'claude-opus-4-8'

export class ExtractionService {
  private client: Anthropic

  constructor() {
    this.client = new Anthropic({ apiKey: config.ANTHROPIC_API_KEY })
  }

  async extract(reportText: string): Promise<ValidatedThesis> {
    logger.info('Starting thesis extraction', { textLength: reportText.length })

    const result = await this.attemptExtraction(reportText, FAST_MODEL)
    if (result.valid && result.thesis) {
      logger.info('Extraction successful with fast model', { ticker: result.thesis.ticker })
      return result.thesis
    }

    logger.warn('Fast model extraction failed, retrying with fallback', { errors: result.errors })
    const fallbackResult = await this.attemptExtraction(reportText, FALLBACK_MODEL, result.errors)

    if (!fallbackResult.valid || !fallbackResult.thesis) {
      const errorMsg = `Extraction failed after retry: ${fallbackResult.errors?.join('; ')}`
      logger.error(errorMsg)
      throw new Error(errorMsg)
    }

    logger.info('Extraction successful with fallback model', { ticker: fallbackResult.thesis.ticker })
    return fallbackResult.thesis
  }

  private async attemptExtraction(
    reportText: string,
    model: string,
    previousErrors?: string[]
  ): Promise<ReturnType<typeof validateThesis>> {
    const userPrompt = previousErrors?.length
      ? `${buildUserPrompt(reportText)}\n\nPrevious attempt failed with errors:\n${previousErrors.join('\n')}\nFix these issues in your response.`
      : buildUserPrompt(reportText)

    const response = await this.client.messages.create({
      model,
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
    })

    const content = response.content[0]
    if (content.type !== 'text') {
      return { valid: false, errors: ['Unexpected response type from Claude'] }
    }

    try {
      const raw = parseRawJson(content.text)
      return validateThesis(raw)
    } catch (err) {
      return { valid: false, errors: [`JSON parse error: ${(err as Error).message}`] }
    }
  }
}
