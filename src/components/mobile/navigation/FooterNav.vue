<script lang="ts" setup>
// import type path from 'path';
import { ref } from 'vue'

const active = ref('discover')
</script>

<template>
  <van-tabbar
    id="mobile-footer-nav"
    v-model="active"
    :active-color="'#aadc64'"
    :border="false"
    :inactive-color="'#FFFFFF'"
    route
  >
    <van-tabbar-item :to="{ name: 'discover' }" badge="5" name="discover">
      <template #icon>
        <van-icon :size="18" name="star" />
      </template>
      <span class="tab-title">Discover</span>
    </van-tabbar-item>
    <van-tabbar-item :to="{ name: 'planner' }" name="plan">
      <template #icon>
        <van-icon :size="18" name="guide-o" />
      </template>
      <span class="tab-title">Plan</span>
    </van-tabbar-item>
    <van-tabbar-item :to="{ name: 'record', params: { tourId: -1 } }" dot name="record">
      <template #icon>
        <van-icon :size="18" name="add" />
      </template>
      <span class="tab-title">Record</span>
    </van-tabbar-item>
    <van-tabbar-item :to="{ path: '/personal' }" name="profile">
      <template #icon>
        <van-icon :size="18" name="contact" />
      </template>
      <span class="tab-title">Profile</span>
    </van-tabbar-item>
    <!--    <van-tabbar-item :to="{ name: 'highlight' }" dot name="highlight">-->
    <!--      <template #icon>-->
    <!--        <van-icon :size="18" name="setting" />-->
    <!--      </template>-->
    <!--      <span class="tab-title">Highlight</span>-->
    <!--    </van-tabbar-item>-->
  </van-tabbar>
</template>
<style lang="scss" scoped></style>
