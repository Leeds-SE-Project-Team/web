import '@amap/amap-jsapi-types'

import { createApp } from 'vue'
import ArcoVue, { Message } from '@arco-design/web-vue'
import Vant from 'vant'
// 额外引入图标库
import ArcoVueIcon from '@arco-design/web-vue/es/icon'
import '@arco-design/web-vue/dist/arco.css'
import 'vant/lib/index.css'
import './scss/app.scss'
import '@vuemap/vue-amap/dist/style.css'
import App from './App.vue'
import router from './router'
import LayoutA from '@/layout/LayoutA.vue'
import LayoutDefault from '@/layout/LayoutDefault.vue'
import LayoutB from '@/layout/LayoutB.vue'
import LayoutAdmin from '@/layout/LayoutAdmin.vue'
import LayoutMobileMain from '@/layout/mobile/LayoutMain.vue'
import LayoutMobileDefault from '@/layout/mobile/LayoutDefaultMobile.vue'
import LayoutMobileRecord from '@/layout/mobile/LayoutRecord.vue'
import LayoutMobilePure from '@/layout/mobile/LayoutPure.vue'
import VueAMap, { initAMapApiLoader } from '@vuemap/vue-amap'
import pinia from '@/stores'
import globalComponents from '@/components'
import i18n from '@/locale'

const app = createApp(App)

initAMapApiLoader({
  key: import.meta.env.APP_AMAP_KEY,
  securityJsCode: import.meta.env.APP_AMAP_SECURITY_CODE, // 新版key需要配合安全密钥使用
  plugins: [
    'AMap.MoveAnimation',
    'AMap.Scale',
    'AMap.HawkEye',
    'AMap.ToolBar',
    'AMap.ControlBar',
    'AMap.MouseTool',
    'AMap.Geolocation',
    'AMap.Walking',
    'AMap.Driving',
    'AMap.Transfer',
    'AMap.Riding',
    'AMap.Geocoder',
    'AMap.PlaceSearch',
    'AMap.AutoComplete'
  ], // Loca: {
  //   version: '2.0.0'
  // },
  version: '2.0'
})

app.use(pinia)
app.use(router)
app.use(ArcoVue)
app.use(Vant)
// Lazyload 指令需要单独进行注册
// app.use(Vant.Lazyload)
app.use(ArcoVueIcon)
app.use(globalComponents)
// app.use(PullRefresh)
app.use(VueAMap)
app.use(i18n)
app.component('layout-default', LayoutDefault)
app.component('layout-a', LayoutA)
app.component('layout-b', LayoutB)
app.component('layout-mobile-main', LayoutMobileMain)
app.component('layout-mobile-pure', LayoutMobilePure)
app.component('layout-mobile-default', LayoutMobileDefault)
app.component('layout-mobile-record', LayoutMobileRecord)
app.component('layout-admin', LayoutAdmin)
app.mount('#app')
Message._context = app._context
