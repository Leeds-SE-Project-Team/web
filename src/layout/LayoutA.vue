<script setup lang="ts">
import ASider from '../components/sider/ASider.vue'
import AHeader from '../components/header/AHeader.vue'
</script>

<template>
  <a-layout id="layout-a">
    <a-layout-header id="layout-a-header">
      <AHeader />
    </a-layout-header>
    <a-layout>
      <a-layout-sider id="layout-a-sider">
        <ASider />
      </a-layout-sider>
      <a-layout-content id="layout-a-content" class="border-3">
        <RouterView />
      </a-layout-content>
    </a-layout>
    <!-- <a-layout-footer>Footer</a-layout-footer> -->
  </a-layout>
</template>

<style scoped></style>
