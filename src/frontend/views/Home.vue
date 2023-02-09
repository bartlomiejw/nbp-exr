<script lang="ts" setup>
import {defineComponent} from 'vue'

defineComponent({
  name: 'Home',
})

const msg = 'Welcome to Your Vue.js Frontview default view';
</script>

<template>
  <div class="app-home">
    <section class="w-full text-center">
      {{ msg }}
    </section>
  </div>
</template>
