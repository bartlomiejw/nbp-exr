import { createApp } from 'vue'
import 'element-plus/es/components/message/style/css'
import './admin.css'
import SettingsApp from './SettingsApp.vue'

const root = document.getElementById('nbpexr-admin-app')
const config = window.nbpexrAdmin

if (root && config) {
  createApp(SettingsApp, { config }).mount(root)
}
