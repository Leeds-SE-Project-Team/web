<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()
</script>

<template>
  <div style="display: flex; align-items: center; height: 100%">
    <a-result v-if="authStore.isTokenValid" :status="'success'" title="Login succeed!">
      <template #icon>
        <IconFaceSmileFill />
      </template>

      <template #extra>
        <a-button :type="'secondary'" @click="authStore.handleLogout">Log out</a-button>
        <a-button :type="'secondary'" @click="$router.push({ name: 'discover' })">发现</a-button>
      </template>
      <a-typography style="background: var(--color-fill-2); padding: 24px">
        <a-typography-paragraph>Access token:</a-typography-paragraph>
        {{ authStore.accessToken }}
      </a-typography>
    </a-result>

    <a-result v-else :status="'info'" title="Welcome to walcraft">
      <template #icon>
        <icon-info />
      </template>
      <template #subtitle>You haven't logged in an account</template>

      <template #extra>
        <a-button type="primary" @click="$router.push({ name: 'login' })">Login</a-button>
      </template>
    </a-result>
  </div>
</template>

<script lang="ts">
export default {
  name: 'IndexView'
}
</script>
