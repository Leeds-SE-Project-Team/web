<script setup lang="ts">
import AHeader from '@/components/header/AHeader.vue'
import { RouterView } from 'vue-router'
</script>

<template>
  <a-layout id="layout-a">
    <a-layout-header class="border-1" id="layout-a-header">
      <AHeader />
    </a-layout-header>
    <a-layout>
      <a-layout-content class="border-1" id="layout-b-content">
        <RouterView />
      </a-layout-content>
    </a-layout>
    <!-- <a-layout-footer>Footer</a-layout-footer> -->
  </a-layout>
</template>

<style scoped></style>
