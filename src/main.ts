import '@amap/amap-jsapi-types'

import { createApp } from 'vue'
import ArcoVue from '@arco-design/web-vue'
// 额外引入图标库
import ArcoVueIcon from '@arco-design/web-vue/es/icon'
import '@arco-design/web-vue/dist/arco.css'
import { createPinia } from 'pinia'

import './scss/app.scss'
import App from './App.vue'
import router from './router'

const app = createApp(App)
import LayoutA from '@/layout/LayoutA.vue'
import LayoutDefault from '@/layout/LayoutDefault.vue'
import LayoutB from '@/layout/LayoutB.vue'
import LayoutMobileMain from '@/layout/mobile/LayoutMain.vue'

app.use(createPinia())
app.use(router)
app.use(ArcoVue)
app.use(ArcoVueIcon)
app.component('layout-default', LayoutDefault)
app.component('layout-a', LayoutA)
app.component('layout-b', LayoutB)
app.component('layout-mobile-main', LayoutMobileMain)
app.mount('#app')
