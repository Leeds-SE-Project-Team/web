<script setup lang="ts">
import { reactive } from 'vue'

const form = reactive({
  email: '',
  post: '',
  isRead: false
})
</script>

<template>
  <div id="account-main" class="show-border">
    <main class="container">
      <div class="header-logo content-container">
        <a-image src="/logo/green-transparent.png" class="logo"></a-image>
      </div>
      <div class="main-content-container content-container">
        <a-space direction="vertical" :size="25" class="main-content-inner-container">
          <a-row><h4 class="account-title">Sign up or log in to continue</h4></a-row>
          <a-row
            ><p class="account-subtitle">
              Create a new account or log in to an existing one.
            </p></a-row
          >
          <a-row>
            <a-form :model="form" layout="vertical">
              <a-form-item field="name" label="Enter your email address:">
                <a-input v-model="form.email" placeholder="e.g you@example.com" />
              </a-form-item>
              <!--              <a-form-item field="post" label="Post">-->
              <!--                <a-input v-model="form.post" placeholder="please enter your post..." />-->
              <!--              </a-form-item>-->
              <!--              <a-form-item field="isRead">-->
              <!--                <a-checkbox v-model="form.isRead"> I have read the manual </a-checkbox>-->
              <!--              </a-form-item>-->
              <a-form-item>
                <a-button class="account-main-btn">
                  <span class="btn-icon">
                    <img src="@/assets/email.svg" alt="email" />
                  </span>
                  <span class="btn-text">Continue with email</span>
                </a-button>
              </a-form-item>
            </a-form>
          </a-row>
          <a-row>
            <a-divider orientation="center">
              <div class="divider-container">
                <p>or</p>
              </div>
            </a-divider>
          </a-row>
          <a-row justify="center">
            <div class="admin-btn"><span class="admin-btn-text">Admin</span></div>
            <!--            <a-avatar :image-url="'/account/admin-blue.png'" class="admin-btn" />-->
          </a-row>
        </a-space>
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
