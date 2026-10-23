<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import pl from 'element-plus/es/locale/lang/pl'
import en from 'element-plus/es/locale/lang/en'
import { fetchRates, requestJson, RestError } from '@/shared/http'
import type { AdminConfig, Field, Settings } from '@/shared/types'

const props = defineProps<{ config: AdminConfig }>()

const { i18n } = props.config

const clone = (value: Settings): Settings => JSON.parse(JSON.stringify(value)) as Settings

const saved = ref<Settings>(clone(props.config.settings))
const form = reactive<Settings>(clone(props.config.settings))
const saving = ref(false)
const currencyOptions = ref<Array<{ code: string; currency: string }>>([])
const currenciesError = ref(false)

const elementLocale = computed(() => (props.config.locale.startsWith('pl') ? pl : en))

const isDirty = computed(() => JSON.stringify(form) !== JSON.stringify(saved.value))

const sections = computed(() =>
  Object.entries(props.config.sections).map(([id, label]) => ({
    id,
    label,
    fields: Object.entries(props.config.fields)
      .filter(([, field]) => field.section === id)
      .map(([key, field]) => ({ key, ...field })),
  })),
)

/** Options for the currency select; previously saved codes stay selectable if NBP is unreachable. */
const currencySelectOptions = computed(() => {
  const options = [...currencyOptions.value]
  const selected = Array.isArray(form.currencies) ? form.currencies : []
  for (const code of selected) {
    if (!options.some((option) => option.code === code)) {
      options.push({ code, currency: code })
    }
  }
  return options
})

function asString(key: string): string {
  const value = form[key]
  return typeof value === 'string' ? value : ''
}

function setValue(key: string, field: Field, value: unknown): void {
  if (field.type === 'currencies') {
    form[key] = Array.isArray(value) ? value.map(String) : []
  } else if (field.type === 'toggle') {
    form[key] = value === true
  } else {
    form[key] = typeof value === 'string' ? value : String(field.default)
  }
}

async function loadCurrencies(): Promise<void> {
  try {
    const table = await fetchRates(props.config.restUrl.rates)
    currencyOptions.value = table.rates.map(({ code, currency }) => ({ code, currency }))
  } catch {
    currenciesError.value = true
  }
}

async function save(): Promise<void> {
  saving.value = true
  try {
    const result = await requestJson<Settings>(props.config.restUrl.settings, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-WP-Nonce': props.config.nonce,
      },
      body: JSON.stringify(form),
    })
    saved.value = clone(result)
    Object.assign(form, clone(result))
    ElMessage.success(i18n.saved)
  } catch (error) {
    const detail = error instanceof RestError ? ` ${error.message}` : ''
    ElMessage.error(`${i18n.saveError}${detail}`)
  } finally {
    saving.value = false
  }
}

function reset(): void {
  Object.assign(form, clone(saved.value))
}

function warnOnLeave(event: BeforeUnloadEvent): void {
  if (isDirty.value) {
    event.preventDefault()
  }
}

onMounted(() => {
  void loadCurrencies()
  window.addEventListener('beforeunload', warnOnLeave)
})

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', warnOnLeave)
})
</script>

<template>
  <el-config-provider :locale="elementLocale">
    <form class="nbpexr-settings" @submit.prevent="save">
      <div class="nbpexr-settings__main">
        <section v-for="section in sections" :key="section.id" class="nbpexr-card">
          <h2 class="nbpexr-card__title">
            {{ section.label }}
          </h2>

          <div v-for="field in section.fields" :key="field.key" class="nbpexr-field">
            <div class="nbpexr-field__label">
              <label :for="`nbpexr-${field.key}`">{{ field.label }}</label>
              <p class="description">
                {{ field.description }}
              </p>
            </div>

            <div class="nbpexr-field__control">
              <el-switch
                v-if="field.type === 'toggle'"
                :id="`nbpexr-${field.key}`"
                :model-value="form[field.key] === true"
                @update:model-value="setValue(field.key, field, $event)"
              />
              <el-color-picker
                v-else-if="field.type === 'color'"
                :id="`nbpexr-${field.key}`"
                :model-value="asString(field.key)"
                @update:model-value="setValue(field.key, field, $event)"
              />
              <template v-else-if="field.type === 'currencies'">
                <el-select
                  :id="`nbpexr-${field.key}`"
                  :model-value="form[field.key]"
                  multiple
                  filterable
                  :placeholder="i18n.selectPlaceholder"
                  @update:model-value="setValue(field.key, field, $event)"
                >
                  <el-option
                    v-for="option in currencySelectOptions"
                    :key="option.code"
                    :label="`${option.code} – ${option.currency}`"
                    :value="option.code"
                  />
                </el-select>
                <p v-if="currenciesError" class="nbpexr-field__error" role="alert">
                  {{ i18n.currenciesError }}
                </p>
              </template>
              <el-input
                v-else
                :id="`nbpexr-${field.key}`"
                :model-value="asString(field.key)"
                :placeholder="i18n.defaultTitle"
                maxlength="200"
                show-word-limit
                @update:model-value="setValue(field.key, field, $event)"
              />
            </div>
          </div>
        </section>
      </div>

      <aside class="nbpexr-settings__aside">
        <div class="nbpexr-card">
          <div class="nbpexr-actions">
            <el-button type="primary" native-type="submit" :loading="saving" :disabled="!isDirty">
              {{ i18n.save }}
            </el-button>
            <el-button :disabled="!isDirty || saving" @click="reset">
              {{ i18n.reset }}
            </el-button>
          </div>
        </div>
        <div class="nbpexr-card">
          <h2 class="nbpexr-card__title">
            {{ i18n.usage }}
          </h2>
          <p><code>{{ i18n.shortcode }}</code></p>
          <p class="description">
            {{ i18n.usageHelp }}
          </p>
          <p><code>{{ i18n.shortcodeAttrs }}</code></p>
        </div>
      </aside>
    </form>
  </el-config-provider>
</template>

<style scoped>
.nbpexr-settings {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 20px;
  max-width: 1100px;
  margin-top: 16px;
}

@media (width >= 960px) {
  .nbpexr-settings {
    grid-template-columns: minmax(0, 3fr) minmax(240px, 1fr);
  }

  .nbpexr-settings__aside {
    position: sticky;
    top: 48px;
    align-self: start;
  }
}

.nbpexr-card {
  margin-bottom: 20px;
  padding: 20px 24px;
  background: #fff;
  border: 1px solid #c3c4c7;
  border-radius: 4px;
}

.nbpexr-card__title {
  margin: 0 0 16px;
  font-size: 1.2em;
}

.nbpexr-field {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 8px 24px;
  padding: 12px 0;
  border-top: 1px solid #f0f0f1;
}

@media (width >= 782px) {
  .nbpexr-field {
    grid-template-columns: minmax(0, 3fr) minmax(0, 2fr);
    align-items: center;
  }
}

.nbpexr-field__label label {
  font-weight: 600;
}

.nbpexr-field__label .description {
  margin: 4px 0 0;
}

.nbpexr-field__error {
  margin: 6px 0 0;
  color: #b32d2e;
}

.nbpexr-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.nbpexr-actions .el-button + .el-button {
  margin-left: 0;
}
</style>
