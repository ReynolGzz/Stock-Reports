import { ConditionEvaluator, EvalResult, Condition, MarketSnapshot, TradeSetup } from '../types'

export class AvoidChaseEvaluator implements ConditionEvaluator {
  type = 'fomo_chase'

  evaluate(_condition: Condition, snapshot: MarketSnapshot, setup: TradeSetup): EvalResult {
    const price = snapshot.price
    const limit = setup.maxChasePrice ?? setup.entryZoneMax

    if (limit == null) {
      return { passed: false, reason: 'No chase limit defined' }
    }

    const extended = price > limit
    const pctAbove = ((price - limit) / limit) * 100

    if (extended) {
      return {
        passed: true,
        reason: `AVOID: Price $${price} is ${pctAbove.toFixed(2)}% above max chase price $${limit}. Do NOT chase.`,
        confidence: Math.min(1.0, pctAbove / 5),
      }
    }

    return {
      passed: false,
      reason: `Price $${price} is within acceptable range (chase limit $${limit})`,
    }
  }
}
