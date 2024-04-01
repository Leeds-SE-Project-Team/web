<script setup lang="ts">
import VueAMap, { ElAmap } from '@vuemap/vue-amap'
import { ref } from 'vue'
import type { TourSpot } from '@/apis/tour/spot'
import { hapticsImpactLight } from '@/utils'
import { showNotify } from 'vant'
import { Message } from '@arco-design/web-vue'

const getCurrentLocation = () => {
  ;(geolocationRef.value.$$getInstance() as AMap.Geolocation).getCurrentPosition((status, info) => {
    if (status === 'complete') {
      center.value = info.position.toArray()
      const arr = info.position.toArray()
      locationTrackList.value.push(arr)
      // Message.info(arr.toString())
    }
  })
}
const geolocationRef = ref()
const locationTrackList = ref<number[][]>([])

const mapInit = () => {}

const zoom = ref(16)
const center = ref([116.412866, 39.88365])

const handleSelectPlace = () => {
  hapticsImpactLight()
}

const handleRightClick = (e) => {
  Message.info({
    content: e.lnglat.toString()
  })
  handleSelectPlace()
}
</script>

<template>
  <div id="map-container">
    <el-amap
      v-model:zoom="zoom"
      :animateEnable="true"
      :center="center"
      :doubleClickZoom="false"
      :scrollWheel="true"
      mapStyle="amap://styles/fresh"
      @complete="getCurrentLocation"
      @init="mapInit"
      @rightclick="handleRightClick"
    >
      <el-amap-control-geolocation
        ref="geolocationRef"
        :circleOptions="{
          fillOpacity: 0,
          strokeOpacity: 0
        }"
      />
    </el-amap>
  </div>
</template>

<style scoped></style>
