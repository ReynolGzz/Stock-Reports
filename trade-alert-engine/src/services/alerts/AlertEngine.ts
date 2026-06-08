import { prisma } from '../../lib/prisma'
import { logger } from '../../lib/logger'
import { EngineResult } from '../conditions/types'
import { TradeSetup } from '@prisma/client'
import { sendTelegramMessage } from './channels/TelegramChannel'
import {
  buildEntryAlertMessage,
  buildAvoidAlertMessage,
  buildTarget1AlertMessage,
  buildTarget2AlertMessage,
  buildStopAlertMessage,
} from './templates/AlertTemplates'

export class AlertEngine {
  async process(
    setup: TradeSetup,
    result: EngineResult,
    snapshotId: string,
    currentPrice: number
  ): Promise<void> {
    if (result.stopHit) {
      await this.fireAlert(setup, 'stop_hit', buildStopAlertMessage(setup, currentPrice), result.explanation, snapshotId)
      await prisma.tradeSetup.update({ where: { id: setup.id }, data: { status: 'stopped' } })
      return
    }
    if (result.targetHit === 2) {
      await this.fireAlert(setup, 'target_2_reached', buildTarget2AlertMessage(setup, currentPrice), result.explanation, snapshotId)
      await prisma.tradeSetup.update({ where: { id: setup.id }, data: { status: 'completed' } })
      return
    }
    if (result.targetHit === 1) {
      await this.fireAlert(setup, 'target_1_reached', buildTarget1AlertMessage(setup, currentPrice), result.explanation, snapshotId)
      return
    }
    if (result.shouldAvoid) {
      const avoidReason = result.avoidResults.filter((r) => r.result.passed).map((r) => r.result.reason).join('; ')
      await this.fireAlert(setup, 'avoid_triggered', buildAvoidAlertMessage(setup, currentPrice, avoidReason), result.explanation, snapshotId)
      return
    }
    if (result.shouldAlert) {
      await this.fireAlert(setup, 'entry_triggered', buildEntryAlertMessage(setup, currentPrice, result.explanation), result.explanation, snapshotId)
      await prisma.tradeSetup.update({ where: { id: setup.id }, data: { status: 'triggered', triggeredAt: new Date() } })
    }
  }

  private async fireAlert(
    setup: TradeSetup, event: string, message: string,
    explanation: string, snapshotId: string
  ): Promise<void> {
    const rule = await prisma.alertRule.findFirst({ where: { setupId: setup.id, event } })
    if (rule) {
      const cooldownMs = rule.cooldownHours * 60 * 60 * 1000
      if (rule.lastFiredAt && Date.now() - rule.lastFiredAt.getTime() < cooldownMs) {
        logger.info('Alert suppressed (cooldown active)', { ticker: setup.ticker, event })
        await this.persistAlert(setup.id, rule.id, event, message, explanation, snapshotId, 'suppressed')
        return
      }
    }
    const sent = await sendTelegramMessage(message)
    const status = sent ? 'sent' : 'failed'
    await this.persistAlert(setup.id, rule?.id, event, message, explanation, snapshotId, status)
    if (rule) await prisma.alertRule.update({ where: { id: rule.id }, data: { lastFiredAt: new Date() } })
    logger.info('Alert fired', { ticker: setup.ticker, event, status })
  }

  private async persistAlert(
    setupId: string, ruleId: string | undefined, event: string,
    message: string, explanation: string, snapshotId: string, status: string
  ): Promise<void> {
    await prisma.alert.create({
      data: { setupId, ruleId, event, message, explanation, channel: 'telegram', status, snapshotId },
    })
  }
}
