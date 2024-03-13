import { createRouter, createWebHistory } from 'vue-router'
import IndexView from '@/views/home/index.vue'
import HomeView from '@/views/home/HomeView.vue'
import LoginView from '@/views/login/index.vue'
import DiscoverMobileView from '@/views/mobile/discover/index.vue'
import DiscoverView from '@/views/discover/index.vue'
import PlannerView from '@/views/planner/index.vue'
import TourView from '@/views/tour/index.vue'
import { Capacitor } from '@capacitor/core'
import { MOBILE_ROUTES } from '@/router/mobile'

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
        layout: 'a'
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
        title: 'Discover Page'
      }, // Render component dynamically according to platform
      // component: DiscoverMobileView
      component: Capacitor.getPlatform() === 'web' ? DiscoverView : DiscoverMobileView
    },
    {
      path: '/plan',
      name: 'planner',
      meta: {
        title: 'Planner Page',
        layout: Capacitor.getPlatform() === 'web' ? 'b' : 'mobile-default'
      },
      component: PlannerView
    },
    {
      path: '/tour',
      name: 'tour',
      meta: {
        layout: 'b',
        title: 'Tour Page'
      },
      component: TourView
    }
  ]
})

export default router
