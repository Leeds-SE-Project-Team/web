import type { RouteRecordRaw } from 'vue-router'
import DashboardView from '@/views/web/admin/dashboard/DashboardView.vue'
import SearchTableTour from '@/views/web/admin/search/search-tour/index.vue'
import SearchTableUser from '@/views/web/admin/search/search-user/index.vue'
// import adminSetting from '@/views/web/discover/admin/settings/index.vue'
// import logView from '@/views/web/discover/admin/log/index.vue'

export const ADMIN_ROUTE: RouteRecordRaw = {
  path: '/admin',
  meta: {
    layout: 'admin',
    auth: ['admin']
    // auth: ['user', 'admin']
  },
  redirect: '/admin/dashboard',
  children: [
    {
      path: 'dashboard',
      name: 'dashboard',
      meta: {
        layout: 'admin',
        key: 'dashboard',
        auth: ['admin']
      },
      component: DashboardView
    }, // {
    //   path: 'post-tour',
    //   name: 'postTour',
    //   meta: {
    //     layout: 'admin',
    //     key: 'postTour',
    //     requiresAuth: true,
    //     auth: ['user']
    //   },
    //   component: PostTour
    // },
    {
      path: 'search',
      meta: {
        layout: 'admin',
        auth: ['admin']
      },
      children: [
        {
          path: 'tour',
          name: 'searchTour',
          meta: {
            layout: 'admin',
            key: 'searchTour',
            auth: ['admin']
          },
          component: SearchTableTour
        },
        {
          path: 'user',
          name: 'searchUser',
          meta: {
            layout: 'admin',
            key: 'searchUser',
            auth: ['admin']
          },
          component: SearchTableUser
        }
      ]
    }
    // {
    //   path: 'settings',
    //   name: 'adminSetting',
    //   meta: {
    //     layout: 'admin',
    //     key: 'adminSetting',
    //     requiresAuth: true,
    //     auth: ['admin']
    //   },
    //   component: adminSetting
    // },
    // {
    //   path: 'log',
    //   name: 'logView',
    //   meta: {
    //     layout: 'admin',
    //     key: 'logView',
    //     requiresAuth: true,
    //     auth: ['admin']
    //   },
    //   component: logView
    // }
  ]
  // component: () => import('@/views/DashboardView.vue')
}
