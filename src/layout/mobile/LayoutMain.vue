<script setup lang="ts">
import AHeader from '@/components/header/AHeader.vue'
import FooterNav from '@/components/mobile/navigation/FooterNav.vue'
</script>

<template>
  <a-layout id="layout-a">
    <a-layout-header id="layout-a-header">
      <AHeader />
    </a-layout-header>
    <a-layout>
      <a-layout-content id="layout-a-content" class="border-3">
        <RouterView />
      </a-layout-content>
    </a-layout>
    <a-layout-footer><FooterNav />></a-layout-footer>
  </a-layout>
</template>

<style scoped></style>
