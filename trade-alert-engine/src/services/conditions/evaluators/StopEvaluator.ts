import { ConditionEvaluator, EvalResult, Condition, MarketSnapshot, TradeSetup } from '../types'

export class StopEvaluator implements ConditionEvaluator {
  type = 'stop_hit'

  evaluate(_condition: Condition, snapshot: MarketSnapshot, setup: TradeSetup): EvalResult {
    const price = snapshot.price
    const stop = setup.stopLoss

    if (stop == null) {
      return { passed: false, reason: 'No stop loss defined' }
    }

    const passed = price <= stop
    if (passed) {
      const pctBelow = ((stop - price) / stop) * 100
      return {
        passed: true,
        reason: `STOP HIT. Price $${price} at or below stop loss $${stop} (${pctBelow.toFixed(2)}% below stop)`,
        confidence: 1.0,
      }
    }

    const pctAbove = ((price - stop) / stop) * 100
    return {
      passed: false,
      reason: `Stop intact. Price $${price} is ${pctAbove.toFixed(2)}% above stop $${stop}`,
    }
  }
}
