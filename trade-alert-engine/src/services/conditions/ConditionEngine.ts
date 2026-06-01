import { prisma } from '../../lib/prisma'
import { logger } from '../../lib/logger'
import { EngineResult, EvalResult } from './types'
import { getEvaluator } from './evaluators'
import { TradeSetup, Condition, AvoidCondition, MarketSnapshot } from '@prisma/client'

type SetupWithRelations = TradeSetup & {
  conditions: Condition[]
  avoidConditions: AvoidCondition[]
}

export class ConditionEngine {
  async evaluate(
    setup: SetupWithRelations,
    snapshot: MarketSnapshot
  ): Promise<EngineResult> {
    const conditionResults: Array<{ conditionId: string; result: EvalResult }> = []
    const avoidResults: Array<{ conditionId: string; result: EvalResult }> = []

    let shouldAvoid = false
    for (const avoid of setup.avoidConditions) {
      const evaluator = getEvaluator(avoid.type) ?? getEvaluator('fomo_chase')
      if (!evaluator) continue
      const result = evaluator.evaluate(avoid as any, snapshot, setup)
      avoidResults.push({ conditionId: avoid.id, result })
      if (result.passed) {
        shouldAvoid = true
        await prisma.avoidCondition.update({
          where: { id: avoid.id },
          data: { active: true, triggeredAt: new Date() },
        })
      }
    }

    const stopEvaluator = getEvaluator('stop_hit')
    let stopHit = false
    if (stopEvaluator && setup.stopLoss) {
      const fakeCondition = { id: 'stop', type: 'stop_hit', description: '' } as Condition
      const stopResult = stopEvaluator.evaluate(fakeCondition, snapshot, setup)
      stopHit = stopResult.passed
    }

    const targetEvaluator = getEvaluator('target_reached')
    let targetHit: 1 | 2 | null = null
    if (targetEvaluator && (setup.target1 || setup.target2)) {
      const fakeCondition = { id: 'target', type: 'target_reached', description: '' } as Condition
      const targetResult = targetEvaluator.evaluate(fakeCondition, snapshot, setup)
      if (targetResult.passed) {
        targetHit = (targetResult.data?.targetHit as 1 | 2) ?? 1
      }
    }

    let allRequiredMet = true
    for (const condition of setup.conditions) {
      const evaluator = getEvaluator(condition.type) ?? getEvaluator('entry_zone')
      if (!evaluator) {
        logger.warn(`No evaluator for condition type: ${condition.type}, skipping`)
        continue
      }
      const result = evaluator.evaluate(condition, snapshot, setup)
      conditionResults.push({ conditionId: condition.id, result })
      if (condition.required && !result.passed) allRequiredMet = false
      if (condition.required && result.passed && !condition.met) {
        await prisma.condition.update({
          where: { id: condition.id },
          data: { met: true, metAt: new Date(), metReason: result.reason },
        })
      }
    }

    const shouldAlert = allRequiredMet && !shouldAvoid && !stopHit && setup.conditions.length > 0
    const explanation = this.buildExplanation(conditionResults, avoidResults, shouldAlert, shouldAvoid, stopHit, targetHit)
    return { shouldAlert, shouldAvoid, stopHit, targetHit, conditionResults, avoidResults, explanation }
  }

  private buildExplanation(
    conditionResults: Array<{ conditionId: string; result: EvalResult }>,
    avoidResults: Array<{ conditionId: string; result: EvalResult }>,
    shouldAlert: boolean,
    shouldAvoid: boolean,
    stopHit: boolean,
    targetHit: 1 | 2 | null
  ): string {
    const parts: string[] = []
    if (stopHit) parts.push('STOP LOSS HIT')
    if (targetHit) parts.push(`TARGET ${targetHit} REACHED`)
    if (shouldAvoid) {
      const avoidReasons = avoidResults.filter((r) => r.result.passed).map((r) => r.result.reason)
      parts.push(`AVOID: ${avoidReasons.join('; ')}`)
    }
    const metConditions = conditionResults.filter((r) => r.result.passed).map((r) => `+ ${r.result.reason}`)
    const failedConditions = conditionResults.filter((r) => !r.result.passed).map((r) => `- ${r.result.reason}`)
    parts.push(...metConditions, ...failedConditions)
    return parts.join('\n')
  }
}
