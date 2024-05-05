import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import IndexView from '@/views/both/home/index.vue'
import HomeView from '@/views/both/home/HomeView.vue'
import LoginView from '@/views/both/login/index.vue'
import DiscoverMobileView from '@/views/mobile/discover/index.vue'
import TourView from '@/views/tour/index.vue'
import CollectionDetail from '@/views/discover/CollectionDetail.vue'
import PlannerMobileView from '@/views/mobile/planner/index.vue'
import AnoHighlightView from '@/views/mobile/highlight/another.vue'
// import groupCollection from '@/views/web/groupCollection/index.vue'
import groupCollection from '@/views/web/mobileGroup/index.vue'
import HighlightView from '@/views/web/highlight/index.vue'
import personalIndex from '@/views/mobile/personal/index.vue'
import personalTours from '@/views/web/personal/tours.vue'
import personalProfile from '@/views/web/personal/profile.vue'
import personalCollections from '@/views/web/personal/collections.vue'
import personalHighlights from '@/views/web/personal/highlights.vue'
import personalGroup from '@/views/web/personal/group.vue'
import TourDetail from '@/views/mobile/personal/TourDetail.vue'
import { MOBILE_ROUTES } from '@/router/mobile'
import { useAuthStore } from '@/stores/auth'
import PersonMain from '@/views/mobile/personal/PersonMain.vue'
import DetailInfo from '@/views/mobile/personal/DetailInfo.vue'
import { useUserStore } from '@/stores/user'
import CollDetail from '@/views/mobile/personal/CollDetail.vue'
import GroupList from '@/views/mobile/personal/GroupList.vue'
import GroupIndex from '@/views/mobile/group/index.vue'
import { ADMIN_ROUTE } from '@/router/web'
import HighlightView from '@/views/web/highlight/index.vue'
import PlannerWebView from '@/views/web/planner/index.vue'
import { Capacitor } from '@capacitor/core'
import personalPage from '@/views/web/personal/index.vue'


const personalMobileChildren: RouteRecordRaw[] = [
  {
    path: '',
    name: 'personal',
    meta: { title: 'Personal' },
    component: PersonMain
  },
  {
    path: 'tour',
    name: 'personal-tour',
    meta: { title: 'Tour' },
    component: TourDetail
  },
  {
    path: 'detail',
    name: 'personal-detail',
    meta: { title: 'Detail' },
    component: DetailInfo
  },
  {
    path: 'collection',
    name: 'personal-collection',
    meta: { title: 'Collection' },
    component: CollDetail
  },
  {
    path: 'group',
    name: 'personal-group',
    meta: { title: 'Group' },
    component: GroupList
  }
]

const web_personal_children = [
  {
    path: 'personalprofile',
    name: 'personalprofile',
    meta: {
      title: 'personalprofile'
    },
    component: personalProfile
  },
  {
    path: 'personaltours',
    name: 'personaltours',
    meta: {
      title: 'personaltours'
    },
    component: personalTours
  },
  {
    path: 'personalhighlights',
    name: 'personalhighlights',
    meta: {
      title: 'personalhighlights'
    },
    component: personalHighlights
  },
  {
    path: 'personalcollections',
    name: 'personalcollections',
    meta: {
      title: 'personalcollections'
    },
    component: personalCollections
  },
  {
    path: 'personalgroup',
    name: 'personalgroup',
    meta: {
      title: 'personalgroup'
    },
    component: personalGroup
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...MOBILE_ROUTES,
    ADMIN_ROUTE,
    {
      path: '/',
      name: 'index',
      meta: {
        title: 'Index Page'
      },
      component: IndexView
    },
    {
      path: '/home',
      name: 'home',
      meta: {
        title: 'Home Page',
        layout: 'a',
        auth: ['admin', 'user']
      },
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      meta: {
        title: 'Log in'
      },
      component: LoginView
    },

    {
      path: '/discover',
      name: 'discover',
      meta: {
        // layout: 'mobile-main',
        layout: 'mobile-main',
        title: 'Discover Page',
        auth: ['admin', 'user']
      }, // Render component dynamically according to platform
      // component: DiscoverMobileView
      component: DiscoverMobileView
    },
    // {
    //   path: '/plan',
    //   name: 'planner',
    //   meta: {
    //     title: 'Planner Page',
    //     layout: 'mobile-default'
    //   },
    //   component: PlannerMobileView
    // }, 
    {
      path: '/plan',
      name: 'planner',
      meta: {
        title: 'Planner Page',
        layout: 'b',
        auth: ['user']
      },
      component: PlannerWebView
    },
    {
      path: '/tour',
      name: 'tour',
      meta: {
        layout: 'b',
        title: 'Tour Page'
        // auth: ['admin', 'user']
      },
      component: TourView
    },
    {
      path: '/collection',
      name: 'collection',
      meta: {
        layout: 'b',
        title: 'Collection Detail Page',
        auth: ['admin', 'user']
      },
      beforeEnter: (to) => {
        if (!to.query.id) {
          return { path: '/discover' }
        }
      },
      component: CollectionDetail
    }, //     {
    //       path: '/highlight',
    //       name: 'highlight',
    //       meta: {
    //         layout: 'mobile-main', // layout: Capacitor.getPlatform() === 'web' ? 'b' : 'mobile-main',
    //         title: 'highlight Page',
    //         auth: ['admin', 'user']
    //       }, // Render component dynamically according to platform
    //       component: HighlightMobileView
    //       // component: HighlighView
    //       // component: Capacitor.getPlatform() === 'web' ? HighlightView : HighlightMobileView
    //     },
    {
      path: '/highlight/:id',
      name: 'highlight',
      meta: {
        layout: 'b', // layout: Capacitor.getPlatform() === 'web' ? 'b' : 'mobile-main',
        title: 'highlight Page',
        auth: ['admin', 'user']
      }, // Render component dynamically according to platform
      // component: HighlightMobileView
      component: HighlightView
      // component: Capacitor.getPlatform() === 'web' ? HighlightView : HighlightMobileView
    },
    {
      path: '/highlightano',
      name: 'anotherHighlight',
      meta: {
        layout: 'mobile-main',
        title: 'highlight Page',
        auth: ['admin', 'user']
      },
      component: AnoHighlightView
    },
    {
      path: '/groupcollection/:id',
      name: 'groucollection',
      meta: {
        layout: 'b',
        title: 'group collection Page',
        auth: ['admin', 'user']
      },
      component: groupCollection
    },
    {
      path: '/personal',
      redirect: '/personal/personalprofile', // web页面的重定向
      meta: {
        auth: ['admin', 'user'],
        layout: Capacitor.getPlatform() === 'web' ? 'b' : '',
        title: 'personalprofile'
      },
      component: Capacitor.getPlatform() === 'web' ? personalPage : personalIndex,
      children: Capacitor.getPlatform() === 'web' ? web_personal_children : personalMobileChildren
    },
    {
      path: '/group',
      name: 'group',
      meta: {
        auth: ['admin', 'user']
      },
      component: GroupIndex
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.meta.auth && (to.meta.auth as string[]).length > 0) {
    const authStore = useAuthStore()
    const userStore = useUserStore()
    if (authStore.isTokenValid) {
      next()
      return
    } else {
      const accessToken = localStorage.getItem('accessToken')
      if (accessToken === 'root') {
        next()
        return
      }
      authStore
        .refreshAccessToken(accessToken)
        .then((user) => {
          if (user) {
            next()
          } else {
            next('/')
          }
        })
        .catch((_e) => {
          next('/')
        })
      // if (accessToken) {
      //   if (accessToken === 'root') {
      //     authStore.isTokenValid = true
      //     next()
      //     return
      //   }
      //   getUserByToken(accessToken)
      //     .then((apiRes) => {
      //       if (apiRes.success) {
      //         userStore.curUser = apiRes.data!
      //         authStore.refreshAccessToken(accessToken)
      //         next()
      //         return
      //       } else {
      //         authStore.refreshAccessToken(null)
      //         next('/')
      //         return
      //       }
      //     })
      //     .catch(() => {
      //       authStore.refreshAccessToken(null)
      //     })
      // } else {
      //   authStore.refreshAccessToken(null)
      //   next('/')
      //   return
      // }
    }
  } else {
    next()
    return
  }
})

export default router
