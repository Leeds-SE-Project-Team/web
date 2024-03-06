import '@amap/amap-jsapi-types'

import { createApp } from 'vue'
import ArcoVue from '@arco-design/web-vue'
import Vant from 'vant'
// 额外引入图标库
import ArcoVueIcon from '@arco-design/web-vue/es/icon'
import '@arco-design/web-vue/dist/arco.css'
import 'vant/lib/index.css'
import { createPinia } from 'pinia'

import './scss/app.scss'
import App from './App.vue'
import router from './router'
import { PullRefresh } from 'vant'
const app = createApp(App)
import LayoutA from '@/layout/LayoutA.vue'
import LayoutDefault from '@/layout/LayoutDefault.vue'
import LayoutB from '@/layout/LayoutB.vue'
import LayoutMobileMain from '@/layout/mobile/LayoutMain.vue'
import LayoutMobileDefault from '@/layout/mobile/LayoutDefaultMobile.vue'

app.use(createPinia())
app.use(router)
app.use(ArcoVue)
app.use(Vant)
// Lazyload 指令需要单独进行注册
// app.use(Vant.Lazyload)
app.use(ArcoVueIcon)
app.use(PullRefresh)
app.component('layout-default', LayoutDefault)
app.component('layout-a', LayoutA)
app.component('layout-b', LayoutB)
app.component('layout-mobile-main', LayoutMobileMain)
app.component('layout-mobile-default', LayoutMobileDefault)
app.mount('#app')
