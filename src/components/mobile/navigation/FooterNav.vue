<script setup lang="ts">
import { ref } from 'vue'

const active = ref('discover')
</script>

<template>
  <van-tabbar v-model="active">
    <van-tabbar-item icon="home-o" name="discover">discover</van-tabbar-item>
    <van-tabbar-item icon="search" dot name="plan">plan</van-tabbar-item>
    <van-tabbar-item icon="friends-o" badge="5" name="record">record</van-tabbar-item>
    <van-tabbar-item icon="setting-o" badge="20" name="profile">profile</van-tabbar-item>
    <van-tabbar-item icon="setting-o" badge="20" name="shop">shop</van-tabbar-item>
  </van-tabbar>
</template>
<style scoped></style>
