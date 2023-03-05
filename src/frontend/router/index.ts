import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router'
import ExchangeRates from '@/frontend/views/ExchangeRates.vue'

const routes: RouteRecordRaw[] = [
    {name: 'ExchangeRates', path: '/exchange-rates', component: ExchangeRates},
]

const router = createRouter({history: createWebHistory(), routes})

export default router
