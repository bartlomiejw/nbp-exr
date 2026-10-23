const flags = import.meta.glob<string>('./flags/*.png', { eager: true, import: 'default' })

/** URL of the bundled flag for a currency code, or undefined when there is none (e.g. XDR). */
export function flagUrl(code: string): string | undefined {
  return flags[`./flags/${code.toUpperCase()}.png`]
}
