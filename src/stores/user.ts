import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { UserRecord } from '@/apis/user'

export const useUserStore = defineStore('user', () => {
  const curUser = ref<UserRecord | undefined>()
  const getUserRecord = (): Promise<UserRecord> =>
    new Promise((resolve, reject) => {
      if (curUser.value !== undefined) {
        resolve(curUser.value)
      } else {
        reject('User not logged in')
      }
    })

  return { getUserRecord, curUser }
})
