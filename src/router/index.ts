import { createRouter, createWebHistory } from 'vue-router'
import IndexView from '@/views/home/index.vue'
import HomeView from '@/views/home/HomeView.vue'
import LoginView from '@/views/login/index.vue'
import DiscoverView from '@/views/discover/index.vue'
import PlannerView from '@/views/planner/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
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
        layout: 'b',
        title: 'Discover Page'
      },
      component: DiscoverView
    },
    {
      path: '/plan',
      name: 'planner',
      meta: {
        title: 'Planner Page',
        layout: 'b'
      },
      component: PlannerView
    }
  ]
})

export default router
