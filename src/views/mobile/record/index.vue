<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { ElAmap } from '@vuemap/vue-amap'
import {
  createTourHighlight,
  type CreateTourHighlightForm,
  deleteTourHighlight,
  getTourHighlights,
  type TourHighlight
} from '@/apis/tour/highlight'
import { showNotify, showToast } from 'vant'
import {
  fetchTourDataJson,
  getTourById,
  parseLocation,
  parseLocationNumber,
  type TourRecord,
  TourType
} from '@/apis/tour'
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
        fetchTourDataJson(tourData.value).then((res) => {
          const result = res.data
          mapStore.drawRoute(
            mapRef.value.$$getInstance(),
            tourData.value!.type === TourType.PUBLIC ? result.plans[0] : result.routes[0],
            tourData.value!.type,
            {
              lineOptions: { strokeStyle: 'dashed', strokeColor: 'green' }
            }
          )
        })
        // mapStore.drawRoute(mapRef.value.$$getInstance(), result.routes[0], {
        //   lineOptions: { strokeStyle: 'dashed', strokeColor: 'green' }
        // })
        // mapStore
        //   .planRoute(
        //     parseLocation(tourData.value.startLocation),
        //     parseLocation(tourData.value.endLocation),
        //     tourData.value.type,
        //     mapRef.value.$$getInstance()
        //   )
        //   .then((result) => {
        //     mapStore.drawRoute(mapRef.value.$$getInstance(), result.routes[0], {
        //       lineOptions: { strokeStyle: 'dashed', strokeColor: 'green' }
        //     })
        //   })
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
const highlightList = ref<TourHighlight[]>([])
const fetchHighlightList = () => {
  getTourHighlights().then((apiRes) => {
    if (apiRes.success) {
      highlightList.value = apiRes.data!
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

let layers: AMap.Overlay[] = []

const getCurrentLocation = (toCenter?: boolean) => {
  ;(geolocationRef.value.$$getInstance() as AMap.Geolocation).getCurrentPosition((status, info) => {
    if (status === 'complete') {
      if (toCenter === true) {
        center.value = info.position.toArray()
      }
      ;(mapRef.value.$$getInstance() as AMap.Map).remove(layers)
      locationTrackList.value.push(info.position)
      const len = locationTrackList.value.length
      if (len >= 2) {
        showToast({
          className: 'test_record',
          duration: 0,
          message: `Record num: ${len}\nPosition: ${locationTrackList.value[len - 1].toString()}\nDifference: ${locationTrackList.value[len - 1].lng - locationTrackList.value[len - 2].lng},${locationTrackList.value[len - 1].lat - locationTrackList.value[len - 2].lat}\n\n${JSON.stringify(info, null, 2)}`
        })
      }

      setTimeout(() => {
        layers = mapStore.drawRoute(
          mapRef.value.$$getInstance(),
          locationTrackList.value,
          tourData.value!.type,
          {
            startMarker: false,
            endMarker: false,
            reCenter: false
          },
          true
        )
      }, 500)
    }
  })
}

const handleCreateHighlight = (form: CreateTourHighlightForm) => {
  showNotify({ type: 'primary', message: 'uploading image...' })
  uploadFileFromURL(form.imageUrl, `/tour/${tourId}/highlights`)
    .then((uploadRes) => {
      if (uploadRes.success) {
        createTourHighlight({
          ...form,
          imageUrl: import.meta.env.APP_SERVER_URL + uploadRes.data!,
          tourId: tourId
        })
          .then((apiRes) => {
            if (apiRes.success) {
              // highlightList.value.push(apiRes.data!)
              fetchHighlightList()
              moveToPosition(parseLocationNumber(form.location))
              showNotify({ type: 'success', message: apiRes.message })
            } else {
              showNotify({ type: 'primary', message: apiRes.message })
            }
          })
          .catch((e) => {
            showNotify({ type: 'danger', message: e })
          })
      } else {
        showNotify({ type: 'danger', message: uploadRes.message })
      }
    })
    .catch((e) => {
      showNotify({ type: 'danger', message: e })
    })
    .finally(() => {})
}

defineExpose({
  handleCreateHighlight
})

const getLocation = (e: any) => {
  // console.log('getLocation: ', e)
}

const geolocationRef = ref()

const highlightPanelAnchors = [
  0,
  Math.round(0.46 * window.innerHeight),
  Math.round(0.7 * window.innerHeight)
]
const highlightPanelHeight = ref(highlightPanelAnchors[0])

const handleClickHighlight = (highlight: TourHighlight) => {
  console.log(highlight)
  selectedHighlight.value = highlight
  showHighlightSheet.value = true
  // const [x, y] = parseLocationNumber(highlight.location)
  // moveToPosition([x, y - 0.002])
  // highlightPanelHeight.value = highlightPanelAnchors[1]
}

const deleteHighlightLoadingObj = useLoading()
const handleDeleteHighlight = () => {
  if (!selectedHighlight.value) {
    return
  }
  deleteHighlightLoadingObj.setLoading(true)
  deleteTourHighlight(selectedHighlight.value.id)
    .then((apiRes) => {
      if (apiRes.success) {
        showNotify({ type: 'success', message: apiRes.message })
        selectedHighlight.value = undefined
        fetchHighlightList()
      } else {
        showNotify({ type: 'primary', message: apiRes.message })
      }
    })
    .finally(() => {
      deleteHighlightLoadingObj.setLoading(false)
    })
}

const moveToPosition = (position: number[]) => {
  center.value = position
  zoom.value = 16
}

const selectedHighlight = ref<TourHighlight | undefined>()
watch(selectedHighlight, (value) => {
  if (value) {
    console.log('selectedHighlight', value)
    const [x, y] = parseLocationNumber(value.location)
    moveToPosition([x, y])
    // moveToPosition([x, y - 0.002])
    // highlightPanelHeight.value = highlightPanelAnchors[1]
    showHighlightSheet.value = true
  } else {
    showHighlightSheet.value = false
  }
})

// watch(highlightPanelHeight, (value) => {
//   handleHeightChange(value)
// })

const handleCloseHighlightAction = () => {
  if (selectedHighlight.value) {
    moveToPosition(parseLocationNumber(selectedHighlight.value.location))
  }
  // selectedHighlight.value = undefined
}
const showHighlightSheet = ref(false)
// const handleHeightChange = debounce((height: number) => {
//   if (height === highlightPanelAnchors[0]) {
//     if (selectedHighlight.value) {
//       moveToPosition(parseLocationNumber(selectedHighlight.value.location))
//     }
//     selectedHighlight.value = undefined
//   }
// }, 100)

const locationTrackList = ref<AMap.LngLat[]>([])

// const polyline = computed(() => ({
//   path: locationTrackList.value.length > 0 ? locationTrackList.value : undefined,
//   // path: locationTrackList.value,
//   editable: false,
//   visible: true,
//   draggable: false
// }))

const handleClickLocation = () => {
  console.log('!')
}

onMounted(() => {
  window.setInterval(getCurrentLocation, 5000)
  fetchHighlightList()
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
        @complete="getCurrentLocation(true)"
        @init="mapInit"
      >
        <!--        <el-amap-polyline-->
        <!--          :draggable="polyline.draggable"-->
        <!--          :editable="polyline.editable"-->
        <!--          :path="polyline.path"-->
        <!--          :visible="polyline.visible"-->
        <!--        />-->

        <el-amap-marker
          v-for="(highlight, idx) in highlightList"
          :key="idx"
          :offset="[-10, -40]"
          :position="parseLocation(highlight.location)"
          :visible="true"
          @init="markerInit"
        >
          <div @click="handleClickHighlight(highlight)">
            <img
              :src="
                highlight.toursId.includes(tourId)
                  ? '//webapi.amap.com/theme/v1.3/markers/b/mark_bs.png'
                  : '//webapi.amap.com/theme/v1.3/markers/n/mark_rs.png'
              "
              alt="marker"
              height="32px"
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
          :pan-to-location="false"
          :visible="false"
          :zoom-to-accuracy="false"
        />
      </el-amap>
    </div>
    <van-action-sheet
      v-model:show="showHighlightSheet"
      :actions="[
        {
          name: 'Delete',
          color: 'red',
          callback: handleDeleteHighlight,
          loading: deleteHighlightLoadingObj.loading.value
        },
        {
          name: 'View',
          color: 'black',
          callback: () => {
            $router.push({ name: 'highlight' })
          },
          loading: deleteHighlightLoadingObj.loading.value
        }
      ]"
      @close="handleCloseHighlightAction"
      @closed="
        () => {
          selectedHighlight = undefined
        }
      "
    >
      <div
        v-if="selectedHighlight"
        :style="{
          backgroundImage: `url(${selectedHighlight?.tourImages[0].imageUrl})`
        }"
        class="blurImageContainer"
      ></div>
      <div style="text-align: center; padding: 0; order: 1">
        <!--        <h2>Highlight Highlight</h2>-->
        <van-image
          :src="selectedHighlight?.tourImages[0].imageUrl"
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
