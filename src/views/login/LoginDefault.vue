<script setup lang="ts">
import { reactive, ref } from 'vue'
import { type FieldRule, Message } from '@arco-design/web-vue'
import { checkEmail } from '@/utils'
import useLoading from '@/hooks/loading'
import { checkUserExist } from '@/apis/user'

type Status = 'default' | 'signup' | 'login'
// type-based
const emits = defineEmits<{
  (e: 'change-status', status: Status, email: string): void
}>()

const formRef = ref()
const emailRules = reactive<FieldRule>({
  required: true,
  validator: (value: string | undefined, cb: any) => {
    if (!value) {
      cb('Email cannot be empty')
    }
    if (!checkEmail(value)) {
      cb('Incorrect email format')
    }
  }
})
const form = reactive({
  email: 'walcraft@test.com' as string | undefined
  // email: undefined as string | undefined
})

const { loading, setLoading } = useLoading()
const handleClickContinue = () => {
  formRef.value.validateField('email', (error: any) => {
    if (!error) {
      const email = form.email as string
      setLoading(true)
      checkUserExist({
        email: email
      })
        .then((apiRes) => {
          if (apiRes.success) {
            // 用户已注册
            emits('change-status', 'login', email)
          } else {
            // 用户未注册
            emits('change-status', 'signup', email)
          }
        })
        .catch((e) => {
          Message.error(e)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  })
}
</script>

<template>
  <a-space direction="vertical" :size="25" class="main-content-inner-container">
    <a-row><h4 class="account-title">Sign up or log in to continue</h4></a-row>
    <a-row
      ><p class="account-subtitle">Create a new account or log in to an existing one.</p></a-row
    >
    <a-row>
      <a-form
        :model="form"
        layout="vertical"
        ref="formRef"
        scroll-to-first-error
        @submit="handleClickContinue"
      >
        <a-form-item field="email" label="Enter your email address:" :rules="emailRules">
          <a-input v-model="form.email" placeholder="e.g you@example.com" />
        </a-form-item>
        <a-form-item>
          <a-button class="account-main-btn" html-type="submit" :loading="loading">
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
      <a-button class="admin-btn" @click="Message.info('The feature is current unavailable')"
        ><span class="admin-btn-text">Admin</span></a-button
      >
    </a-row>
  </a-space>
</template>

<style scoped></style>
