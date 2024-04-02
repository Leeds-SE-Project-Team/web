<script lang="ts" setup>
import { computed, reactive, ref } from 'vue'
import { hapticsImpactLight } from '@/utils'
import { useMapStore } from '@/stores/map'

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
const mapRef = ref()
const locationTrackList = ref<number[][]>([])
const mapStore = useMapStore()
const mapInit = () => {}

const zoom = ref(16)
const center = ref([116.412866, 39.88365])

const handleSelectPlace = (lnglat: AMap.LngLat) => {
  hapticsImpactLight()
  selectPos.value = [lnglat.lat, lnglat.lng]
  mapStore.getGeocoder().getAddress(lnglat, function (status, result) {
    if (status === 'complete' && result.info === 'OK') {
      // result为对应的地理位置详细信息
      sheetData.address = result.regeocode.formattedAddress
    }
  })
}

const handleRightClick = (e: any) => {
  handleSelectPlace(e.lnglat)
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

const sheetData = reactive({
  address: ''
})

defineExpose({
  sheetData
})
</script>

<template>
  <div id="map-container">
    <el-amap
      v-model:zoom="zoom"
      ref="mapRef"
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
