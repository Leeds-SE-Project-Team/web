<script setup lang="ts">
import { RouterView } from 'vue-router'
import ASider from "../components/ASider.vue";
import AHeader from "../components/header/AHeader.vue"
</script>

<template>
  <a-layout class="show-border" id="layout-a">
    <a-layout-header class="border-1" id="layout-a-header">
      <AHeader />
    </a-layout-header>
    <a-layout>
      <a-layout-sider id="layout-a-sider" >
        <ASider />
      </a-layout-sider>
      <a-layout-content id="layout-a-content" class="border-3">
        <RouterView/>
      </a-layout-content>
    </a-layout>
    <!-- <a-layout-footer>Footer</a-layout-footer> -->
  </a-layout>
</template>

<style scoped>
.border-1 {
  height: 3rem;
}
</style>
