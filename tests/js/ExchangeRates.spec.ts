import { afterEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import ExchangeRates from '@/frontend/ExchangeRates.vue'
import type { FrontendConfig, RatesTable } from '@/shared/types'

const config: FrontendConfig = {
  restUrl: 'https://example.test/wp-json/nbpexr/v1/rates',
  locale: 'en_US',
  title: 'Exchange rates',
  currencies: ['USD', 'HUF'],
  colors: { border: '#018765', heading: '#7a7a7a', text: '#018765', stripe: '#f8f8f8' },
  debug: false,
  i18n: {
    currency: 'Currency',
    buy: 'Buy rate',
    sell: 'Sell rate',
    pickDate: 'Pick a date',
    today: 'Today',
    yesterday: 'Yesterday',
    weekAgo: 'A week ago',
    loading: 'Loading…',
    noData: 'No data',
    error: 'Error',
    tableInfo: 'NBP table %1$s, effective %2$s',
  },
}

const table: RatesTable = {
  table: 'C',
  number: '204/C/NBP/2026',
  tradingDate: '2026-10-21',
  effectiveDate: '2026-10-22',
  rates: [
    { currency: 'dolar amerykański', code: 'USD', bid: 3.6012, ask: 3.674 },
    { currency: 'euro', code: 'EUR', bid: 4.2201, ask: 4.3053 },
    { currency: 'forint (Węgry)', code: 'HUF', bid: 0.010612, ask: 0.010826 },
  ],
}

function mockFetch(status: number, body: unknown) {
  const fetchMock = vi.fn().mockResolvedValue(
    new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } }),
  )
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

const stubs = { ElConfigProvider: { template: '<div><slot /></div>' }, ElDatePicker: true }

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('ExchangeRates', () => {
  it('renders the selected currencies from the REST proxy', async () => {
    const fetchMock = mockFetch(200, table)

    const wrapper = mount(ExchangeRates, { props: { config }, global: { stubs } })
    await flushPromises()

    expect(fetchMock).toHaveBeenCalledOnce()
    expect(String(fetchMock.mock.calls[0]?.[0])).toBe(config.restUrl)

    const rows = wrapper.findAll('tbody tr')
    expect(rows).toHaveLength(2)
    expect(rows[0]?.text()).toContain('USD')
    expect(rows[0]?.text()).toContain('3.6012')
    expect(rows[1]?.text()).toContain('100 HUF')
    expect(rows[1]?.text()).toContain('1.0612')
    expect(rows[1]?.text()).toContain('1.0826')
    expect(wrapper.find('caption').text()).toBe('NBP table 204/C/NBP/2026, effective 2026-10-22')
  })

  it('shows a friendly message when NBP has no table', async () => {
    mockFetch(404, { code: 'nbpexr_no_data', message: 'No table', data: { status: 404 } })

    const wrapper = mount(ExchangeRates, { props: { config }, global: { stubs } })
    await flushPromises()

    expect(wrapper.find('[role="alert"]').text()).toBe('No data')
    expect(wrapper.find('table').exists()).toBe(false)
  })

  it('shows a generic error for other failures', async () => {
    mockFetch(502, { code: 'nbpexr_http_error', message: 'Bad gateway' })

    const wrapper = mount(ExchangeRates, { props: { config }, global: { stubs } })
    await flushPromises()

    expect(wrapper.find('[role="alert"]').text()).toBe('Error')
  })
})
