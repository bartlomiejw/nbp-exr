import { inject } from 'vue'

export function getPluginUrl() {
  // @ts-ignore
  const pluginConfig: any = inject('pluginConfig', {})

  return pluginConfig.pluginUrl || ''
}

export function getConfig() {
  // @ts-ignore
  const config: any = inject('pluginConfig', {})

  return config || ''
}
