import { ConditionEvaluator, EvalResult, Condition, MarketSnapshot, TradeSetup } from '../types'

export class PullbackEvaluator implements ConditionEvaluator {
  type = 'pullback'

  evaluate(_condition: Condition, snapshot: MarketSnapshot, setup: TradeSetup): EvalResult {
    const price = snapshot.price
    const { entryZoneMax, entryZoneMin, stopLoss } = setup

    if (entryZoneMax != null && entryZoneMin != null) {
      if (price <= entryZoneMax && price >= (stopLoss ?? 0)) {
        const pctFromMax = ((entryZoneMax - price) / entryZoneMax) * 100
        return {
          passed: true,
          reason: `Pullback confirmed. Price $${price} is ${pctFromMax.toFixed(1)}% below resistance zone max $${entryZoneMax}`,
          confidence: Math.min(1.0, pctFromMax / 5),
        }
      }
      return {
        passed: false,
        reason: `No pullback detected. Price $${price} not in pullback range (entry zone: $${entryZoneMin}–$${entryZoneMax})`,
      }
    }

    if (snapshot.changePercent != null && snapshot.changePercent < -1) {
      return {
        passed: true,
        reason: `Intraday pullback detected: price down ${Math.abs(snapshot.changePercent).toFixed(2)}%`,
        confidence: Math.min(1.0, Math.abs(snapshot.changePercent) / 5),
      }
    }

    return { passed: false, reason: `No significant pullback detected for ${snapshot.ticker}` }
  }
}
