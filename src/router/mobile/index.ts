import type { RouteRecordRaw } from 'vue-router'
import MobileRecord from '@/views/mobile/record/index.vue'

export const MOBILE_ROUTES: RouteRecordRaw[] = [
  {
    path: '/record/:tourId',
    name: 'record',
    meta: {
      layout: 'mobile-record',
      title: 'Discover Page'
    },
    component: MobileRecord,
    props: true,
    beforeEnter: (to) => {
      if (!to.params.tourId) {
        return { path: '/discover' }
      }
    }
  }
  // {
  //   path: '/highlight',
  //   name: 'highlight',
  //   meta: {
  //     layout: 'mobile-highlight',
  //     title: 'Highlight Page'
  //   },
  //   component: MobileHighlight
  // }
]
