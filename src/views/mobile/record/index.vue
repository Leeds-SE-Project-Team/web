<script setup lang="ts">
import RecordMap from '@/views/mobile/record/components/RecordMap.vue'
import { ref } from 'vue'
const recordMap = ref()
</script>

<template>
  <div id="page-record"><RecordMap ref="recordMap" /></div>
</template>

<style scoped></style>

<script lang="ts">
export default {
  name: 'MobileRecord'
}
</script>
