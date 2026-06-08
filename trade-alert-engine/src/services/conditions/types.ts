import { Condition, AvoidCondition, TradeSetup, MarketSnapshot } from '@prisma/client'

export type { Condition, AvoidCondition, TradeSetup, MarketSnapshot }

export interface EvalResult {
  passed: boolean
  reason: string
  confidence?: number
  data?: Record<string, unknown>
}

export interface ConditionEvaluator {
  type: string
  evaluate(
    condition: Condition,
    snapshot: MarketSnapshot,
    setup: TradeSetup
  ): EvalResult
}

export interface AvoidEvaluator {
  type: string
  evaluate(
    avoidCondition: AvoidCondition,
    snapshot: MarketSnapshot,
    setup: TradeSetup
  ): EvalResult
}

export interface EngineResult {
  shouldAlert: boolean
  shouldAvoid: boolean
  stopHit: boolean
  targetHit: 1 | 2 | null
  conditionResults: Array<{ conditionId: string; result: EvalResult }>
  avoidResults: Array<{ conditionId: string; result: EvalResult }>
  explanation: string
}
