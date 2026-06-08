import { ConditionEvaluator, EvalResult, Condition, MarketSnapshot, TradeSetup } from '../types'

export class SupportHoldEvaluator implements ConditionEvaluator {
  type = 'support_hold'

  evaluate(_condition: Condition, snapshot: MarketSnapshot, setup: TradeSetup): EvalResult {
    const price = snapshot.price
    const support = setup.stopLoss ?? setup.entryZoneMin

    if (support == null) {
      return { passed: false, reason: 'No support level defined (check stopLoss or entryZoneMin)' }
    }

    const buffer = support * 0.01
    const passed = price > support + buffer

    if (passed) {
      const pctAbove = ((price - support) / support) * 100
      return {
        passed: true,
        reason: `Support holding. Price $${price} is ${pctAbove.toFixed(2)}% above support $${support}`,
        confidence: Math.min(1.0, pctAbove / 5),
      }
    }

    return {
      passed: false,
      reason: `Support at risk. Price $${price} is near or below support level $${support}`,
    }
  }
}
