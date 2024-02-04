<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
const route = useRoute()
// 配置布局
const layout = computed(
  () => 'layout-' + ((route.meta.layout as string) || 'default').toLowerCase()
)
</script>

<!--App.vue-->
<template>
  <!-- Component Library Config Provider-->
  <a-config-provider>
    <!--    Layout & Router View-->
    <component :is="layout"> </component>
    <!--    Layout & Router View-->
  </a-config-provider>
  <!-- Component Library Config Provider-->
</template>

<style scoped></style>
