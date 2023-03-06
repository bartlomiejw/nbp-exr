<template>
  <div class="main-wrapper">
    <Settings />
  </div>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue'
import menuFix from './admin-menu-fix.js'
import Settings from '@/admin/views/Settings.vue'

export default defineComponent({
  components: {Settings},
  mounted() {
    // const that = this

    const pluginConfig: any = inject('pluginConfig', {})
    // @ts-ignore
    menuFix(pluginConfig.prefix || 'vue-app')
  }
})
</script>
