import { ConditionEvaluator, EvalResult, Condition, MarketSnapshot, TradeSetup } from '../types'

export class BreakoutEvaluator implements ConditionEvaluator {
  type = 'breakout'

  evaluate(_condition: Condition, snapshot: MarketSnapshot, setup: TradeSetup): EvalResult {
    const price = snapshot.price
    const resistance = setup.entryZoneMin ?? setup.entryZoneMax

    if (resistance == null) {
      return { passed: false, reason: 'No resistance level defined for breakout evaluation' }
    }

    const breakoutBuffer = resistance * 0.005
    const passed = price >= resistance + breakoutBuffer

    if (passed) {
      const pctAbove = ((price - resistance) / resistance) * 100
      return {
        passed: true,
        reason: `Breakout confirmed. Price $${price} is ${pctAbove.toFixed(2)}% above resistance $${resistance}`,
        confidence: Math.min(1.0, pctAbove / 3),
      }
    }

    return {
      passed: false,
      reason: `No breakout yet. Price $${price} has not crossed resistance $${resistance}`,
    }
  }
}
