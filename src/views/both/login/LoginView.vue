<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { type FieldRule, Message } from '@arco-design/web-vue'
import useLoading from '@/hooks/loading'
import { authPwdLogin } from '@/apis/auth'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { MD5 } from 'crypto-js'

type Status = 'default' | 'signup' | 'login'
// type-based
const emits = defineEmits<{
  (e: 'change-status', status: Status, email: string): void
}>()
const clearEmail = () => {
  emits('change-status', 'default', '')
}

const props = defineProps<{
  loginEmail: string
}>()

const formRef = ref()

const passwordRules = reactive<FieldRule>({
  required: true,
  validator: (value: string | undefined, cb: any) => {
    if (value === undefined || value.length === 0) {
      cb('Password cannot be empty')
      return
    }
    if (value.length < 6) {
      cb('Password must be at least six digits')
    }
  }
})

const form = reactive({
  password: undefined as string | undefined
})

const handleLogin = () => {
  formRef.value.validate((error: any) => {
    if (!error) {
      setLoading(true)
      authPwdLogin({
        email: props.loginEmail,
        password: MD5(form.password as string).toString()
      })
        .then((apiRes) => {
          if (apiRes.success) {
            // 登录成功
            authStore
              .refreshAccessToken(apiRes.data as string)
              .then(() => {
                Message.success({
                  id: 'login',
                  content: apiRes.message
                })
                router.push({ name: 'discover' })
              })
              .catch((e) => {
                Message.error({
                  id: 'login',
                  content: e
                })
              })
          } else {
            // 登录失败
            Message.info({
              id: 'login',
              content: apiRes.message
            })
          }
        })
        .catch((e) => {
          Message.error({
            id: 'login',
            content: e
          })
        })
        .finally(() => {
          // setLoading(false)
        })
    }
  })
}

const { loading, setLoading } = useLoading()
const authStore = useAuthStore()
const router = useRouter()
</script>

<template>
  <a-space :size="25" class="main-content-inner-container" direction="vertical">
    <a-row><h4 class="account-title">Welcome back</h4></a-row>
    <a-row><p class="account-subtitle">Log into your account</p></a-row>
    <a-row>
      <a-tag closable color="lime" size="large" @close="clearEmail">
        <template #icon>
          <icon-email />
        </template>
        {{ props.loginEmail }}
      </a-tag>
    </a-row>
    <a-row>
      <a-form
        ref="formRef"
        :model="form"
        layout="vertical"
        scroll-to-first-error
        @submit="handleLogin"
      >
        <a-form-item :rules="passwordRules" field="password" label="Password">
          <a-input-password
            v-model="form.password"
            autocomplete
            placeholder="please enter your password"
          />
        </a-form-item>
        <a-form-item>
          <a-button :loading="loading" class="account-main-btn" html-type="submit">
            <span class="btn-text">Log in</span>
          </a-button>
        </a-form-item>
      </a-form>
    </a-row>
  </a-space>
</template>

<style scoped></style>
