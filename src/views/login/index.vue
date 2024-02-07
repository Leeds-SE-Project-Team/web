<script setup lang="ts">
import { reactive, ref } from 'vue'

import LoginDefault from '@/views/login/LoginDefault.vue'
import SignupView from '@/views/login/SignupView.vue'
import LoginView from '@/views/login/LoginView.vue'

type Status = 'default' | 'signup' | 'login'
const status = ref<Status>('default')

const curEmail = ref('')
const handleChangeStatus = (s: Status, email: string) => {
  status.value = s
  curEmail.value = email
}
</script>

<template>
  <div id="account-main" class="show-border">
    <main class="container">
      <div class="header-logo content-container">
        <a-image src="/logo/green-transparent.png" class="logo"></a-image>
      </div>
      <div class="main-content-container content-container">
        <LoginDefault v-if="status === 'default'" @change-status="handleChangeStatus" />
        <SignupView
          v-else-if="status === 'signup'"
          @change-status="handleChangeStatus"
          :signupEmail="curEmail"
        />
        <LoginView v-else @change-status="handleChangeStatus" :loginEmail="curEmail" />
      </div>
      <div class="footer content-container"></div>
    </main>
    <div class="cover"></div>
  </div>
</template>

<style scoped></style>

<script lang="ts">
export default {
  name: 'AccountMain'
}
</script>
