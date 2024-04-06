import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
// import { getUserByEmail } from '@/apis/user'

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref('root')
  const refreshAccessToken = (newToken: string) => {
    accessToken.value = newToken
  }

  const isTokenValid = ref(false)

  watch(
    () => accessToken.value,
    (value) => {
      validateToken(value).then((valid) => {
        isTokenValid.value = valid
      })
    }
  )

  const validateToken = async (token: string) => {
    // TODO: validate token
    return token !== undefined && token.length > 0
  }
  const handleLogout = () => {
    refreshAccessToken('')
  }

  return { accessToken, refreshAccessToken, isTokenValid, handleLogout }
})
