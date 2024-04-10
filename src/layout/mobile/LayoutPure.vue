<script setup lang="ts">
import AHeader from '@/components/header/AHeader.vue'
import FooterNav from '@/components/mobile/navigation/FooterNav.vue'
</script>

<template>
  <a-layout>
    <a-layout>
      <a-layout-content>
        <RouterView />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<style scoped></style>
