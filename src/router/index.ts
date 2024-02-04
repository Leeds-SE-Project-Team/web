import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/home/HomeView.vue'
import LoginView from '@/views/login/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/home',
      name: 'home',
      meta: {
        title: '主页',
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
    }
  ]
})

export default router
