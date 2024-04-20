import type { RouteRecordRaw } from 'vue-router'
import DashboardView from '@/views/web/admin/dashboard/DashboardView.vue'
// import SearchTableVideo from '@/views/web/discover/admin/search/search-video/index.vue'
// import SearchTableUser from '@/views/web/discover/admin/search/search-user/index.vue'
// import adminSetting from '@/views/web/discover/admin/settings/index.vue'
// import logView from '@/views/web/discover/admin/log/index.vue'

export const ADMIN_ROUTE: RouteRecordRaw = {
  path: '/admin',
  meta: {
    layout: 'admin',
    requiresAuth: true
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
        requiresAuth: true
        // auth: ['admin']
      },
      component: DashboardView
    }
    // {
    //   path: 'post-video',
    //   name: 'postVideo',
    //   meta: {
    //     layout: 'admin',
    //     key: 'postVideo',
    //     requiresAuth: true,
    //     auth: ['user']
    //   },
    //   component: PostVideo
    // },
    // {
    //   path: 'search',
    //   meta: {
    //     layout: 'admin',
    //     requiresAuth: true,
    //     auth: ['admin']
    //   },
    //   children: [
    //     {
    //       path: 'video',
    //       name: 'searchVideo',
    //       meta: {
    //         layout: 'admin',
    //         key: 'searchVideo',
    //         requiresAuth: true,
    //         auth: ['admin']
    //       },
    //       component: SearchTableVideo
    //     },
    //     {
    //       path: 'user',
    //       name: 'searchUser',
    //       meta: {
    //         layout: 'admin',
    //         key: 'searchUser',
    //         requiresAuth: true,
    //         auth: ['admin']
    //       },
    //       component: SearchTableUser
    //     }
    //   ]
    // }
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
