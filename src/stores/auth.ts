import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { getUserByToken } from '@/apis/user'
import { useUserStore } from '@/stores/user'
import { Message } from '@arco-design/web-vue'


export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref<string | null>(null)
  const refreshAccessToken = (newToken: string | null) => {
    accessToken.value = newToken
    if (newToken) {
      localStorage.setItem('accessToken', newToken)
    } else {
      localStorage.removeItem('accessToken')
    }
  }

  const isTokenValid = ref(false)

  const userStore = useUserStore()
  watch(
    () => accessToken.value,
    (value) => {
      validateToken(value).then((valid) => {
        isTokenValid.value = valid
        if (valid) {
          getUserByToken(value!)
            .then((apiRes) => {
              if (apiRes.success) {
                userStore.curUser = apiRes.data!
                refreshAccessToken(value)
              } else {
                throw apiRes.message
              }
            })
            .catch((e) => {
              Message.error({
                content: e,
                id: 'tokenValidation'
              })
              refreshAccessToken(null)
            })
        }
      })
    }
  )

  const validateToken = async (token: string | null) => {
    // TODO: validate token
    if (!token) {
      return false
    }
    return token.length > 0
  }
  const handleLogout = () => {
    refreshAccessToken('')
  }

  return { accessToken, refreshAccessToken, isTokenValid, handleLogout }
})
