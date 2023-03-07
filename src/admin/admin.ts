import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import installShared from '@/shared'
import './assets/index.scss'

const app = createApp(App)

app.use(router)

// delay mount so we can load configuration
setTimeout(() => {
  installShared(app, 'vue_wp_plugin_config_admin')
  app.mount('#vue-admin-app')
}, 200)
