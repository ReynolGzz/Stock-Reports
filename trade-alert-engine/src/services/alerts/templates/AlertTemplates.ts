import { TradeSetup } from '@prisma/client'

const DISCLAIMER = '\n\n⚠️ Educational use only. Not financial advice.'

export function buildEntryAlertMessage(setup: TradeSetup, price: number, explanation: string): string {
  const zone = setup.entryZoneMin && setup.entryZoneMax
    ? `$${setup.entryZoneMin}–$${setup.entryZoneMax}`
    : 'N/A'
  return [
    `🟢 ENTRY ALERT — ${setup.ticker}`,
    ``,
    `Strategy: ${setup.strategyType.replace(/_/g, ' ').toUpperCase()}`,
    `📍 Current price: $${price}`,
    `🎯 Entry zone: ${zone}`,
    setup.stopLoss ? `🛑 Stop loss: $${setup.stopLoss}` : '',
    setup.target1 ? `✅ Target 1: $${setup.target1}` : '',
    setup.target2 ? `✅ Target 2: $${setup.target2}` : '',
    setup.holdWindowDays ? `📅 Hold window: ${setup.holdWindowDays} days` : '',
    ``,
    `Why triggered:`,
    explanation,
    DISCLAIMER,
  ].filter(Boolean).join('\n')
}

export function buildAvoidAlertMessage(setup: TradeSetup, price: number, reason: string): string {
  return [
    `🔴 AVOID ALERT — ${setup.ticker}`,
    ``,
    `Price is above chase limit. Do NOT chase.`,
    ``,
    `📍 Current price: $${price}`,
    setup.maxChasePrice ? `🚫 Max entry: $${setup.maxChasePrice}` : '',
    setup.entryZoneMax ? `📊 Entry zone max: $${setup.entryZoneMax}` : '',
    ``,
    reason,
    ``,
    `Wait for pullback before considering entry.`,
    DISCLAIMER,
  ].filter(Boolean).join('\n')
}

export function buildTarget1AlertMessage(setup: TradeSetup, price: number): string {
  return [
    `🎯 TARGET 1 REACHED — ${setup.ticker}`,
    ``,
    `Conservative profit target hit.`,
    ``,
    `📍 Price: $${price}`,
    `🎯 Target 1: $${setup.target1} ✅`,
    setup.target2 ? `Next target: $${setup.target2}` : '',
    ``,
    `Consider partial exit per your plan.`,
    DISCLAIMER,
  ].filter(Boolean).join('\n')
}

export function buildTarget2AlertMessage(setup: TradeSetup, price: number): string {
  return [
    `🏆 TARGET 2 REACHED — ${setup.ticker}`,
    ``,
    `Full profit target achieved.`,
    ``,
    `📍 Price: $${price}`,
    `🎯 Target 2: $${setup.target2} ✅`,
    ``,
    `Consider full exit per your plan.`,
    DISCLAIMER,
  ].filter(Boolean).join('\n')
}

export function buildStopAlertMessage(setup: TradeSetup, price: number): string {
  return [
    `⛔ STOP HIT — ${setup.ticker}`,
    ``,
    `Price has reached stop loss level.`,
    ``,
    `📍 Price: $${price}`,
    `🛑 Stop loss: $${setup.stopLoss}`,
    ``,
    `Review your position and risk management plan.`,
    DISCLAIMER,
  ].filter(Boolean).join('\n')
}
