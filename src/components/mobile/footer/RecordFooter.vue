<script lang="ts" setup>
import { Camera, CameraResultType } from '@capacitor/camera'
import { computed, inject, type Ref } from 'vue'
import { useUserStore } from '@/stores'
import { UserType } from '@/apis/user'
import { showToast } from 'vant'

// const imageUrl = ref('blob:http://localhost:5173/a0900c7d-6ee0-4b62-bd6c-f99f419f0d1e')
const createHighlight = async () => {
  const image = await Camera.getPhoto({
    quality: 90,
    resultType: CameraResultType.DataUrl
  })
  const imageUrl = image.dataUrl
  emits('createHighlight', imageUrl)
  // console.log(image)
  // console.log(image.path)
  // // image.webPath will contain a path that can be set as an image src.
  // // You can access the original file using image.path, which can be
  // // passed to the Filesystem API to read the raw data of the image,
  // // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
  // if (image.webPath != null) {
  //   const imageUrl = image.webPath.replace(/(?<!http:)\/\//, '/')
  //   emits('createHighlight', imageUrl)
  // }
}

const emits = defineEmits(['createHighlight', 'saveTour', 'clickVIP'])

const pauseTour = inject('pauseTour') as Ref<boolean>

const togglePause = () => {
  pauseTour.value = !pauseTour.value
}

const user = computed(() => useUserStore().curUser)
</script>

<template>
  <a-button-group class="footer-btn-group" type="primary">
    <a-button class="footer-btn" @click="emits('saveTour')">STOP</a-button>

    <a-button class="footer-btn" type="text" @click="createHighlight">
      <template #icon>
        <icon-camera class="footer-icon" />
      </template>
    </a-button>
    <a-button class="footer-btn" type="text" @click="togglePause">
      <icon-play-arrow v-if="pauseTour" class="footer-icon" />
      <icon-pause v-else class="footer-icon" />
    </a-button>
    <a-button class="footer-btn" type="text">
      <img
        alt="email"
        src="@/assets/vip.svg"
        v-if="!user || user.type === UserType.VIP"
        @click="showToast('Already VIP')"
      />
      <icon-double-up class="footer-icon" @click="emits('clickVIP')" v-else />
    </a-button>
  </a-button-group>
</template>

<style scoped>
.tab-title {
  margin: -5px 0 3px 0;
  font-size: 10px;
}
</style>
