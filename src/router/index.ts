import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/home/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      meta: {
        title: '主页',
        layout: 'a'
      },
      component: HomeView
    },
    {
      path: '/signup',
      name: 'signUp',
      meta: {
        title: '注册',
        layout: 'a'
      },
      component: HomeView
    },
    {
      path: '/login',
      name: 'logIn',
      meta: {
        title: '登录',
        layout: 'a'
      },
      component: HomeView
    }
  ]
})

export default router
