import type { RouteRecordRaw } from 'vue-router'
import { Capacitor } from '@capacitor/core'
import MobileRecord from '@/views/mobile/record/index.vue'

export const MOBILE_ROUTES: RouteRecordRaw[] = [
  {
    path: '/record',
    name: 'record',
    meta: {
      layout: 'mobile-record',
      title: 'Discover Page'
    },
    component: MobileRecord
  }
]
