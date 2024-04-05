<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'
import { ElAmap } from '@vuemap/vue-amap'
import {
  createTourSpot,
  type CreateTourSpotForm,
  deleteTourSpot,
  getTourSpots,
  type TourSpot
} from '@/apis/tour/spot'
import { showNotify } from 'vant'
import { getTourById, parseLocation, parseLocationNumber, type TourRecord } from '@/apis/tour'
import { uploadFileFromURL } from '@/utils/file'
import { useRoute } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import { useMapStore } from '@/stores/map'
import useLoading from '@/hooks/loading'

const route = useRoute()
const tourId = parseInt(route.params.tourId as string)
const tourData = ref<TourRecord>()
const fetchTour = () => {
  if (tourId === -1) {
    showNotify({ type: 'primary', message: 'New adventure start!' })
    return
  }
  getTourById(tourId)
    .then((apiRes) => {
      if (apiRes.success) {
        tourData.value = apiRes.data!
        mapStore
          .planRoute(
            parseLocation(tourData.value.startLocation),
            parseLocation(tourData.value.endLocation),
            tourData.value.type,
            mapRef.value.$$getInstance()
          )
          .then((result) => {
            mapStore.drawRoute(mapRef.value.$$getInstance(), result.routes[0])
          })
      } else {
        Message.info(apiRes.message)
      }
    })
    .catch((e) => {
      Message.error(e)
    })
}
const mapRef = ref()
const mapStore = useMapStore()

const zoom = ref(16)
const spotList = ref<TourSpot[]>([])
const fetchSpotList = () => {
  getTourSpots().then((apiRes) => {
    if (apiRes.success) {
      spotList.value = apiRes.data!
    }
  })
}
const center = ref([116.412866, 39.88365])

const markerInit = (e) => {
  // console.log('marker init: ', e)
}

const mapInit = () => {
  // useGeolocation(geolocationOptions).then((res) => {
  //   res.getCurrentPosition().then((currentPosition) => {
  //     center.value = currentPosition.position.toArray()
  //   })
  // })
  fetchTour()
}

const getCurrentLocation = () => {
  ;(geolocationRef.value.$$getInstance() as AMap.Geolocation).getCurrentPosition((status, info) => {
    if (status === 'complete') {
      center.value = info.position.toArray()
      const arr = info.position.toArray()
      locationTrackList.value.push(arr)
    }
  })
}

const handleCreateSpot = (form: CreateTourSpotForm) => {
  showNotify({ type: 'primary', message: 'uploading image...' })
  uploadFileFromURL(form.imageUrl, `/tour/${form.tourId}/spots`)
    .then((uploadRes) => {
      if (uploadRes.success) {
        createTourSpot({
          ...form,
          imageUrl: import.meta.env.APP_SERVER_URL + uploadRes.data!,
          tourId: tourId
        })
          .then((apiRes) => {
            if (apiRes.success) {
              spotList.value.push(apiRes.data!)
              moveToPosition(parseLocationNumber(form.location))
              showNotify({ type: 'success', message: apiRes.message })
            } else {
              showNotify({ type: 'primary', message: apiRes.message })
            }
          })
          .catch((e) => {
            showNotify({ type: 'danger', message: e })
          })
      }
    })
    .catch((e) => {
      showNotify({ type: 'danger', message: e })
    })
    .finally(() => {
      console.log('over')
    })
}

defineExpose({
  handleCreateSpot
})

const getLocation = (e: any) => {
  // console.log('getLocation: ', e)
}

const geolocationRef = ref()

const spotPanelAnchors = [
  0,
  Math.round(0.46 * window.innerHeight),
  Math.round(0.7 * window.innerHeight)
]
const spotPanelHeight = ref(spotPanelAnchors[0])

const handleClickSpot = (spot: TourSpot) => {
  console.log(spot)
  selectedSpot.value = spot
  showSpotSheet.value = true
  // const [x, y] = parseLocationNumber(spot.location)
  // moveToPosition([x, y - 0.002])
  // spotPanelHeight.value = spotPanelAnchors[1]
}

const deleteSpotLoadingObj = useLoading()
const handleDeleteSpot = () => {
  if (!selectedSpot.value) {
    return
  }
  deleteSpotLoadingObj.setLoading(true)
  deleteTourSpot(selectedSpot.value.id)
    .then((apiRes) => {
      if (apiRes.success) {
        showNotify({ type: 'success', message: apiRes.message })
        selectedSpot.value = undefined
        fetchSpotList()
      } else {
        showNotify({ type: 'primary', message: apiRes.message })
      }
    })
    .finally(() => {
      deleteSpotLoadingObj.setLoading(false)
    })
}

const moveToPosition = (position: number[]) => {
  center.value = position
  zoom.value = 16
}

const selectedSpot = ref<TourSpot | undefined>()
watch(selectedSpot, (value) => {
  if (value) {
    const [x, y] = parseLocationNumber(value.location)
    moveToPosition([x, y])
    // moveToPosition([x, y - 0.002])
    // spotPanelHeight.value = spotPanelAnchors[1]
    showSpotSheet.value = true
  } else {
    showSpotSheet.value = false
  }
})

// watch(spotPanelHeight, (value) => {
//   handleHeightChange(value)
// })

const handleCloseSpotAction = () => {
  if (selectedSpot.value) {
    moveToPosition(parseLocationNumber(selectedSpot.value.location))
  }
  // selectedSpot.value = undefined
}
const showSpotSheet = ref(false)
// const handleHeightChange = debounce((height: number) => {
//   if (height === spotPanelAnchors[0]) {
//     if (selectedSpot.value) {
//       moveToPosition(parseLocationNumber(selectedSpot.value.location))
//     }
//     selectedSpot.value = undefined
//   }
// }, 100)

const locationTrackList = ref<number[][]>([])

const polyline = computed(() => ({
  path: locationTrackList.value.length > 0 ? locationTrackList.value : undefined,
  // path: locationTrackList.value,
  editable: false,
  visible: true,
  draggable: false
}))

onMounted(() => {
  window.setInterval(getCurrentLocation, 3000)
  fetchSpotList()
})

// onMounted(() => {
//   let id
//   let target
//   let options
//
//   function success(pos) {
//     const crd = pos.coords
//
//     console.log(pos)
//
//     if (target.latitude === crd.latitude && target.longitude === crd.longitude) {
//       console.log('Congratulations, you reached the target')
//       navigator.geolocation.clearWatch(id)
//     }
//   }
//
//   function error(err) {
//     console.error(`ERROR(${err.code}): ${err.message}`)
//   }
//
//   target = {
//     latitude: 0,
//     longitude: 0
//   }
//
//   options = {
//     enableHighAccuracy: false,
//     timeout: 5000,
//     maximumAge: 0
//   }
//
//   console.log('start')
//   id = navigator.geolocation.watchPosition(success, error, options)
// })
</script>

<template>
  <div id="page-record">
    <div id="map-container">
      <el-amap
        ref="mapRef"
        v-model:zoom="zoom"
        :animateEnable="true"
        :center="center"
        :doubleClickZoom="false"
        :scrollWheel="true"
        mapStyle="amap://styles/fresh"
        @complete="getCurrentLocation"
        @init="mapInit"
      >
        <el-amap-polyline
          :draggable="polyline.draggable"
          :editable="polyline.editable"
          :path="polyline.path"
          :visible="polyline.visible"
        />

        <el-amap-marker
          v-for="(spot, idx) in spotList"
          :key="idx"
          :offset="[-10, -40]"
          :position="parseLocation(spot.location)"
          :visible="true"
          @init="markerInit"
        >
          <div @click="handleClickSpot(spot)">
            <img
              :src="
                tourId === spot.tourId
                  ? '//webapi.amap.com/theme/v1.3/markers/b/mark_bs.png'
                  : '//webapi.amap.com/theme/v1.3/markers/n/mark_rs.png'
              "
              alt="marker"
              height="32px"
              width="19px"
            />
          </div>
        </el-amap-marker>

        <!--        <el-amap-marker-->
        <!--          v-for="(spot, idx) in spotList"-->
        <!--          :key="idx"-->
        <!--          :position="parseLocation(spot.location)"-->
        <!--        />-->
        <el-amap-control-geolocation
          ref="geolocationRef"
          :circleOptions="{
            fillOpacity: 0,
            strokeOpacity: 0
          }"
          @complete="getLocation"
        />
      </el-amap>
    </div>
    <van-action-sheet
      v-model:show="showSpotSheet"
      :actions="[
        {
          name: 'Delete',
          color: 'red',
          callback: handleDeleteSpot,
          loading: deleteSpotLoadingObj.loading.value
        }
      ]"
      @close="handleCloseSpotAction"
      @closed="
        () => {
          selectedSpot = undefined
        }
      "
    >
      <div
        v-if="selectedSpot"
        :style="{
          backgroundImage: `url(${selectedSpot?.tourImages[0].imageUrl})`
        }"
        class="blurImageContainer"
      ></div>
      <div style="text-align: center; padding: 0; order: 1">
        <!--        <h2>Highlight Spot</h2>-->
        <van-image
          :src="selectedSpot?.tourImages[0].imageUrl"
          height="270"
          style="margin-top: 20px"
        />
        <van-divider dashed style="color: wheat; font-size: 25px">TOUR HIGHLIGHT</van-divider>
      </div>
      <template #cancel>Close</template>
      <template #action="{ action }">
        <div style="order: 3">{{ action.name }}</div>
      </template>
    </van-action-sheet>
  </div>
</template>

<style lang="scss" scoped>
:deep(.van-action-sheet__item) {
  //background: white;
  order: 2;
}

:deep(.van-floating-panel__content) {
  background: transparent;
}

:deep(.van-action-sheet__content) {
  display: flex !important;
  flex-direction: column;
}

.blurImageContainer {
  //background: red;
  border: thin solid red;
  background-size: cover;
  background-repeat: no-repeat;
  //background-position-y: 20px;
  //border: thick solid white;
  //height: 375px;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0px;
  z-index: -1;
  filter: blur(6px);
  //display: none;
}
</style>

<script lang="ts">
export default {
  name: 'MobileRecord'
}
</script>
