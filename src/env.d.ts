/// <reference types="vite/client" />

import type { AdminConfig } from '@/shared/types'

declare global {
  interface Window {
    /** Injected by includes/Admin/SettingsPage.php on the settings screen. */
    nbpexrAdmin?: AdminConfig
  }
}

export {}
