Act as a Senior Engineer and design de following HTML:
SYSTEM DESIGN CONSISTENCY LAYER — MANDATORY

This design system is FIXED and must remain visually consistent across ALL future reports generated from this prompt.

Do NOT redesign the UI each time.

The report must follow a reusable institutional dashboard design language with consistent colors, shapes, spacing, component styling, typography, and layout.

Unless explicitly instructed otherwise, preserve the SAME design system across all reports.

The HTML report must use the same visual design language as the CRM · Swing Trade Risk Report reference. The output must feel like the same Reymen Analytics product analyzing a different stock, not a different website design every time.

────────────────────────────
FIXED VISUAL IDENTITY
────────────────────────────

Brand:
Reymen · Analytics

Style:

* Institutional / hedge-fund dashboard
* Premium dark aesthetic
* Professional, analytical, disciplined
* Avoid flashy retail-trader styling
* No neon overload
* No gaming UI
* No redesign experimentation
* No different UI styles between reports

The report must preserve the same:

* dark background
* sticky navigation
* section dividers
* page spacing
* dashboard cards
* KPI strips
* stock header
* risk gauge
* SVG chart style
* metric cards
* score breakdown bars
* quarterly tables
* prediction panel
* verdict card
* watchlist cards
* footer / disclaimer style
* clipboard export button
* toast notification

────────────────────────────
FIXED COLOR TOKENS
────────────────────────────

Use these exact CSS variables:

:root{
--bg:#08090d;
--bg1:#0c0e18;
--bg2:#10131e;
--bg3:#141828;

--card:#0f1220;
--card2:#131726;

--bdr:rgba(255,255,255,.065);
--bdr2:rgba(255,255,255,.03);

--green:#00e5a0;
--gd:rgba(0,229,160,.10);
--gd2:rgba(0,229,160,.18);

--red:#ff4060;
--rd:rgba(255,64,96,.10);
--rd2:rgba(255,64,96,.18);

--amb:#ffb830;
--ad:rgba(255,184,48,.10);
--ad2:rgba(255,184,48,.18);

--blu:#3d8ef8;
--bd:rgba(61,142,248,.10);
--bd2:rgba(61,142,248,.18);

--pur:#9b6fff;
--pd:rgba(155,111,255,.10);

--txt:#dde2ee;
--muted:#5a6175;
--dim:#8892a4;
--sub:#2d3448;

--mono:'JetBrains Mono',monospace;
--sans:'DM Sans',sans-serif;
}

Do not replace this palette.
Do not introduce a new color system unless explicitly requested.
Use subtle glow only. Never excessive.

────────────────────────────
FIXED TYPOGRAPHY
────────────────────────────

Use:

* Body font: DM Sans
* Metrics / data / labels: JetBrains Mono

Typography hierarchy must match the CRM reference:

* uppercase mono section labels
* compact KPI labels
* bold white metric values
* muted supporting copy
* green positive values
* amber caution values
* red risk values
* blue secondary highlights
* purple catalyst highlights

────────────────────────────
FIXED COMPONENT LANGUAGE
────────────────────────────

Use the same component classes and visual language as the CRM report whenever possible.

Required component patterns:

* .nav
* .nav-brand
* .pulse
* .nav-links
* .nl
* .page
* .pdiv
* .pdiv-pill
* .slbl
* .xbar
* .btn
* .btnp
* .card
* .hero
* .kpi4
* .two
* .three
* .chk-card
* .chk-list
* .flow-card
* .avoid-card
* .tgt-card
* .final
* .stkh
* .ticker
* .price-big
* .rating-pill
* .gauge-row
* .gauge-card
* .risk-side
* .mini6
* .kpi8
* .chart-card
* .mgrid
* .mcard
* .score-card
* .earn-snap
* .twrap
* .dual
* .cat-card
* .pred-card
* .verdict-card
* .wl4
* .wcard
* .toast

Maintain the same:

* border radius
* card padding
* shadows
* glow level
* border opacity
* spacing scale
* icon sizing
* section spacing
* grid proportions
* chart style
* gauge design
* label styling
* table styling
* footer styling
* card density
* page breathing room

Do not invent new card styles, components, or visual systems unless explicitly requested.

────────────────────────────
FIXED LAYOUT STRUCTURE
────────────────────────────

The report must preserve the same 3-page visual architecture:

PAGE 1:
High Probability Swing Framework

PAGE 2:
Primary Stock Risk Score Dashboard

PAGE 3:
Deep Analysis, Prediction & Verdict

Use the same page divider style between pages:

* PAGE 02 · STOCK ANALYSIS
* PAGE 03 · EARNINGS, PREDICTION & VERDICT

Keep the section hierarchy visually consistent.

────────────────────────────
FIXED CHARTS & GAUGES
────────────────────────────

SVG price chart must preserve:

* dark chart background
* green price line
* subtle gradient fill
* same line thickness
* same marker style
* same annotation style
* same chart proportions

Risk gauge must preserve:

* same arc style
* same sizing
* same typography
* same score placement
* same color logic

Prediction cards must preserve:

* same rounded geometry
* same subtle glow
* same visual structure
* same mini forecast curve / progress styling

────────────────────────────
RESPONSIVE BEHAVIOR & ANIMATION
────────────────────────────

Responsive layout is required, but it must preserve the same design language.

Animation must be minimal only.

Allowed:

* subtle hover
* soft transitions
* restrained glow
* toast copied notification

Avoid:

* flashy animation
* heavy motion
* distracting effects

────────────────────────────
MAIN REPORT REQUEST
────────────────────────────

Build a premium 3-page dark HTML risk score report for one stock that could qualify as a strong buy candidate for a short-term swing trade lasting several days.

Before generating the HTML, perform a full analysis using the latest available web data.

Use trusted sources only. Yahoo Finance must be one source, but not the only source.

Also use other reputable sources such as:

* Company investor relations
* SEC filings when relevant
* Reuters
* MarketWatch
* Nasdaq
* CNBC
* TradingView or another reputable market data provider when useful
* Other reliable financial data providers

The report must focus deeply on ONE primary stock and include 3–4 additional stocks as a secondary watchlist, but at least one of these additional stocks should be low risk.

For the primary stock, include:

* current entry price
* ideal entry zone
* approximate timing of when to buy
* stop-loss zone
* conservative profit target zone
* risk/reward logic
* whether the stock should be bought now, only partially, or only after a pullback / consolidation

The entire report must follow the FIXED DESIGN SYSTEM defined above.

Never redesign the UI unless explicitly requested.

────────────────────────────
TRADING PHILOSOPHY
────────────────────────────

This report is NOT about maximum profit or moonshot trades.

Prioritize WIN RATE over oversized profit.

We are NOT looking for:

* +20–50% moonshots
* gambling
* lottery trades
* emotional entries
* FOMO buying

We ARE looking for:

* repeatable setups
* professional execution
* high-probability swing trades
* controlled downside
* consistency over excitement

Target profile:

* 55–65% win rate
* +3–7% average repeatable gain
* controlled downside
* conservative profit targets
* A+ setups only

Tone:
Professional, disciplined, analytical.
Avoid hype, retail trading language, and unrealistic expectations.

────────────────────────────
PAGE 1 — HIGH WIN RATE SWING TRADING FRAMEWORK
────────────────────────────

Create the first page section titled:

"High Probability Swing Framework"

This page must establish the trading framework before showing the stock analysis.

Section 1: WIN RATE PHILOSOPHY HERO

Create a large premium hero card.

Title:
"Consistency Beats Home Runs"

Subtitle:
"We prioritize repeatable +3–7% gains over chasing oversized profits."

Include a KPI metrics strip with:

* Target Win Rate: 55–65%
* Average Gain Goal: +3–7%
* Risk Style: Controlled / High Probability
* Trading Style: Swing Trading

Visual style:
Premium dashboard / institutional.

Section 2: A+ SETUP CHECKLIST

Create a premium checklist card.

Title:
"A+ Setup Requirements"

Subtitle:
"Only A+ setups qualify."

Checklist:
✓ Uptrend / bullish trend
✓ Clear catalyst
✓ Strong sector momentum
✓ No FOMO entries
✓ Pullback or consolidation entry
✓ Logical stop placement

Use green check icons.

Add this caption:
"If multiple criteria are missing, the trade is likely lower probability."

Section 3: PULLBACK IN UPTREND FRAMEWORK

Create a professional visual flow / step card.

Title:
"Preferred Entry Model"

Display the following process:

1. Strong stock
2. Corrects / pulls back
3. Finds support
4. Resumes trend

Add this explanation:
"We favor pullbacks inside confirmed uptrends rather than chasing vertical price action."

Section 4: AVOID LOW QUALITY TRADES

Create red warning cards.

Title:
"What We Avoid"

Do NOT trade:
✗ Falling knives
✗ "It looks cheap"
✗ Unconfirmed turnarounds
✗ Emotional / FOMO buying
✗ Weak sectors

Use red styling.

Add this caution text:
"Low quality entries reduce win rate and increase emotional decision making."

Section 5: CONSERVATIVE PROFIT TARGETS

Create a dedicated profit management card.

Title:
"Profit Management"

Explain:
"We use conservative profit expectations."

Target framework:

* +3–5%: High probability / repeatable
* +5–7%: Strong swing outcome
* 10%+: Bonus, not expectation

Add this emphasis:
"We prefer repeatable outcomes over maximizing every trade."

Use green and amber progress bars.

Section 6: FINAL VERDICT PANEL

Create a bottom institutional-style panel.

Title:
"System Objective"

Main statement:
"The goal is not to predict every winner. The goal is to operate a repeatable framework capable of producing 55–65% win rate with +3–7% average gains."

Add a final rating bar:
WIN RATE FOCUS: HIGH

────────────────────────────
PAGE 2 — PRIMARY STOCK RISK SCORE DASHBOARD
────────────────────────────

After completing the analysis, select ONE primary stock that best fits the high-probability swing framework.

Page 2 must include:

1. Stock Bar

Include:

* Ticker
* Company name
* Current price
* Day range
* Market cap
* P/E ratio or valuation metric
* Trade bias
* Current entry recommendation

2. Risk Gauge

Create a visual 0–100 risk/opportunity gauge.

Include:

* Overall risk score
* Rating label
* Interpretation of the score

3. KPI Strip

Include:

* Risk score
* Entry now recommendation
* Ideal buy zone
* Stop-loss zone
* Profit target zone
* Hold window

4. 12-Month SVG Price Chart

Create an inline SVG 12-month price chart.

Requirements:

* Dark chart background
* Green price line
* Subtle gradient fill
* Annotated markers for major events:

  * Earnings beat / miss
  * Major guidance update
  * Catalyst event
  * Recent breakout or pullback area

5. Six-Card Fundamental Grid

Create six premium cards covering:

* Valuation
* Financial Health
* Revenue Growth
* Earnings Quality
* Sector / Momentum
* Execution Risk

Use:

* Green for beats / strengths
* Red for misses / risks
* Amber for caution areas

6. Score Breakdown Bars

Use 35 / 35 / 30 weighting:

* Catalyst & Momentum: 35%
* Financial Quality: 35%
* Entry / Risk Control: 30%

Show:

* Score per category
* Progress bars
* Total score out of 100
* Final label such as:
  "Strong Buy Watchlist"
  "A+ Setup if Pullback Holds"
  or similar disciplined wording

────────────────────────────
PAGE 3 — DEEP ANALYSIS, PREDICTION & VERDICT
────────────────────────────

Page 3 must include:

1. Quarterly Trend Table

Include recent quarterly data such as:

* Revenue
* EPS
* Gross margin or operating margin
* Net income / free cash flow when relevant
* YoY growth
* Trend signal
* Swing trading interpretation

2. Latest Earnings / Delivery Update

Summarize:

* Most recent earnings
* Revenue beat / miss
* EPS beat / miss
* Guidance
* Management commentary
* Key product, delivery, AI, cloud, consumer, infrastructure, or sector-specific catalyst
* Why this matters for a short-term swing trade

3. Price Prediction Cards

Add a visual price prediction section similar to a premium mobile stock forecast card.

Use real data and trusted sources.

Include predictions for:

* 1 week
* 1 month
* 6 months
* 12 months

Each prediction card must show:

* Current price
* Predicted price
* Expected percentage upside / downside
* Timeframe
* Smooth green SVG curve or progress visual
* Dark rounded card design
* Subtle green glow

Important:
The prediction must not be presented as guaranteed.

It must be framed as a base-case scenario derived from:

* analyst targets
* company fundamentals
* guidance
* valuation
* sector momentum
* recent price action

Use Yahoo Finance as one of the reference sources for analyst data or stock data, but also cross-check with at least one or more trusted sources such as:

* Company investor relations
* Reuters
* MarketWatch
* Nasdaq
* CNBC
* SEC filings
* TradingView or another reputable market data provider when useful

4. Catalysts vs Risks Dual Column

Create two institutional-style columns.

Catalysts:

* Clear upcoming or recent catalysts
* Sector momentum
* Earnings / guidance strength
* Analyst revisions
* Product cycle or demand drivers
* Technical momentum

Risks:

* Valuation risk
* Earnings fade risk
* Macro risk
* Sector rotation risk
* Weak guidance risk
* Overextended chart risk
* Stop-loss invalidation risk

5. Secondary Watchlist

Add 3–4 additional stocks.

For each include:

* Ticker
* Setup type
* Approximate when to buy
* Ideal entry condition
* Main catalyst
* Risk level

This section should be secondary. The main analysis must remain focused on the primary stock.

6. Bottom Line & Verdict

Create a final institutional-style verdict panel.

Include:

* Final rating bar
* Final score
* Buy / wait / partial entry recommendation
* Ideal entry zone
* Stop-loss zone
* Conservative profit target zone
* Expected hold window
* Clear statement on whether this is an A+ setup now or only if it pulls back / consolidates

Use disciplined language.

Example tone:
"This is a strong buy watchlist candidate, but not a blind chase. The highest-probability entry is a pullback into support or consolidation above key levels, with a defined stop and conservative +3–7% target."

────────────────────────────
DATA & SOURCE REQUIREMENTS
────────────────────────────

Use latest available web data.

Use Yahoo Finance as one source, but not the only source.

Only use trusted sources.

Cite or list the sources used inside the HTML footer or source section.

Sources should include, where available:

* Yahoo Finance
* Company Investor Relations
* Reuters
* MarketWatch
* Nasdaq
* CNBC
* SEC filings
* Other reputable financial data providers

Clearly state:

* Data snapshot date
* Current price used
* Whether price is live, delayed, or taken from latest available quote
* That the report is educational and not financial advice

────────────────────────────
OUTPUT REQUIREMENTS
────────────────────────────

Generate a complete standalone HTML file.

The HTML must include:

* inline CSS
* responsive layout
* clipboard export button
* toast copied notification
* sticky navigation
* inline SVG graphics
* no external JavaScript libraries
* Google Fonts allowed only for DM Sans and JetBrains Mono
* clean semantic structure
* premium dark dashboard design matching the CRM reference report

Do not generate a PDF.
Do not generate a slide deck.
Do not use placeholder stock data.
Do not use fake sources.
Do not present predictions as guaranteed.
