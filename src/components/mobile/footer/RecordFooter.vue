<script lang="ts" setup>
import { Camera, CameraResultType } from '@capacitor/camera'

// const imageUrl = ref('blob:http://localhost:5173/a0900c7d-6ee0-4b62-bd6c-f99f419f0d1e')
const takePicture = async () => {
  const image = await Camera.getPhoto({
    quality: 90,
    // allowEditing: true,
    resultType: CameraResultType.Uri
  })

  // image.webPath will contain a path that can be set as an image src.
  // You can access the original file using image.path, which can be
  // passed to the Filesystem API to read the raw data of the image,
  // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
  if (image.webPath != null) {
    const imageUrl = image.webPath.replace(/(?<!http:)\/\//, '/')
    emits('createSpot', imageUrl)
  }
}

const emits = defineEmits(['createSpot'])
</script>

<template>
  <van-action-bar style="padding: 0 20px 0 20px">
    <van-action-bar-icon @click="$router.push({ name: 'discover' })">
      <template #icon>
        <van-icon name="stop-circle" size="30" style="margin-top: 6px" />
      </template>
    </van-action-bar-icon>
    <van-action-bar-button
      style="margin: 0 10px 0 10px"
      text="Add Spot"
      type="primary"
      @click="takePicture"
    />
  </van-action-bar>
</template>

<style scoped>
.tab-title {
  margin: -5px 0 3px 0;
  font-size: 10px;
}
</style>
