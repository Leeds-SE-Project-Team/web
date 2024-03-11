<script setup lang="ts">
import { Camera, CameraResultType } from '@capacitor/camera'
import { Capacitor } from '@capacitor/core'
import { ref } from 'vue'
import { getStaticRes } from '@/apis'

const show = ref(true)
const imageUrl = ref('')
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
  console.log(JSON.stringify(image))
  if (image.path != null) {
    imageUrl.value = Capacitor.convertFileSrc(image.path) //TODO: 去掉双斜杠
  }
  show.value = true
}
</script>

<template>
  <van-dialog v-model:show="show" title="Highlight Spot Preview" show-cancel-button>
    <img :src="imageUrl" width="30" alt="highlight spot" />
  </van-dialog>
  <van-action-bar style="margin: 0 20px 0 20px">
    <!--    <van-action-bar-icon icon="chat-o" text="客服" @click="onClickIcon" />-->
    <!--    <van-action-bar-icon icon="pause" text="购物车" />-->
    <van-action-bar-icon @click="$router.push({ name: 'discover' })">
      <template #icon>
        <van-icon name="stop-circle" size="30" style="margin-top: 6px" />
      </template>
      <!--      <span class="tab-title">Stop</span>-->
    </van-action-bar-icon>
    <van-action-bar-button
      type="primary"
      text="Add Spot"
      style="margin: 0 10px 0 10px"
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
