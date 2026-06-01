import TelegramBot from 'node-telegram-bot-api'
import { config } from '../../../lib/config'
import { logger } from '../../../lib/logger'

let bot: TelegramBot | null = null

function getBot(): TelegramBot | null {
  if (!config.TELEGRAM_BOT_TOKEN) {
    logger.warn('TELEGRAM_BOT_TOKEN not configured — Telegram alerts disabled')
    return null
  }
  if (!bot) bot = new TelegramBot(config.TELEGRAM_BOT_TOKEN)
  return bot
}

export async function sendTelegramMessage(message: string): Promise<boolean> {
  const telegramBot = getBot()
  if (!telegramBot || !config.TELEGRAM_CHAT_ID) {
    logger.warn('Telegram not configured, logging alert to console instead')
    logger.info('ALERT (no Telegram):\n' + message)
    return false
  }
  try {
    await telegramBot.sendMessage(config.TELEGRAM_CHAT_ID, message, { parse_mode: 'Markdown' })
    logger.info('Telegram alert sent', { chatId: config.TELEGRAM_CHAT_ID })
    return true
  } catch (err) {
    logger.error('Failed to send Telegram message', { error: (err as Error).message })
    return false
  }
}
