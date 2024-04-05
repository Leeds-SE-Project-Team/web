<script lang="ts" setup>
import { computed, inject, type Ref, ref } from 'vue'
import useLoading from '@/hooks/loading'
import { getCurrentLocation } from '@/utils'
import type { CreateTourSpotForm } from '@/apis/tour/spot'

const show = ref(false)
const spotTitle = ref('')
const props = defineProps<{
  imageUrl: string
}>()
// 基于类型
const emits = defineEmits<{
  (e: 'confirm', tourSpot: CreateTourSpotForm): void
}>()

const tourId = inject<Ref<number>>('tourId', ref(-1))

const locateLoading = useLoading(true)
const currentLocation = ref('')
const tourSpot = computed<CreateTourSpotForm>(() => ({
  location: currentLocation.value,
  title: spotTitle.value,
  imageUrl: props.imageUrl,
  tourId: tourId.value
}))

const handleOpened = () => {
  locateLoading.setLoading(true)
  getCurrentLocation()
    .then((res) => {
      currentLocation.value = (res.position.toArray() as any[]).join(',')
    })
    .finally(() => {
      locateLoading.setLoading(false)
    })
}
// const emits = defineEmits(['createSpot'])
const confirmButtonText = computed(() => (locateLoading.loading.value ? 'Locating...' : 'Confirm'))
defineExpose({ show })
</script>

<template>
  <van-dialog
    v-model:show="show"
    :confirmButtonDisabled="locateLoading.loading.value"
    :confirmButtonText="confirmButtonText"
    show-cancel-button
    title="Create Highlight Spot"
    transition="van-slide-down"
    @confirm="emits('confirm', tourSpot)"
    @opened="handleOpened"
  >
    <van-cell-group inset>
      <van-field
        v-model="spotTitle"
        input-align="center"
        maxlength="20"
        placeholder="Enter a title"
      />
    </van-cell-group>
    <van-image :src="props.imageUrl" alt="highlight spot">
      <template v-slot:loading>
        <van-loading size="20" type="spinner" />
      </template>
    </van-image>
  </van-dialog>
</template>

<style scoped></style>
