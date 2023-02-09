import {createRouter, createWebHashHistory, RouteRecordRaw} from 'vue-router'
// import Dashboard from '@/admin/views/Dashboard.vue'
import Settings from '@/admin/views/Settings.vue'

const routes: RouteRecordRaw[] = [
    // {path: '/', component: Dashboard},
    {path: '/', component: Settings}
]

const router = createRouter({
    history: createWebHashHistory(),
    scrollBehavior(to, from, savedPosition) {
        if (to.hash) {
            return {
                el: to.hash,
                behavior: 'smooth'
            }
        }
    }, routes
})

export default router
