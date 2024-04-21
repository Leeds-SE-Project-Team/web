<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { type FieldRule, Message } from '@arco-design/web-vue'
import { checkEmail } from '@/utils'
import useLoading from '@/hooks/loading'
import { checkUserExist } from '@/apis/user'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores'

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

const router = useRouter()
const authStore = useAuthStore()
const handleClickAdmin = () => {
  Message.success('Welcome: Admin')
  authStore.refreshAccessToken('root')
  router.push({ name: 'dashboard' })
}
</script>

<template>
  <a-space :size="25" class="main-content-inner-container" direction="vertical">
    <a-row><h4 class="account-title">Sign up or log in to continue</h4></a-row>
    <a-row
      ><p class="account-subtitle">Create a new account or log in to an existing one.</p></a-row
    >
    <a-row>
      <a-form
        ref="formRef"
        :model="form"
        layout="vertical"
        scroll-to-first-error
        @submit="handleClickContinue"
      >
        <a-form-item :rules="emailRules" field="email" label="Enter your email address:">
          <a-input v-model="form.email" placeholder="e.g you@example.com" />
        </a-form-item>
        <a-form-item>
          <a-button :loading="loading" class="account-main-btn" html-type="submit">
            <span class="btn-icon">
              <img alt="email" src="@/assets/email.svg" />
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
      <a-button class="admin-btn" @click="handleClickAdmin"
        ><span class="admin-btn-text">Admin</span></a-button
      >
    </a-row>
  </a-space>
</template>

<style scoped></style>
