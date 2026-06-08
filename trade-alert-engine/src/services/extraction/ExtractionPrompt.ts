export const SYSTEM_PROMPT = `You are a quantitative trade thesis interpreter for a swing-trading copilot system.

Your task: analyze a stock report and extract a precise, structured trade thesis as JSON.

Rules:
- Extract ONLY what the report explicitly states. Do NOT infer or hallucinate.
- If a value is not stated, use null.
- Numbers must be exact (e.g., 205.00 not "around 205").
- Strategy types: pullback | breakout | consolidation | retest | momentum | post_earnings | custom
- Entry modes: buy_now | partial_now | wait_for_condition | no_trade
- Bias: bullish | neutral | bearish
- For conditions, classify each into a known type or use "custom".
- Be conservative: an unclear instruction is better left as "custom" with the verbatim description.
- Do NOT hallucinate prices, stop levels, or targets not explicitly mentioned.`

export const JSON_SCHEMA = `{
  "ticker": "string — stock symbol",
  "companyName": "string | null",
  "strategyType": "pullback | breakout | consolidation | retest | momentum | post_earnings | custom",
  "bias": "bullish | neutral | bearish",
  "entryMode": "buy_now | partial_now | wait_for_condition | no_trade",
  "entryZoneMin": "number | null",
  "entryZoneMax": "number | null",
  "maxChasePrice": "number | null — max price to consider entry, avoid above this",
  "stopLoss": "number | null",
  "target1": "number | null",
  "target2": "number | null",
  "holdWindowDays": "number | null",
  "conditions": [
    {
      "type": "pullback | breakout | entry_zone | support_hold | volume_confirmation | momentum | timing | custom",
      "description": "verbatim or paraphrased condition from report",
      "required": true,
      "params": {}
    }
  ],
  "avoidConditions": [
    {
      "type": "fomo_chase | extended | gap_up | weak_sector | poor_rr | high_volatility | thesis_break | custom",
      "description": "verbatim or paraphrased avoid instruction"
    }
  ],
  "alertRules": [
    {
      "event": "entry_triggered | avoid_triggered | target_1_reached | target_2_reached | stop_hit",
      "messageTemplate": "short alert message template"
    }
  ]
}`

export function buildUserPrompt(reportText: string): string {
  return `Analyze this swing-trade report and return a valid JSON trade thesis.

REPORT CONTENT:
${reportText}

Return ONLY valid JSON matching this schema exactly. No markdown, no explanation, no code fences.

SCHEMA:
${JSON_SCHEMA}`
}
