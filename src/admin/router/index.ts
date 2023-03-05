import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router'
import Settings from '@/admin/views/Settings.vue'

const routes: RouteRecordRaw[] = [
    {path: '/', component: Settings}
]

const router = createRouter({
    history: createWebHistory(), routes
})

export default router
