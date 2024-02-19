<script setup lang="ts">
import { reactive, ref } from 'vue'
import { type FieldRule, Message } from '@arco-design/web-vue'
import useLoading from '@/hooks/loading'
import { createUser } from '@/apis/user'

type Status = 'default' | 'signup' | 'login'
// type-based
const emits = defineEmits<{
  (e: 'change-status', status: Status, email: string): void
}>()
const clearEmail = () => {
  emits('change-status', 'default', '')
}

const props = defineProps<{
  signupEmail: string
}>()

const formRef = ref()
const nicknameRules = reactive<FieldRule>({
  required: true,
  validator: (value: string | undefined, cb: any) => {
    if (value === undefined || value.length === 0) {
      cb('Nickname cannot be empty')
    }
  }
})
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
const isReadRules = reactive<FieldRule>({
  validator: (value: string | undefined, cb: any) => {
    if (!value) {
      cb('Please read and confirm user manual')
    }
  }
})
const form = reactive({
  nickname: 'Walcraft' as string | undefined,
  password: undefined as string | undefined,
  isRead: false
})

const handleSignup = () => {
  formRef.value.validate((error: any) => {
    if (!error) {
      setLoading(true)
      createUser({
        nickname: form.nickname as string,
        email: props.signupEmail,
        password: form.password as string
      })
        .then((apiRes) => {
          if (apiRes.success) {
            // 注册成功
            // authStore.refreshAccessToken(apiRes.data as string)
            Message.success({
              id: 'signup',
              content: apiRes.message
            })
            emits('change-status', 'login', props.signupEmail)
            // router.push({ name: 'index' })
          } else {
            // 注册失败
            Message.info({
              id: 'signup',
              content: apiRes.message
            })
          }
        })
        .catch((e) => {
          Message.error({
            id: 'signup',
            content: e
          })
        })
        .finally(() => {
          setLoading(false)
        })
    }
  })
}

const { loading, setLoading } = useLoading()
</script>

<template>
  <a-space direction="vertical" :size="25" class="main-content-inner-container">
    <a-row><h4 class="account-title">Create a new account</h4></a-row>
    <a-row
      ><p class="account-subtitle">
        Welcome to walcraft! It looks like this is your first time here. Create a new account to
        continue.
      </p></a-row
    >
    <a-row>
      <a-tag closable size="large" @close="clearEmail" color="lime">
        <template #icon>
          <icon-email />
        </template>
        {{ props.signupEmail }}
      </a-tag>
    </a-row>
    <a-row>
      <a-form
        :model="form"
        layout="vertical"
        ref="formRef"
        scroll-to-first-error
        @submit="handleSignup"
      >
        <a-form-item field="nickname" label="Nickname" :rules="nicknameRules">
          <a-input
            v-model="form.nickname"
            placeholder="a sound nickname for yourself~"
            autocomplete
          />
        </a-form-item>
        <a-form-item field="password" label="Password" :rules="passwordRules">
          <a-input-password
            v-model="form.password"
            placeholder="please enter your password"
            autocomplete
          />
        </a-form-item>
        <a-form-item field="isRead" :rules="isReadRules">
          <a-checkbox v-model="form.isRead"> I have read the manual </a-checkbox>
        </a-form-item>
        <a-form-item>
          <a-button class="account-main-btn" html-type="submit" :loading="loading">
            <span class="btn-text">Sign up!</span>
          </a-button>
        </a-form-item>
      </a-form>
    </a-row>
  </a-space>
</template>

<style scoped></style>
