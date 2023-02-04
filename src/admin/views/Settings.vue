<script>
import { defineComponent, reactive, computed, ref, nextTick, toRaw } from 'vue';
import { VAceEditor } from 'vue3-ace-editor';
import ace from 'ace-builds';
import { ElButton } from 'element-plus';
import 'element-plus/es/components/button/style/css';
import { ElMessage } from 'element-plus'

ace.config.set(
  'basePath',
  'https://cdn.jsdelivr.net/npm/ace-builds@' + require('ace-builds').version + '/src-noconflict/',
);

export default defineComponent({
  components: {
    VAceEditor, ElButton
  },
  name: 'Settings',
  setup () {
    const oldSettings = {};
    const settings = reactive({ ...oldSettings });
    const ui = reactive({ actionKey: 0, loaded: false });
    const structure = reactive({ sections: {}, options: {} });
    const hasLoaded = ref(false);

    const hasChanged = computed(() => {
      // compare two objects
      const a = JSON.stringify(settings);
      const b = JSON.stringify(oldSettings);
      ui.actionKey = ui.actionKey + 1;
      return (a === b);
    });

    return {
      settings,
      oldSettings,
      hasChanged,
      endpoints: { settings: '' },
      ui,
      structure,
      hasLoaded
    };
  },
  methods: {
    async doSave () {
      try {
        let data = toRaw(this.settings);
        const rst = await this.axios.post(this.endpoints.settings, data);
        console.log(rst);
        // const rst = { success: true }
        if (rst.status === 200) {
          ElMessage({
            message: 'Twoje ustawienia zostały zapisane.',
            type: 'success',
          })

          // @ts-ignore
          const config = this.$win.vue_wp_plugin_config_admin;
          const oldSettings = config.settings || {};
          const settings = { ...this.settings };

          Object.keys(settings).forEach((key) => {
            this.oldSettings[key] = settings[key];
            oldSettings[key] = settings[key];
          });

          // force rerendered
          this.ui.actionKey = this.ui.actionKey + 1;
        } else {
          ElMessage.error('Odpowiedź wordpress z błędem. ' + JSON.stringify(rst, null, 2))
        }
      } catch (err) {
        ElMessage.error('Odpowiedź serwera z błędem. ' + err.message)
      }
    },
    getOptions (section) {
      const options = { ...this.structure.options };
      const result = [];

      Object.keys(options).forEach((key) => {
        const item = options[key];
        if (item.section === section) {
          item.id = key;
          result.push(item);
        }
      });

      return result;
    },
    doCancel () {
      const settings = this.oldSettings;
      Object.keys(settings).forEach((key) => {
        this.oldSettings[key] = settings[key];
        this.settings[key] = settings[key];
      });
    },
    async doLoad () {
      await nextTick();

      // @ts-ignore
      const config = this.$win.vue_wp_plugin_config_admin;

      // @ts-ignore
      if (!this.$win.$appConfig.nonce) {
        this.$win.$appConfig.nonce = config.rest.nonce;
      }

      const structure = config.settingStructure;
      this.structure['sections'] = structure['sections'];
      this.structure['options'] = structure['options'];

      const settings = config.settings || {};
      this.endpoints = config.rest.endpoints;

      // copy settings from server output
      Object.keys(settings).forEach((key) => {
        this.oldSettings[key] = settings[key];
        this.settings[key] = settings[key];
      });

      // make sure data is loaded before ui render
      this.hasLoaded = true;
      this.$forceUpdate();
    }
  },
  beforeMount () {
    const that = this;

    // @ts-ignore
    if (that.$win && that.$win.vue_wp_plugin_config_admin) {
      that.doLoad();
      return;
    }

    document.onreadystatechange = async () => {
      if (document.readyState === 'complete') {
        this.doLoad();
      }
    };
  }
});
</script>

<template>
  <div class="app-settings w-full flex flex-wrap mx-auto" v-if="hasLoaded">
    <aside class="w-full md:w-1/5 pt-4">
      <div
        class="w-full sticky inset-0 max-h-64 lg:h-auto overflow-x-hidden overflow-y-auto lg:overflow-y-hidden lg:block mt-0 my-2 lg:my-0 border border-gray-400 lg:border-transparent bg-white shadow lg:shadow-none lg:bg-transparent z-20">
        <el-menu
          default-active="1"
          class="rounded shadow bg-white"
        >
          <el-menu-item
            v-for="(value, name) in structure.sections"
            :key="`item-${name}`"
            :index="`#${name}`">
            <span class="font-bold">
              {{ value }}
            </span>
          </el-menu-item>
        </el-menu>
        <div class="space-x-3 flex justify-end pt-2">
          <el-button
            @click="doSave()"
            style="width: 100px"
            type="primary"
            size="large"
            :disabled="hasChanged"
            :data-rerendered="ui.actionKey"
          >
            Zapisz
          </el-button>
          <el-button
            @click="doCancel()"
            style="width: 100px"
            type="danger"
            size="large"
            :disabled="hasChanged"
            :data-rerendered="ui.actionKey"
          >
            Anuluj
          </el-button>
        </div>
      </div>
    </aside>

    <!--Section container-->
    <section class="w-full md:w-4/5 min-h-screen">
      <div class="ml-3">
        <div :id="name" class="pt-4" v-for="(value, name) in structure.sections">
          <!--Card-->
          <div class="p-8 mt-6 lg:mt-0 rounded shadow bg-white">
            <!--Title-->
            <h2 class="font-sans font-bold break-normal text-gray-700 pb-4 text-xl w-full">
              {{ value }}
            </h2>
            <div class="md:flex mb-6" v-for="item in getOptions(name)">
              <div class="md:w-3/5">
                <label class="block text-gray-600 font-bold md:text-left mb-3 md:mb-0 pr-4" for="my-checkbox">
                  {{ item.name }}
                </label>
                <p class="py-2 text-sm text-gray-600">{{ item.description }}</p>
              </div>
              <div class="md:w-2/5">
                <div v-if="item.type === 'toggle'">
                  <el-switch
                    v-model="settings[item.id]"
                    size="large"
                  />
                </div>
                <div v-else-if="item.type === 'dropdownMultiselect'">
                  {{settings[item.id]}}
                  <el-select v-model="settings[item.id]" size="large" multiple collapse-tags placeholder="Wybierz">
                    <el-option
                      v-for="(item, index) in item.options"
                      :key="index"
                      :label="item.currency"
                      :value="item.code"
                    />
                  </el-select>
                </div>
                <div v-else-if="item.type === 'dropdown'">
                  <el-select v-model="settings[item.id]" size="large" placeholder="Wybierz">
                    <el-option
                      v-for="(item, index) in item.options"
                      :key="index"
                      :label="item"
                      :value="item"
                    />
                  </el-select>
                </div>
                <div v-else-if="['textarea'].indexOf(item.type) > -1">
                  <el-input
                    v-model="settings[item.id]"
                    :rows="5"
                    size="large"
                    type="textarea"
                    placeholder="Please input"
                  />
                </div>
                <div v-else-if="item.type === 'code'">
                  <v-ace-editor
                    v-model="settings[item.id]"
                    lang="html"
                    theme="chrome"
                    style="height: 300px"/>
                </div>
                <div v-else-if="item.type === 'color'">
                  <el-color-picker v-model="settings[item.id]"/>
                </div>
                <div v-else>
                  {{item.type}}
                  <el-input v-model="settings[item.id]" size="large" placeholder="Please input" />
                </div>
              </div>
            </div>

          </div>
          <!--/Card-->
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.active {
  --tw-border-opacity: 1;
  border-color: rgb(202 138 4 / var(--tw-border-opacity));
  font-weight: 700;
}

.overflow-footer {
  height: 100px;
  overflow-y: wrap;
}
</style>
