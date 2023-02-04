import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import App from './App.vue'
import router from './router'
import installShared from '~src/shared'

const app = createApp(App)

app.use(ElementPlus)
app.use(router)

// delay mount so we can load configuration
setTimeout(() => {
  installShared(app, 'vue_wp_plugin_config_admin')
  app.mount('#vue-admin-app')
}, 200)
