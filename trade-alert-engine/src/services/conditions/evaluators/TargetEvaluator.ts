import { ConditionEvaluator, EvalResult, Condition, MarketSnapshot, TradeSetup } from '../types'

export class TargetEvaluator implements ConditionEvaluator {
  type = 'target_reached'

  evaluate(_condition: Condition, snapshot: MarketSnapshot, setup: TradeSetup): EvalResult {
    const price = snapshot.price

    if (setup.target2 != null && price >= setup.target2) {
      return {
        passed: true,
        reason: `Target 2 reached. Price $${price} >= T2 $${setup.target2}`,
        confidence: 1.0,
        data: { targetHit: 2 },
      }
    }

    if (setup.target1 != null && price >= setup.target1) {
      return {
        passed: true,
        reason: `Target 1 reached. Price $${price} >= T1 $${setup.target1}. Consider partial exit.`,
        confidence: 1.0,
        data: { targetHit: 1 },
      }
    }

    const nextTarget = setup.target1 ?? setup.target2
    const remaining = nextTarget != null ? ((nextTarget - price) / price * 100).toFixed(2) : 'N/A'
    return {
      passed: false,
      reason: `No target reached yet. Price $${price}. ${nextTarget != null ? `T1 $${setup.target1} is ${remaining}% away` : 'No targets defined'}`,
    }
  }
}
