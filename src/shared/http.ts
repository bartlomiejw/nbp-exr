import type { RatesTable } from './types'

/** Error carrying the WordPress REST error code (e.g. "nbpexr_no_data"). */
export class RestError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly status: number,
  ) {
    super(message)
    this.name = 'RestError'
  }
}

interface WpErrorBody {
  code?: string
  message?: string
}

/** fetch() wrapper for the WordPress REST API that throws RestError on failure. */
export async function requestJson<T>(url: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(url, {
    credentials: 'same-origin',
    ...init,
    headers: { Accept: 'application/json', ...init.headers },
  })

  const body: unknown = await response.json().catch(() => null)

  if (!response.ok) {
    const error = (body ?? {}) as WpErrorBody
    throw new RestError(error.message ?? response.statusText, error.code ?? 'http_error', response.status)
  }

  return body as T
}

/** Builds a URL with query args, respecting rest_url() values that already contain "?rest_route=". */
export function withQuery(url: string, params: Record<string, string | undefined>): string {
  const target = new URL(url, window.location.href)
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') {
      target.searchParams.set(key, value)
    }
  }
  return target.toString()
}

/** Loads NBP table C through the plugin's cached REST proxy. */
export function fetchRates(restUrl: string, date?: string, signal?: AbortSignal): Promise<RatesTable> {
  return requestJson<RatesTable>(withQuery(restUrl, { date }), { signal })
}
