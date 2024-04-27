import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { getUserByToken, type UserRecord } from '@/apis/user'
import { useUserStore } from '@/stores/user'

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref<string | null>(null)
  // const accessToken = ref<string | null>(null)
  const refreshAccessToken = (newToken: string | null): Promise<UserRecord | void> =>
    new Promise((resolve, reject) => {
      if (accessToken.value !== newToken) {
        // update
        if (!newToken) {
          localStorage.removeItem('accessToken')
          resolve()
          return
        }

        if (newToken === 'root') {
          isTokenValid.value = true
          localStorage.setItem('accessToken', newToken)
          resolve()
          return
        }

        getUserByToken(newToken)
          .then((apiRes) => {
            if (apiRes.success) {
              isTokenValid.value = true
              userStore.curUser = apiRes.data!
              accessToken.value = newToken
              localStorage.setItem('accessToken', newToken)
              resolve(userStore.curUser)
            } else {
              throw apiRes.message
            }
          })
          .catch((e) => {
            localStorage.removeItem('accessToken')
            accessToken.value = null
            isTokenValid.value = false
            reject(e)
          })
      } else {
        resolve()
      }
    })

  const isTokenValid = ref(false)

  const userStore = useUserStore()
  // watch(
  //   () => accessToken.value,
  //   (value) => {
  //     // if (value === 'root') {
  //     //   isTokenValid.value = true
  //     //   return
  //     // }
  //
  //     getUserByToken(value!)
  //       .then((apiRes) => {
  //         if (apiRes.success) {
  //           isTokenValid.value = true
  //           userStore.curUser = apiRes.data!
  //           refreshAccessToken(value)
  //         } else {
  //           throw apiRes.message
  //         }
  //       })
  //       .catch((e) => {
  //         isTokenValid.value = false
  //         refreshAccessToken(null)
  //       })
  //   }
  // )

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
    location.replace('/')
  }

  return { accessToken, refreshAccessToken, isTokenValid, handleLogout, isAdmin }
})
