import { describe, expect, it } from 'vitest'
import {
  buildRows,
  daysAgo,
  formatRate,
  isoDate,
  scaleRate,
  sprintf,
  toLanguageTag,
  unitsFor,
} from '@/frontend/rates'
import type { Rate } from '@/shared/types'

const rates: Rate[] = [
  { currency: 'dolar amerykański', code: 'USD', bid: 3.6012, ask: 3.674 },
  { currency: 'euro', code: 'EUR', bid: 4.2201, ask: 4.3053 },
  { currency: 'forint (Węgry)', code: 'HUF', bid: 0.010612, ask: 0.010826 },
  { currency: 'jen (Japonia)', code: 'JPY', bid: 0.023791, ask: 0.024271 },
  { currency: 'SDR (MFW)', code: 'XDR', bid: 4.9387, ask: 5.0385 },
]

describe('unitsFor', () => {
  it('returns the quotation unit for multi-unit currencies', () => {
    expect(unitsFor('HUF')).toBe(100)
    expect(unitsFor('jpy')).toBe(100)
    expect(unitsFor('IDR')).toBe(10000)
  })

  it('defaults to a single unit', () => {
    expect(unitsFor('USD')).toBe(1)
    expect(unitsFor('XYZ')).toBe(1)
  })
})

describe('scaleRate', () => {
  it('multiplies without floating point noise', () => {
    expect(scaleRate(0.010612, 100)).toBe(1.0612)
    expect(scaleRate(0.024271, 100)).toBe(2.4271)
    expect(scaleRate(3.674, 1)).toBe(3.674)
  })
})

describe('buildRows', () => {
  it('keeps only selected currencies in NBP order and scales rates', () => {
    const rows = buildRows(rates, ['huf', 'USD'])

    expect(rows.map((row) => row.code)).toEqual(['USD', 'HUF'])
    expect(rows[1]).toMatchObject({ units: 100, bid: 1.0612, ask: 1.0826 })
    expect(rows[0]).toMatchObject({ units: 1, bid: 3.6012, ask: 3.674 })
  })

  it('shows every currency when nothing is selected', () => {
    expect(buildRows(rates, [])).toHaveLength(rates.length)
  })

  it('ignores selected codes missing from the table', () => {
    expect(buildRows(rates, ['CNY'])).toEqual([])
  })

  it('does not mutate the input', () => {
    const copy = structuredClone(rates)
    buildRows(rates, ['HUF'])
    expect(rates).toEqual(copy)
  })
})

describe('formatting helpers', () => {
  it('formats rates with four decimals for the locale', () => {
    expect(formatRate(1.0612, 'en_US')).toBe('1.0612')
    expect(formatRate(3.6, 'pl_PL')).toBe('3,6000')
  })

  it('converts WordPress locales to BCP 47 tags', () => {
    expect(toLanguageTag('pl_PL')).toBe('pl-PL')
    expect(toLanguageTag('')).toBe('en-US')
  })

  it('replaces positional and sequential placeholders', () => {
    expect(sprintf('NBP table %1$s, effective %2$s', '204/C/NBP/2026', '2026-10-22')).toBe(
      'NBP table 204/C/NBP/2026, effective 2026-10-22',
    )
    expect(sprintf('%2$s before %1$s', 'a', 'b')).toBe('b before a')
    expect(sprintf('%s and %s', 1, 2)).toBe('1 and 2')
  })

  it('formats and shifts dates in local time', () => {
    const date = new Date(2024, 0, 5)
    expect(isoDate(date)).toBe('2024-01-05')
    expect(isoDate(daysAgo(7, date))).toBe('2023-12-29')
  })
})
