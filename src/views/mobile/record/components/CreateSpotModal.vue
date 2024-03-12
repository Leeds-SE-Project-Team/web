<script setup lang="ts">
import { ref } from 'vue'

const show = ref(true)
const spotTitle = ref('')
const props = defineProps<{
  imageUrl: string
}>()
defineExpose({ show })
</script>

<template>
  <van-dialog
    v-model:show="show"
    title="Create Highlight Spot"
    transition="van-slide-down"
    show-cancel-button
  >
    <van-cell-group inset>
      <van-field
        v-model="spotTitle"
        placeholder="Enter a title"
        input-align="center"
        maxlength="20"
      />
    </van-cell-group>
    <van-image :src="props.imageUrl" alt="highlight spot">
      <template v-slot:loading>
        <van-loading type="spinner" size="20" />
      </template>
    </van-image>
  </van-dialog>
</template>

<style scoped></style>
