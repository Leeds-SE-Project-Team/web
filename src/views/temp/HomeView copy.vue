<script setup lang="ts">
import MapContainer from '@/components/map/MapContainer.vue'
import { ref } from 'vue'
const map = ref()
</script>

<template>
  <div id="home">
    <div class="title">轨迹回放测试</div>
    <MapContainer ref="map" />
    <div class="input-card">
      <a-space size="large">
        <a-button @click="map.startAnimation()">开始动画</a-button>
        <a-button @click="map.pauseAnimation()">暂停动画</a-button>
        <a-button @click="map.resumeAnimation()">继续动画</a-button>
        <a-button @click="map.stopAnimation()">停止动画</a-button>
      </a-space>
    </div>
  </div>
</template>
