import { ConditionEvaluator, EvalResult, Condition, MarketSnapshot, TradeSetup } from '../types'

export class EntryZoneEvaluator implements ConditionEvaluator {
  type = 'entry_zone'

  evaluate(_condition: Condition, snapshot: MarketSnapshot, setup: TradeSetup): EvalResult {
    const { entryZoneMin, entryZoneMax } = setup
    const price = snapshot.price

    if (entryZoneMin == null || entryZoneMax == null) {
      return { passed: false, reason: 'Entry zone not defined in setup' }
    }

    const passed = price >= entryZoneMin && price <= entryZoneMax
    const reason = passed
      ? `Price $${price} is inside entry zone $${entryZoneMin}–$${entryZoneMax}`
      : price < entryZoneMin
      ? `Price $${price} is below entry zone (min $${entryZoneMin}) — not yet in zone`
      : `Price $${price} is above entry zone (max $${entryZoneMax}) — extended`

    return { passed, reason, confidence: passed ? 1.0 : 0.0 }
  }
}
