import { createRouter, createWebHistory } from 'vue-router'
import IndexView from '@/views/both/home/index.vue'
import HomeView from '@/views/both/home/HomeView.vue'
import LoginView from '@/views/both/login/index.vue'
import DiscoverMobileView from '@/views/mobile/discover/index.vue'
import DiscoverView from '@/views/web/discover/index.vue'
import HighlightMobileView from '@/views/mobile/highlight/index.vue'
import HighlightView from '@/views/web/highlight/index.vue'
import PlannerView from '@/views/web/planner/index.vue'
import TourView from '@/views/tour/index.vue'
import CollectionDetail from '@/views/discover/CollectionDetail.vue'
import PlannerMobileView from '@/views/mobile/planner/index.vue'
import AnoHighlightView from '@/views/mobile/highlight/another.vue'
import groupCollection from '@/views/web/groupCollection/index.vue'
import personalPage from '@/views/web/personal/index.vue'
import personalTours from '@/views/web/personal/tours.vue'
import personalProfile from '@/views/web/personal/profile.vue'
import personalHighlights from '@/views/web/personal/highlights.vue'
import personalCollections from '@/views/web/personal/profile.vue'
import personalGroup from '@/views/web/personal/group.vue'
import { Capacitor } from '@capacitor/core'
import { MOBILE_ROUTES } from '@/router/mobile'
import { useAuthStore } from '@/stores/auth'
import { getUserByToken } from '@/apis/user'

const web_personal_children = [
  {
    path: 'personalprofile',
    name: 'personalprofile',
    meta: {
      title: 'personalprofile',
    },
    component: personalProfile
  },
  {
    path: 'personaltours',
    name: 'personaltours',
    meta: {
      title: 'personaltours',
    },
    component: personalTours
  },
  {
    path: 'personalhighlights',
    name: 'personalhighlights',
    meta: {
      title: 'personalhighlights',
    },
    component: personalHighlights
  },
  {
    path: 'personalcollections',
    name: 'personalcollections',
    meta: {
      title: 'personalcollections',
    },
    component: personalCollections
  },
  {
    path: 'personalgroup',
    name: 'personalgroup',
    meta: {
      title: 'personalgroup',
    },
    component: personalGroup
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...MOBILE_ROUTES,
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
        layout: Capacitor.getPlatform() === 'web' ? 'b' : 'mobile-main',
        title: 'Discover Page',
        auth: ['admin', 'user']
      }, // Render component dynamically according to platform
      // component: DiscoverMobileView
      component: Capacitor.getPlatform() === 'web' ? DiscoverView : DiscoverMobileView
    },

    {
      path: '/plan',
      name: 'planner',
      meta: {
        title: 'Planner Page',
        layout: 'mobile-default'
      },
      component: PlannerMobileView
    },
    // {
    //   path: '/plan',
    //   name: 'planner',
    //   meta: {
    //     title: 'Planner Page',
    //     layout: Capacitor.getPlatform() === 'web' ? 'b' : 'mobile-default',
    //     auth: ['user']
    //   },
    //   component: Capacitor.getPlatform() === 'web' ? PlannerView : PlannerMobileView
    // },
    {
      path: '/tour',
      name: 'tour',
      meta: {
        layout: 'b',
        title: 'Tour Page',
        auth: ['admin', 'user']
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
    },
    {
      path: '/highlight',
      name: 'highlight',
      meta: {
        layout: 'mobile-main',
        // layout: Capacitor.getPlatform() === 'web' ? 'b' : 'mobile-main',
        title: 'highlight Page',
        auth: ['admin', 'user']
      }, // Render component dynamically according to platform
      component: HighlightMobileView
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
      path: '/groupcollection',
      name: 'groucollection',
      meta: {
        layout: 'b',
        title: 'group collection Page',
      },
      component: groupCollection
    },    
    {
      path: '/personal',
      name: 'personal',
      meta: {
        layout: 'b',
        title: 'personal',
      },
      component: personalPage,
      children: web_personal_children,
    },
  ]
})


router.beforeEach((to, from, next) => {
  if (to.meta.auth && (to.meta.auth as string[]).length > 0) {
    const authStore = useAuthStore()
    if (authStore.isTokenValid) {
      next()
    } else {
      const accessToken = localStorage.getItem('accessToken')
      console.log(accessToken)
      if (accessToken) {
        getUserByToken(accessToken).then((apiRes) => {
          console.log(apiRes)
          if (apiRes.success) {
            next()
          } else {
            next('/')
          }
        })
      } else {
        next('/')
      }
    }
  } else {
    next()
  }
})

export default router
