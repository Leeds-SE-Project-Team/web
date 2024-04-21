<template>
  <a-carousel
    auto-play
    indicator-type="slider"
    show-arrow="hover"
    style="width: 100%; height: 170px; border-radius: 4px; overflow: hidden"
  >
    <a-carousel-item v-for="(src, idx) in imageSrc" :key="idx">
      <div>
        <img :src="src" alt="logo" style="width: 100%" />
      </div>
    </a-carousel-item>
  </a-carousel>
</template>

<script lang="ts" setup>
import { getStaticRes } from '@/apis'

const imageSrc = [
  getStaticRes('/resource/logo/3.png'),
  getStaticRes('/resource/logo/1.png'),
  getStaticRes('/resource/logo/2.png'),
  getStaticRes('/resource/logo/4.png')
  // getStaticRes('/resource/logo/5.png')
]
</script>
