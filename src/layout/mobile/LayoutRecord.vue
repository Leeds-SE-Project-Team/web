<script lang="ts" setup>
import AHeader from '@/components/header/AHeader.vue'
import RecordFooter from '@/components/mobile/footer/RecordFooter.vue'
import CreateSpotModal from '@/views/mobile/record/components/CreateSpotModal.vue'
import { provide, ref } from 'vue'
import { type CreateTourSpotForm } from '@/apis/tour/spot'

const imageUrl = ref('')

const handleShowCreateSpot = (url: string) => {
  createSpotRef.value.show = true
  imageUrl.value = url
}
const createSpotRef = ref()
const recordMapRef = ref()
const handleConfirm = (tourSpotForm: CreateTourSpotForm) => {
  recordMapRef.value.handleCreateSpot(tourSpotForm)
}

const tourId = ref(1)
provide('tourId', tourId)
</script>

<template>
  <a-layout id="layout-a">
    <a-layout-header id="layout-a-header" class="border-1">
      <AHeader />
    </a-layout-header>
    <a-layout>
      <a-layout-content id="layout-b-content" class="border-1">
        <RouterView v-slot="{ Component }">
          <component :is="Component" ref="recordMapRef" />
        </RouterView>
      </a-layout-content>
    </a-layout>
    <a-layout-footer>
      <RecordFooter @create-spot="handleShowCreateSpot" />
    </a-layout-footer>
    <!-- <a-layout-footer>Footer</a-layout-footer> -->
  </a-layout>
  <CreateSpotModal ref="createSpotRef" :image-url="imageUrl" @confirm="handleConfirm" />
</template>

<style scoped></style>
