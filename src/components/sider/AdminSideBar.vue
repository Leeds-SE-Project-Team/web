<template>
  <!--  <div class="logo border-4">-->
  <!--    &lt;!&ndash;    <div><a class="logo-img"></a></div>&ndash;&gt;-->
  <!--    后台管理系统-->
  <!--  </div>-->
  <!--  <a-menu :defaultOpenKeys="['1']" :defaultSelectedKeys="['0_1']" @menuItemClick="onClickMenuItem">-->
  <a-menu
    :selected-keys="[$route.meta.key]"
    @menuItemClick="onClickMenuItem"
    :auto-open-selected="true"
    :default-open-keys="['search']"
  >
    <a-menu-item
      key="dashboard"
      @click="$router.push({ name: 'dashboard' })"
      v-if="authStore.isAdmin"
    >
      <IconHome />
      首页
    </a-menu-item>

    <a-sub-menu key="search" v-if="authStore.isAdmin">
      <template #title>
        <span><IconCalendar />查询</span>
      </template>
      <a-menu-item key="searchUser" @click="$router.push({ name: 'searchUser' })"
        >用户管理</a-menu-item
      >
      <a-menu-item key="searchVideo" @click="$router.push({ name: 'searchVideo' })"
        >视频管理</a-menu-item
      >
    </a-sub-menu>

    <a-menu-item
      key="adminSetting"
      @click="$router.push({ name: 'adminSetting' })"
      v-if="authStore.isAdmin"
    >
      <IconSettings />
      备份
    </a-menu-item>

    <a-menu-item key="logView" @click="$router.push({ name: 'logView' })" v-if="authStore.isAdmin">
      <icon-schedule />
      日志
    </a-menu-item>

    <a-menu-item key="postVideo" @click="handleClickPost">
      <IconCalendar />
      发布视频
    </a-menu-item>

    <a-menu-item @click="$router.push({ name: 'discover' })">
      <IconRedo />
      返回Walcraft
    </a-menu-item>
  </a-menu>
</template>
<script setup lang="ts">
import { Message } from '@arco-design/web-vue'
import { useAuthStore, useUserStore } from '@/stores'
import { useRouter } from 'vue-router'
const userStore = useUserStore()
const authStore = useAuthStore()

const onClickMenuItem = (key: string) => {
  // Message.info({ content: `You select ${key}`, showIcon: true })
}
const router = useRouter()

const handleClickPost = () => {
  if (authStore.isAdmin) {
    Message.info({
      id: 'handleClickPost',
      content: '需要用户登录才能发布视频'
    })
    // mainStore.setGoToPost(true)
  } else {
    Message.info({
      id: 'handleClickPost',
      content: 'Unavailable'
    })
    // router.push({ name: 'postVideo' })
  }
}
</script>
