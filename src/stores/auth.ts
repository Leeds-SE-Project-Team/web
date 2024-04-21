import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { getUserByToken } from '@/apis/user'
import { useUserStore } from '@/stores/user'
import { Message } from '@arco-design/web-vue'
import { useRoute, useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref<string | null>('root')
  // const accessToken = ref<string | null>(null)
  const refreshAccessToken = (newToken: string | null) => {
    if (newToken) {
      localStorage.setItem('accessToken', newToken)
    } else {
      localStorage.removeItem('accessToken')
    }
    accessToken.value = newToken
  }

  const isTokenValid = ref(false)

  const userStore = useUserStore()
  watch(
    () => accessToken.value,
    (value) => {
      if (value === 'root') {
        isTokenValid.value = true
        return
      }

      getUserByToken(value!)
        .then((apiRes) => {
          if (apiRes.success) {
            isTokenValid.value = true
            userStore.curUser = apiRes.data!
            refreshAccessToken(value)
          } else {
            throw apiRes.message
          }
        })
        .catch((e) => {
          // Message.error({
          //   content: e,
          //   id: 'tokenValidation'
          // })
          isTokenValid.value = false
          refreshAccessToken(null)
          // if (location.pathname !== '/') {
          //   Message.error({
          //     content: e,
          //     id: 'tokenValidation'
          //   })
          //   location.replace('/')
          // }
        })
      // validateToken(value).then((valid) => {
      //   if (valid) {
      //
      //   }
      // })
    }
  )

  const isAdmin = computed(() => accessToken.value === 'root')

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

  return { accessToken, refreshAccessToken, isTokenValid, handleLogout, isAdmin }
})
