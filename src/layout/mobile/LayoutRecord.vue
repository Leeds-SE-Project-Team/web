<script setup lang="ts">
import AHeader from '@/components/header/AHeader.vue'
import RecordFooter from '@/components/mobile/footer/RecordFooter.vue'
import CreateSpotModal from '@/views/mobile/record/components/CreateSpotModal.vue'
import { ref } from 'vue'

const imageUrl = ref('')

const handleShowCreateSpot = (url: string) => {
  createSpotRef.value.show = true
  imageUrl.value = url
}
const createSpotRef = ref()
</script>

<template>
  <a-layout id="layout-a">
    <a-layout-header class="border-1" id="layout-a-header">
      <AHeader />
    </a-layout-header>
    <a-layout>
      <a-layout-content class="border-1" id="planner-content">
        <RouterView v-slot="{ Component }">
          <component ref="recordMap" :is="Component" />
        </RouterView>
      </a-layout-content>
    </a-layout>
    <a-layout-footer><RecordFooter @createSpot="handleShowCreateSpot" /></a-layout-footer>
    <!-- <a-layout-footer>Footer</a-layout-footer> -->
  </a-layout>
  <CreateSpotModal ref="createSpotRef" :image-url="imageUrl" />
</template>

<style scoped></style>
