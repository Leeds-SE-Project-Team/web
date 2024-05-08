import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { UserRecord } from '@/apis/user'
import { adminUser, guestUser } from '@/apis/user'
import { useAuthStore } from '@/stores/auth'

export const useUserStore = defineStore('user', () => {
  const curUser = ref<UserRecord | undefined>()

  const getUserAvatar = computed(() =>
    curUser.value !== undefined
      ? curUser.value.avatar
      : useAuthStore().isAdmin
        ? adminUser.avatar
        : guestUser.avatar
  )

  const getUserNickname = computed(() =>
    curUser.value !== undefined
      ? curUser.value.nickname
      : useAuthStore().isAdmin
        ? adminUser.nickname
        : guestUser.nickname
  )

  const getUserRecord = (): Promise<UserRecord> =>
    new Promise((resolve, reject) => {
      if (curUser.value !== undefined) {
        resolve(curUser.value)
      } else {
        reject('User not logged in')
      }
    })

  return { getUserRecord, curUser, getUserAvatar, getUserNickname }
})
