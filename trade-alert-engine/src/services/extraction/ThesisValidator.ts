import { z } from 'zod'

const STRATEGY_TYPES = [
  'pullback', 'breakout', 'consolidation', 'retest',
  'momentum', 'post_earnings', 'custom',
] as const

const CONDITION_TYPES = [
  'pullback', 'breakout', 'entry_zone', 'support_hold',
  'volume_confirmation', 'momentum', 'timing', 'custom',
] as const

const AVOID_TYPES = [
  'fomo_chase', 'extended', 'gap_up', 'weak_sector',
  'poor_rr', 'high_volatility', 'thesis_break', 'custom',
] as const

const ALERT_EVENTS = [
  'entry_triggered', 'avoid_triggered', 'target_1_reached',
  'target_2_reached', 'stop_hit',
] as const

export const ThesisSchema = z.object({
  ticker: z.string().min(1).max(10).toUpperCase(),
  companyName: z.string().nullable().optional(),
  strategyType: z.enum(STRATEGY_TYPES),
  bias: z.enum(['bullish', 'neutral', 'bearish']),
  entryMode: z.enum(['buy_now', 'partial_now', 'wait_for_condition', 'no_trade']),
  entryZoneMin: z.number().positive().nullable().optional(),
  entryZoneMax: z.number().positive().nullable().optional(),
  maxChasePrice: z.number().positive().nullable().optional(),
  stopLoss: z.number().positive().nullable().optional(),
  target1: z.number().positive().nullable().optional(),
  target2: z.number().positive().nullable().optional(),
  holdWindowDays: z.number().int().positive().nullable().optional(),
  conditions: z.array(
    z.object({
      type: z.enum(CONDITION_TYPES),
      description: z.string().min(1),
      required: z.boolean().default(true),
      params: z.record(z.unknown()).optional(),
    })
  ).default([]),
  avoidConditions: z.array(
    z.object({
      type: z.enum(AVOID_TYPES),
      description: z.string().min(1),
    })
  ).default([]),
  alertRules: z.array(
    z.object({
      event: z.enum(ALERT_EVENTS),
      messageTemplate: z.string().min(1),
    })
  ).default([]),
})

export type ValidatedThesis = z.infer<typeof ThesisSchema>

export interface ValidationResult {
  valid: boolean
  thesis?: ValidatedThesis
  errors?: string[]
}

export function validateThesis(raw: unknown): ValidationResult {
  const result = ThesisSchema.safeParse(raw)

  if (!result.success) {
    const errors = result.error.issues.map(
      (issue) => `${issue.path.join('.')}: ${issue.message}`
    )
    return { valid: false, errors }
  }

  const thesis = result.data
  const numericErrors: string[] = []

  if (thesis.stopLoss && thesis.entryZoneMin && thesis.stopLoss >= thesis.entryZoneMin) {
    numericErrors.push(`stopLoss (${thesis.stopLoss}) must be below entryZoneMin (${thesis.entryZoneMin})`)
  }
  if (thesis.target1 && thesis.entryZoneMax && thesis.target1 <= thesis.entryZoneMax) {
    numericErrors.push(`target1 (${thesis.target1}) must be above entryZoneMax (${thesis.entryZoneMax})`)
  }
  if (thesis.entryZoneMin && thesis.entryZoneMax && thesis.entryZoneMin >= thesis.entryZoneMax) {
    numericErrors.push(`entryZoneMin must be less than entryZoneMax`)
  }

  if (numericErrors.length > 0) {
    return { valid: false, errors: numericErrors }
  }

  return { valid: true, thesis }
}

export function parseRawJson(text: string): unknown {
  const cleaned = text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim()
  return JSON.parse(cleaned)
}
