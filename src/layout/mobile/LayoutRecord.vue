<script lang="ts" setup>
import AHeader from '@/components/header/AHeader.vue'
import RecordFooter from '@/components/mobile/footer/RecordFooter.vue'
import CreateHighlightModal from '@/views/mobile/record/components/CreateHighlightModal.vue'
import { provide, ref } from 'vue'
import { type CreateTourHighlightForm } from '@/apis/tour/highlight'

const imageUrl = ref('')

const handleShowCreateHighlight = (url: string) => {
  createHighlightRef.value.show = true
  imageUrl.value = url
}
const createHighlightRef = ref()
const recordMapRef = ref()
const handleConfirm = (tourHighlightForm: CreateTourHighlightForm) => {
  recordMapRef.value.handleCreateHighlight(tourHighlightForm)
}

const tourId = ref(-1)
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
      <RecordFooter @create-highlight="handleShowCreateHighlight" />
    </a-layout-footer>
    <!-- <a-layout-footer>Footer</a-layout-footer> -->
  </a-layout>
  <CreateHighlightModal ref="createHighlightRef" :image-url="imageUrl" @confirm="handleConfirm" />
</template>

<style scoped></style>
