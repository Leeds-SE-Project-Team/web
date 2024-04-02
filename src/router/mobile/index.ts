import type { RouteRecordRaw } from 'vue-router'
import { Capacitor } from '@capacitor/core'
import MobileRecord from '@/views/mobile/record/index.vue'
import MobileHighlight from '@/views/mobile/highlight/index.vue'
export const MOBILE_ROUTES: RouteRecordRaw[] = [
  {
    path: '/record',
    name: 'record',
    meta: {
      layout: 'mobile-record',
      title: 'Discover Page'
    },
    component: MobileRecord
  },
    {
      path: '/highlight',
      name: 'highlight',
      meta: {
        layout: 'mobile-highlight',
        title: 'Highlight Page'
      },
      component: MobileHighlight
    }
]
