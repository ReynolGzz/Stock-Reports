import { ConditionEvaluator } from '../types'
import { EntryZoneEvaluator } from './EntryZoneEvaluator'
import { PullbackEvaluator } from './PullbackEvaluator'
import { BreakoutEvaluator } from './BreakoutEvaluator'
import { SupportHoldEvaluator } from './SupportHoldEvaluator'
import { AvoidChaseEvaluator } from './AvoidChaseEvaluator'
import { TargetEvaluator } from './TargetEvaluator'
import { StopEvaluator } from './StopEvaluator'

const evaluators: ConditionEvaluator[] = [
  new EntryZoneEvaluator(),
  new PullbackEvaluator(),
  new BreakoutEvaluator(),
  new SupportHoldEvaluator(),
  new AvoidChaseEvaluator(),
  new TargetEvaluator(),
  new StopEvaluator(),
]

export const EVALUATOR_REGISTRY: Record<string, ConditionEvaluator> = Object.fromEntries(
  evaluators.map((e) => [e.type, e])
)

export function getEvaluator(type: string): ConditionEvaluator | undefined {
  return EVALUATOR_REGISTRY[type]
}
