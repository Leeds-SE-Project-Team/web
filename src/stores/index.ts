import { createPinia } from 'pinia'
import useAppStore from './app'
import { useUserStore } from './user'
import { useMapStore } from './map'
import { useAuthStore } from './auth'
// import useTabBarStore from './modules/tab-bar'

const pinia = createPinia()

export { useAppStore, useUserStore, useMapStore, useAuthStore }
export default pinia
