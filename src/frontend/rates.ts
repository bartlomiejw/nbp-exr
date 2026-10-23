import type { Rate } from '@/shared/types'

/**
 * NBP publishes table C rates per single unit, but for some currencies the
 * customary quotation (also used on nbp.pl) is per 100 or 10 000 units.
 */
export const CURRENCY_UNITS: Readonly<Record<string, number>> = {
  HUF: 100,
  JPY: 100,
  ISK: 100,
  CLP: 100,
  INR: 100,
  KRW: 100,
  IDR: 10000,
}

export interface RateRow extends Rate {
  units: number
}

export function unitsFor(code: string): number {
  return CURRENCY_UNITS[code.toUpperCase()] ?? 1
}

/** Converts a per-unit rate to the quotation unit, avoiding floating point noise. */
export function scaleRate(value: number, units: number): number {
  return Math.round(value * units * 1e6) / 1e6
}

/**
 * Keeps only the selected currencies (in NBP publication order) and scales
 * the rates to their quotation unit. An empty selection shows every currency.
 */
export function buildRows(rates: readonly Rate[], selected: readonly string[]): RateRow[] {
  const wanted = new Set(selected.map((code) => code.toUpperCase()))

  return rates
    .filter((rate) => wanted.size === 0 || wanted.has(rate.code.toUpperCase()))
    .map((rate) => {
      const units = unitsFor(rate.code)
      return { ...rate, units, bid: scaleRate(rate.bid, units), ask: scaleRate(rate.ask, units) }
    })
}

/** Converts a WordPress locale ("pl_PL") to a BCP 47 tag ("pl-PL"). */
export function toLanguageTag(locale: string): string {
  return locale.replace('_', '-') || 'en-US'
}

export function formatRate(value: number, locale: string): string {
  return new Intl.NumberFormat(toLanguageTag(locale), {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  }).format(value)
}

/** Replaces sprintf-style %1$s / %s placeholders used in WordPress translations. */
export function sprintf(template: string, ...args: Array<string | number>): string {
  let next = 0
  return template.replace(/%(?:(\d+)\$)?s/g, (_match, position?: string) => {
    const index = position ? Number(position) - 1 : next++
    return String(args[index] ?? '')
  })
}

/** Formats a date (local time) as YYYY-MM-DD. */
export function isoDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

export function daysAgo(days: number, from: Date = new Date()): Date {
  const date = new Date(from)
  date.setDate(date.getDate() - days)
  return date
}
