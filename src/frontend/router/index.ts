import {createRouter, createWebHashHistory, RouteRecordRaw} from 'vue-router'
import Home from '@/frontend/views/Home.vue'
import ExchangeRates from '@/frontend/views/ExchangeRates.vue'
import ExchangeRatesMini from '@/frontend/views/ExchangeRatesMini.vue'

const routes: RouteRecordRaw[] = [
    {name: 'Home', path: '/home', component: Home},
    {name: 'ExchangeRates', path: '/exchange-rates', component: ExchangeRates},
    {name: 'ExchangeRatesMini', path: '/exchange-rates', component: ExchangeRatesMini}
]

const router = createRouter({history: createWebHashHistory(), routes})

export default router
