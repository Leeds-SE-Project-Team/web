<script setup lang="ts">
import AHeader from "../components/header/AHeader.vue"
import plannerSider from "../components/sider/plannerSider.vue"
</script>

<template>
  <a-layout id="layout-a">
    <a-layout-header class="border-1" id="layout-a-header">
      <AHeader />
    </a-layout-header>
    <a-layout>
      <a-layout-content class="border-1" id="planner-sider">
        <plannerSider />
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
