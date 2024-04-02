<script lang="ts" setup>
import { ElAmap } from '@vuemap/vue-amap'
import { computed, ref } from 'vue'
import { hapticsImpactLight } from '@/utils'

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

const handleSelectPlace = (position: number[]) => {
  hapticsImpactLight()
  selectPos.value = position
}

const handleRightClick = (e: any) => {
  handleSelectPlace([e.lnglat.lat, e.lnglat.lng])
}

const selectPos = computed({
  get: () => props.selectPoint,
  set: (value) => {
    emits('update:selectPoint', value)
  }
})
const props = defineProps<{
  selectPoint?: number[]
}>()
const emits = defineEmits(['update:selectPoint'])
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
      <el-amap-marker v-if="selectPos" :offset="[-10, -40]" :position="selectPos" :visible="true">
        <div>
          <img
            alt="marker"
            height="32px"
            src="//webapi.amap.com/theme/v1.3/markers/b/mark_bs.png"
            width="19px"
          />
        </div>
      </el-amap-marker>
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
