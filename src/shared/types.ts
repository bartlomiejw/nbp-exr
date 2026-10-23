/** A single NBP table C quotation, as returned by /wp-json/nbpexr/v1/rates. */
export interface Rate {
  currency: string
  code: string
  bid: number
  ask: number
}

/** NBP table C, normalized by includes/NbpClient.php. */
export interface RatesTable {
  table: string
  number: string
  tradingDate: string
  effectiveDate: string
  rates: Rate[]
}

export interface TableColors {
  border: string
  heading: string
  text: string
  stripe: string
}

/** Per-instance config rendered by the shortcode into data-nbpexr-config. */
export interface FrontendConfig {
  restUrl: string
  locale: string
  title: string
  currencies: string[]
  colors: TableColors
  debug: boolean
  i18n: Record<
    | 'currency'
    | 'buy'
    | 'sell'
    | 'pickDate'
    | 'today'
    | 'yesterday'
    | 'weekAgo'
    | 'loading'
    | 'noData'
    | 'error'
    | 'tableInfo',
    string
  >
}

export type FieldType = 'text' | 'color' | 'currencies' | 'toggle'

export type SettingValue = string | boolean | string[]

export type Settings = Record<string, SettingValue>

export interface Field {
  type: FieldType
  section: string
  label: string
  description: string
  default: SettingValue
}

/** Settings page config injected as window.nbpexrAdmin. */
export interface AdminConfig {
  restUrl: { settings: string; rates: string }
  nonce: string
  locale: string
  settings: Settings
  fields: Record<string, Field>
  sections: Record<string, string>
  i18n: Record<
    | 'save'
    | 'reset'
    | 'saved'
    | 'saveError'
    | 'currenciesError'
    | 'selectPlaceholder'
    | 'defaultTitle'
    | 'usage'
    | 'usageHelp'
    | 'shortcode'
    | 'shortcodeAttrs',
    string
  >
}
