import { createRouter, createWebHistory } from 'vue-router'
import IndexView from '@/views/home/index.vue'
import HomeView from '@/views/home/HomeView.vue'
import LoginView from '@/views/login/index.vue'
import DiscoverView from '@/views/discover/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      meta: {
        title: '主页'
      },
      component: IndexView
    },
    {
      path: '/home',
      name: 'home',
      meta: {
        title: '探索',
        layout: 'a'
      },
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      meta: {
        title: '登录'
      },
      component: LoginView
    },
    {
      path: '/discover',
      name: 'discover',
      meta: {
        title: '发现',
      },
      component: DiscoverView
    }
  ]
})

export default router
