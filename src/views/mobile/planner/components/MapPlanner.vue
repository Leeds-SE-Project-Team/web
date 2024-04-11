<script lang="ts" setup>
import { computed, reactive, ref, watch } from 'vue'
import { hapticsImpactLight } from '@/utils'
import { useMapStore } from '@/stores/map'
import { type CreateTourForm, parseLocation } from '@/apis/tour'
import useLoading from '@/hooks/loading'

const handleMapComplete = () => {
  emits('complete')
  getCurrentLocation()
}
const getCurrentLocation = () => {
  ;(geolocationRef.value.$$getInstance() as AMap.Geolocation).getCurrentPosition((status, info) => {
    if (status === 'complete') {
      center.value = info.position.toArray()
      mapStore.updateCurrentLocation(center.value)
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
  sheetData.loading = true
  selectPos.value = [lnglat.lng, lnglat.lat]
  center.value = [lnglat.lng, lnglat.lat]
  mapStore.getGeocoder().getAddress(lnglat, function (status: any, result: any) {
    if (status === 'complete' && result.info === 'OK') {
      // result为对应的地理位置详细信息
      sheetData.address = result.regeocode.formattedAddress
      sheetData.distance = parseFloat(
        (
          lnglat.distance(
            new AMap.LngLat(mapStore.currentLocation[0], mapStore.currentLocation[1])
          ) / 1000
        ).toFixed(2)
      )
    }
    sheetData.loading = false
  })
}

const handleRightClick = (e: any) => {
  hapticsImpactLight()

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
  tourData: CreateTourForm
}>()
const emits = defineEmits(['update:selectPoint', 'update-tourData', 'complete'])

const sheetData = reactive({
  address: '',
  loading: false,
  distance: 0
})

const labelOffset = [-16, -30]

const handleDragendStart = (e: any) => {
  const lnglat: AMap.LngLat = e.lnglat
  // let newTourData = _.cloneDeep(props.tourData)
  // newTourData.startLocation = `${lnglat.lng},${lnglat.lat}`
  emits('update-tourData', 'startLocation', `${lnglat.lng},${lnglat.lat}`)
}

const handleDragendEnd = (e: any) => {
  const lnglat: AMap.LngLat = e.lnglat
  // let newTourData = _.cloneDeep(props.tourData)
  // newTourData.endLocation = `${lnglat.lng},${lnglat.lat}`
  emits('update-tourData', 'endLocation', `${lnglat.lng},${lnglat.lat}`)
}

// const layers = reactive<any[]>([])
let layers: AMap.Overlay[] = []

const resultLoadingObj = useLoading()
const resultLoading = resultLoadingObj.loading
watch(props.tourData, (value) => {
  const mapInstance: AMap.Map = mapRef.value.$$getInstance()
  if (!value.startLocation) {
    value.startLocation = mapStore.currentLocation.join(',')
    return
  }
  if (mapRef.value && value.startLocation && value.endLocation) {
    resultLoadingObj.setLoading(true)
    mapStore
      .planRoute(
        parseLocation(props.tourData.startLocation),
        parseLocation(props.tourData.endLocation),
        props.tourData.type,
        mapRef.value.$$getInstance()
      )
      .then((result: any) => {
        layers = mapStore.drawRoute(mapInstance, result.routes[0], {
          lineOptions: { strokeStyle: 'dashed', strokeColor: 'green' }
        })
        navigationResult.value = result
      })
      .finally(() => {
        resultLoadingObj.setLoading(false)
      })
  } else {
    mapInstance.remove(layers)
    navigationResult.value = undefined
    // ;(mapRef.value.$$getInstance() as AMap.Map).clearMap()
  }
})

const navigationResult = ref()

defineExpose({
  sheetData,
  center,
  navigationResult,
  mapRef,
  resultLoading,
  handleSelectPlace
})
</script>

<template>
  <div id="map-container">
    <el-amap
      ref="mapRef"
      v-model:zoom="zoom"
      :WebGLParams="{
        preserveDrawingBuffer: true
      }"
      :animateEnable="true"
      :center="center"
      :doubleClickZoom="false"
      :scrollWheel="true"
      mapStyle="amap://styles/fresh"
      @complete="handleMapComplete"
      @init="mapInit"
      @rightclick="handleRightClick"
    >
      <el-amap-marker v-if="selectPos" :position="selectPos" :visible="true">
        <div>
          <img
            alt="marker"
            height="32px"
            src="//webapi.amap.com/theme/v1.3/markers/b/mark_bs.png"
            width="19px"
          />
        </div>
      </el-amap-marker>
      <el-amap-marker
        v-if="
          !navigationResult &&
          tourData.startLocation &&
          tourData.startLocation !== mapStore.currentLocation.join(',')
        "
        :draggable="true"
        :label="{ content: 'A', offset: labelOffset }"
        :position="parseLocation(tourData.startLocation)"
        :visible="true"
        @dragend="handleDragendStart"
      >
        <div>
          <img
            alt="marker"
            height="32px"
            src="//webapi.amap.com/theme/v1.3/markers/n/mark_rs.png"
            width="19px"
          />
        </div>
      </el-amap-marker>
      <el-amap-marker
        v-if="!navigationResult && tourData.endLocation"
        :draggable="true"
        :label="{ content: 'B', offset: labelOffset }"
        :position="parseLocation(tourData.endLocation)"
        :visible="true"
        @dragend="handleDragendEnd"
      >
        <div>
          <img
            alt="marker"
            height="32px"
            src="//webapi.amap.com/theme/v1.3/markers/n/mark_rs.png"
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
        style="z-index: -1"
      />
    </el-amap>
  </div>
</template>

<style scoped></style>
