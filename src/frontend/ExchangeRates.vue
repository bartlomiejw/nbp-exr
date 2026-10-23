<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import pl from 'element-plus/es/locale/lang/pl'
import en from 'element-plus/es/locale/lang/en'
import { fetchRates, RestError } from '@/shared/http'
import type { FrontendConfig, RatesTable } from '@/shared/types'
import { flagUrl } from './flags'
import { buildRows, daysAgo, formatRate, isoDate, sprintf } from './rates'

const props = defineProps<{ config: FrontendConfig }>()

const { i18n } = props.config

const date = ref<string>('')
const table = ref<RatesTable | null>(null)
const loading = ref(false)
const error = ref<string>('')
const brokenFlags = ref(new Set<string>())

let controller: AbortController | null = null

const elementLocale = computed(() => (props.config.locale.startsWith('pl') ? pl : en))

const rows = computed(() => (table.value ? buildRows(table.value.rates, props.config.currencies) : []))

const tableInfo = computed(() =>
  table.value ? sprintf(i18n.tableInfo, table.value.number, table.value.effectiveDate) : '',
)

const cssVars = computed(() => ({
  '--nbpexr-border': props.config.colors.border,
  '--nbpexr-heading': props.config.colors.heading,
  '--nbpexr-text': props.config.colors.text,
  '--nbpexr-stripe': props.config.colors.stripe,
}))

const shortcuts = [
  { text: i18n.today, value: () => new Date() },
  { text: i18n.yesterday, value: () => daysAgo(1) },
  { text: i18n.weekAgo, value: () => daysAgo(7) },
]

const isFutureDate = (day: Date): boolean => isoDate(day) > isoDate(new Date())

function debug(...args: unknown[]): void {
  if (props.config.debug) {
    console.debug('[nbp-exr]', ...args)
  }
}

function flagFor(code: string): string | undefined {
  return brokenFlags.value.has(code) ? undefined : flagUrl(code)
}

function onFlagError(code: string): void {
  brokenFlags.value = new Set(brokenFlags.value).add(code)
}

async function load(requested?: string): Promise<void> {
  controller?.abort()
  const current = new AbortController()
  controller = current

  loading.value = true
  error.value = ''

  try {
    const result = await fetchRates(props.config.restUrl, requested, current.signal)
    table.value = result
    if (!requested) {
      date.value = result.effectiveDate
    }
    debug('Loaded table', result.number, result)
  } catch (caught) {
    if (current.signal.aborted) {
      return
    }
    table.value = null
    error.value = caught instanceof RestError && caught.code === 'nbpexr_no_data' ? i18n.noData : i18n.error
    debug('Request failed', caught)
  } finally {
    if (controller === current) {
      loading.value = false
    }
  }
}

function onDateChange(value: string | null): void {
  void load(value ?? undefined)
}

onMounted(() => {
  void load()
})

onBeforeUnmount(() => {
  controller?.abort()
})
</script>

<template>
  <section class="nbpexr" :style="cssVars" :aria-busy="loading">
    <header class="nbpexr__header">
      <h3 class="nbpexr__title">
        {{ config.title }}
      </h3>
      <el-config-provider :locale="elementLocale">
        <el-date-picker
          v-model="date"
          class="nbpexr__picker"
          type="date"
          value-format="YYYY-MM-DD"
          :placeholder="i18n.pickDate"
          :aria-label="i18n.pickDate"
          :disabled-date="isFutureDate"
          :shortcuts="shortcuts"
          :clearable="false"
          size="large"
          @change="onDateChange"
        />
      </el-config-provider>
    </header>

    <p v-if="loading && !table" class="nbpexr__status">
      {{ i18n.loading }}
    </p>
    <p v-else-if="error" class="nbpexr__status nbpexr__status--error" role="alert">
      {{ error }}
    </p>
    <p v-else-if="table && rows.length === 0" class="nbpexr__status">
      {{ i18n.noData }}
    </p>

    <table v-if="!error && rows.length > 0" class="nbpexr__table" :class="{ 'is-loading': loading }">
      <caption class="nbpexr__caption">
        {{ tableInfo }}
      </caption>
      <thead>
        <tr>
          <th scope="col">
            {{ i18n.currency }}
          </th>
          <th scope="col">
            {{ i18n.buy }}
          </th>
          <th scope="col">
            {{ i18n.sell }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.code">
          <th scope="row" class="nbpexr__currency" :title="row.currency">
            <img
              v-if="flagFor(row.code)"
              class="nbpexr__flag"
              :src="flagFor(row.code)"
              alt=""
              width="20"
              height="15"
              loading="lazy"
              @error="onFlagError(row.code)"
            >
            <span v-else class="nbpexr__flag nbpexr__flag--placeholder" aria-hidden="true" />
            <span>{{ row.units > 1 ? `${row.units} ${row.code}` : row.code }}</span>
          </th>
          <td>{{ formatRate(row.bid, config.locale) }}</td>
          <td>{{ formatRate(row.ask, config.locale) }}</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<style scoped>
.nbpexr {
  --nbpexr-muted: #6c6c6c;
  --nbpexr-line: rgb(128 128 128 / 50%);

  margin: 0 0 1.5em;
  font-size: 16px;
  line-height: 1.5;
}

.nbpexr__header {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  padding: 20px 15px;
  background: #f8f8f8;
  border-top: 3px solid var(--nbpexr-border);
}

.nbpexr__title {
  margin: 0;
  color: var(--nbpexr-heading);
  font-size: 24px;
  font-weight: 700;
  line-height: 1.3;
}

.nbpexr__picker {
  max-width: 100%;
}

.nbpexr__status {
  margin: 0;
  padding: 16px 12px;
  color: var(--nbpexr-muted);
}

.nbpexr__status--error {
  color: #b32d2e;
}

.nbpexr__table {
  width: 100%;
  margin: 0;
  border-collapse: collapse;
  table-layout: fixed;
  transition: opacity 0.2s;
}

.nbpexr__table.is-loading {
  opacity: 0.5;
}

.nbpexr__caption {
  padding: 8px 12px;
  caption-side: bottom;
  color: var(--nbpexr-muted);
  font-size: 12px;
  text-align: right;
}

.nbpexr__table th,
.nbpexr__table td {
  padding: 16px 12px;
  border: 0;
  text-align: center;
  vertical-align: middle;
}

.nbpexr__table thead th {
  padding: 5px 12px;
  border-bottom: 1px solid var(--nbpexr-line);
  color: var(--nbpexr-muted);
  font-size: 12px;
  font-weight: 300;
  text-transform: uppercase;
}

.nbpexr__table tbody td {
  color: var(--nbpexr-text);
  font-variant-numeric: tabular-nums;
}

.nbpexr__table tbody tr:nth-child(even) {
  background: var(--nbpexr-stripe);
}

.nbpexr__currency {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: center;
  color: #444;
  font-weight: 400;
}

.nbpexr__flag {
  width: 20px;
  height: auto;
  margin: 0;
}

.nbpexr__flag--placeholder {
  display: inline-block;
  height: 15px;
  background: #e0e0e0;
  border-radius: 2px;
}
</style>
