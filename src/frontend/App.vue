<script lang="ts" setup>
import {getConfig} from '@/shared/pluginHelpers'
import {
  computed,
  defineComponent,
  ref,
  nextTick,
  onMounted,
} from
      'vue'
import {
  useRoute,
  useRouter
} from 'vue-router'

defineComponent({
  name: 'Frontend',
})

// -> USE <- //
const route = useRoute()
const router = useRouter()
const componentSettings = getConfig()
const routes = router.options.routes

// -> REFS <- //
const hasLoaded = ref(false)
const componentName = ref('')

// -> COMPUTED <- //
const key = computed(() => routes.filter(c => c.name === componentName.value).shift()?.path)
const comp = computed(() => {
  return routes.filter(c => c.name === componentName.value).shift()?.component
});

// -> METHODS <- //
const doLoad = async () => {
  await nextTick()
  // @ts-ignore
  let viewComponent = componentSettings.viewComponent
  if (!viewComponent) {
    viewComponent = route.query.comp
  }
  if (!viewComponent) {
    viewComponent = 'Home'
  }
  componentName.value = viewComponent
  // make sure data is loaded before ui render
  hasLoaded.value = true
}

// -> LIFECYCLE <- //
onMounted(() => {
  // @ts-ignore
  if (componentSettings) {
    doLoad()
    return
  }
  document.onreadystatechange = async () => {
    if (document.readyState == 'complete') {
      await doLoad()
    }
  }
})
</script>

<template>
    <div v-if="hasLoaded" class="main-wrapper">
      <component :is="comp" :key="key"></component>
    </div>
</template>
