import { createApp } from 'vue'
import type { FrontendConfig } from '@/shared/types'
import ExchangeRates from './ExchangeRates.vue'

const SELECTOR = '.nbpexr-rates[data-nbpexr-config]'

/**
 * Mounts an independent Vue island on every shortcode instance on the page.
 * Each instance reads its own config from the data attribute.
 */
export function mountAll(root: ParentNode = document): number {
  let mounted = 0

  root.querySelectorAll<HTMLElement>(SELECTOR).forEach((element) => {
    if (element.dataset.nbpexrMounted) {
      return
    }

    try {
      const config = JSON.parse(element.dataset.nbpexrConfig ?? '') as FrontendConfig
      createApp(ExchangeRates, { config }).mount(element)
      element.dataset.nbpexrMounted = 'true'
      mounted++
    } catch (error) {
      console.error('[nbp-exr] Could not start the exchange rates table.', error)
    }
  })

  return mounted
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => mountAll())
} else {
  mountAll()
}
