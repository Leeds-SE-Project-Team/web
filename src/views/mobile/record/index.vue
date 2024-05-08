<script lang="ts" setup>
import { computed, inject, onMounted, onUnmounted, type Ref, ref, watch } from 'vue'
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
  calculateTourCalorie,
  fetchTourDataJson,
  getTourById,
  parseLocation,
  parseLocationNumber,
  type RecordData,
  type RecordDataInstant,
  saveTour,
  type SaveTourForm,
  type TourPlannedData,
  type TourRecord,
  TourState,
  TourType
} from '@/apis/tour'
import { uploadFileFromURL } from '@/utils/file'
import { useRoute, useRouter } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import { useMapStore } from '@/stores/map'
import useLoading from '@/hooks/loading'
import { cloneDeep } from 'lodash-es'
import { parseTimeToString } from '@/utils'
import dayjs from 'dayjs'
import { useUserStore } from '@/stores'
import { speechSynthesis } from '@/apis/others'
import { UserType } from '@/apis/user'

const route = useRoute()
const tourId = parseInt(route.params.tourId as string)
const tourData = ref<TourRecord>()

const locationTrackList = computed<RecordDataInstant[]>(() => saveTourForm.value.trackList)

const saveTourForm = ref<SaveTourForm>({
  recordData: {
    avgSpeed: 0,
    timeInMotion: 0,
    totalDistance: 0,
    timeTaken: 0,
    calorie: 0
  },
  tourId: tourId,
  trackList: []
})
const recordData = computed<RecordData>(() => saveTourForm.value.recordData)
const saveTourLoadingObj = useLoading()
const handleSaveTour = () => {
  saveTourLoadingObj.setLoading(true)
  saveTour({ ...saveTourForm.value, isComplete: true })
    .then((apiRes) => {
      if (apiRes.success) {
        showToast(apiRes.message)
        router.back()
      } else {
        throw apiRes.message
      }
    })
    .catch((e) => {
      Message.error(e)
    })
    .finally(() => {
      saveTourLoadingObj.setLoading(false)
    })
}

const pauseTour = inject('pauseTour') as Ref<boolean>
watch(
  () => pauseTour.value,
  (value) => {
    if (value) {
      speechSynthesis('行程已暂停')
    } else {
      speechSynthesis('行程已恢复')
      getCurrentLocation(true)
    }
  }
)

const prevRecordData = ref<RecordData>({
  avgSpeed: 0,
  timeInMotion: 0,
  totalDistance: 0,
  timeTaken: 0,
  calorie: 0
})
const updatePrevRecordData = () => {
  prevRecordData.value = cloneDeep(recordData.value)
}
// watch(recordData.value, (value) => {
//   prevRecordData.value = oldValue
// })

const maxSpeed = computed(() => Math.max(0, ...locationTrackList.value.map((track) => track.speed)))
const prevRecordDataInstant = computed(() =>
  locationTrackList.value.length > 1
    ? locationTrackList.value[locationTrackList.value.length - 2]
    : undefined
)
const currentRecordDataInstant = computed(() =>
  locationTrackList.value.length > 0
    ? locationTrackList.value[locationTrackList.value.length - 1]
    : undefined
)

const tourPlannedData = ref<TourPlannedData>()
const loadingTourObj = useLoading()
const fetchTour = () => {
  if (tourId === -1) {
    showNotify({ type: 'primary', message: 'New adventure start!' })
    return
  }

  loadingTourObj.setLoading(true)
  getTourById(tourId)
    .then((apiRes) => {
      if (apiRes.success) {
        tourData.value = apiRes.data!
        fetchTourDataJson(tourData.value)
          .then((res) => {
            const result = res[0].data.result

            if (tourData.value!.state !== TourState.UNFINISHED) {
              saveTourForm.value = res[1].data
              saveTourForm.value.trackList.forEach(
                (t) =>
                  (t.location = new AMap.LngLat(
                    (t.location as unknown as number[])[0],
                    (t.location as unknown as number[])[1]
                  ))
              )
            }

            tourPlannedData.value = res[0].data
            mapStore.drawRoute(
              mapRef.value.$$getInstance(),
              tourData.value!.type === TourType.PUBLIC ? result.plans[0] : result.routes[0],
              tourData.value!.type,
              {
                lineOptions: { strokeStyle: 'dashed', strokeColor: 'green' }
              }
            )
          })
          .finally(() => {
            loadingTourObj.setLoading(false)
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
        loadingTourObj.setLoading(false)
        router.back()
      }
    })
    .catch((e) => {
      Message.error(e)
    })
}

const router = useRouter()
const mapRef = ref()
const mapStore = useMapStore()

const zoom = ref(16)
const highlightList = ref<TourHighlight[]>([])
const fetchHighlightList = () => {
  getTourHighlights().then((apiRes) => {
    if (apiRes.success) {
      highlightList.value = apiRes.data!.filter((h) => h.tourImages.length > 0)
    }
  })
}
const center = ref([116.412866, 39.88365])

const markerInit = (e: any) => {}

const mapInit = () => {
  speechSynthesis('开始导航')
  fetchTour()
  fetchHighlightList()
  countTimeInterval = setInterval(handleCountTime, 1000)
  // fetchTour()
}

const TIME_INTERVAL = 1

let layers: AMap.Overlay[] = []
const countNotInMotion = ref(Infinity)
const isInMotion = computed(() => countNotInMotion.value < 10)

const handleCountTime = () => {
  if (!recordData.value || pauseTour.value) {
    return
  }

  recordData.value.timeTaken++
  if (isInMotion.value) {
    updatePrevRecordData()
    recordData.value.timeInMotion++
    recordData.value.avgSpeed =
      recordData.value.timeInMotion > 0
        ? parseFloat(
            ((recordData.value.totalDistance / recordData.value.timeInMotion) * 3.6).toFixed(2)
          )
        : 0
  }
}

const currentLineIndex = ref(-1)
const tourPlannedLines = computed(() => {
  if (tourPlannedData.value) {
    const result = tourPlannedData.value.result
    console.log(result)
    let lines = []
    switch (tourData.value!.type) {
      case TourType.WALK:
        lines = result.routes[0].steps
        break
      case TourType.CAR:
        lines = result.routes[0].steps
        break
      case TourType.CYCLING:
        lines = result.routes[0].rides
        break
    }
    return lines
  } else {
    return []
  }
})
const userStore = useUserStore()
const getLocationLoadObj = useLoading()

const getCurrentLocation = (toCenter?: boolean) => {
  if (pauseTour.value) {
    console.log('paused')
    return
  }

  if (!tourData.value) {
    if (!getLocationLoadObj.loading.value) {
      setTimeout(() => {
        console.log('re get')
        getCurrentLocation(true)
      }, 1000)
    }
    return
  }

  const geolocationInstance = geolocationRef.value.$$getInstance() as AMap.Geolocation
  if (getLocationLoadObj.loading.value || !geolocationInstance) {
    return
  }
  console.log('start')
  getLocationLoadObj.setLoading(true)
  geolocationInstance.getCurrentPosition((status, info: any) => {
    getLocationLoadObj.setLoading(false)
    if (status === 'complete') {
      console.log('stop', status)
      // weakGPS.value = info.accuracy > 30
      currentGPS.value = parseInt(info.accuracy)

      if (toCenter === true) {
        center.value = info.position.toArray()
      }
      // if (layers.length > 0) {
      //   ;(mapRef.value.$$getInstance() as AMap.Map).remove(layers)
      // }
      let recordDataInstant: RecordDataInstant = {
        altitude: info.altitude ?? 0,
        speed: 0,
        location: info.position,
        time: parseTimeToString(dayjs())
      }
      const len = locationTrackList.value.length

      if (len > 0) {
        const distance = mapStore.getDistance(
          currentRecordDataInstant.value!.location,
          recordDataInstant.location
        )
        // if (distance > 0) {
        if (distance > 0 && !weakGPS.value) {
          updatePrevRecordData()
          recordData.value.totalDistance += distance
          recordDataInstant.speed = parseFloat(
            ((distance / (TIME_INTERVAL + countNotInMotion.value)) * 3.6).toFixed(2)
          )
          countNotInMotion.value = 0
          if (tourData.value && userStore.curUser) {
            recordData.value.calorie = calculateTourCalorie(
              tourData.value.type,
              userStore.curUser.weight,
              recordData.value.timeTaken,
              recordData.value.avgSpeed
            )
          }
          locationTrackList.value.push(recordDataInstant)
        } else {
          countNotInMotion.value++
        }

        const distances: number[] = tourPlannedLines.value.map((l: any) =>
          AMap.GeometryUtil.distanceToLine(info.position, l.path)
        )
        const minDistance = Math.min(...distances)

        if (minDistance === Infinity) {
          // No tour
        } else if (minDistance > Math.max(currentGPS.value, 100)) {
          currentLineIndex.value = -1
          showNotify({
            type: 'danger',
            message: '您已偏离路线'
          })
          if (!speechOutOfRoute.value) {
            speechSynthesis('您已偏航，请重新规划路线')
            speechOutOfRoute.value = true
          }
        } else {
          const minIndex = distances.findIndex((d) => d === minDistance)
          if (currentLineIndex.value !== minIndex) {
            currentLineIndex.value = minIndex

            speechSynthesis(tourPlannedLines.value[minIndex].instruction)

            showNotify({
              type: 'primary',
              message: tourPlannedLines.value[minIndex].instruction
            })
          }
        }
      } else {
        locationTrackList.value.push(recordDataInstant)
      }

      if (tourData.value) {
        layers = mapStore.drawRoute(
          mapRef.value.$$getInstance(),
          locationTrackList.value.map((track) => track.location),
          tourData.value.type,
          {
            startMarker: false,
            endMarker: false,
            reCenter: false
          },
          false,
          true
        )
      }
    } else if (status === 'error') {
      // showToast({
      //   type: 'fail',
      //   message: info.originMessage
      // })
    }
    setTimeout(() => {
      getCurrentLocation()
    }, 2000)
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
  handleCreateHighlight,
  handleSaveTour
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

// const polyline = computed(() => ({
//   path: locationTrackList.value.length > 0 ? locationTrackList.value : undefined,
//   // path: locationTrackList.value,
//   editable: false,
//   visible: true,
//   draggable: false
// }))

let getLocationInterval = 0
let countTimeInterval = 0

const currentGPS = ref(Infinity)
const weakGPS = computed(() => currentGPS.value > 150)
const speechWeak = ref(false)
const speechOutOfRoute = ref(false)

watch(weakGPS, (value) => {
  if (!speechWeak.value && value) {
    speechSynthesis('GPS 信号弱')
    speechWeak.value = true
  }
})

onMounted(() => {
  // countTimeInterval = setInterval(handleCountTime, 1000)
})

onUnmounted(() => {
  clearInterval(getLocationInterval)
  clearInterval(countTimeInterval)
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
    <div v-if="pauseTour" class="weak-gps-hint">
      <span class="hint-text" style="font-weight: bold; font-size: 32px; letter-spacing: 1.8px"
        >PAUSED</span
      >
    </div>
    <div v-else-if="weakGPS" class="weak-gps-hint">
      <icon-loading class="hint-icon" />
      <span class="hint-text">Establishing Location</span>
    </div>
    <div
      v-else-if="!userStore.curUser || userStore.curUser.type !== UserType.VIP"
      class="weak-gps-hint"
    >
      <span class="hint-text" style="font-weight: bold; font-size: 32px; letter-spacing: 1.8px"
        >Not Vip</span
      >
    </div>
    <van-swipe v-else class="record-swipe" indicator-color="white">
      <van-swipe-item>
        <a-grid :cols="2" class="swipe-grid">
          <a-grid-item>
            <div class="swipe-grid-item">
              <div>
                <icon-thunderbolt class="swipe-grid-item-icon" />
              </div>
              <a-statistic
                :precision="2"
                :value="isInMotion ? currentRecordDataInstant?.speed ?? 0 : 0"
                :value-from="prevRecordDataInstant?.speed ?? 0"
                animation
                title="Current Speed"
              >
                <template #suffix> Km/h</template>
              </a-statistic>
            </div>
          </a-grid-item>
          <a-grid-item>
            <div class="swipe-grid-item">
              <div>
                <icon-thunderbolt class="swipe-grid-item-icon" />
              </div>
              <a-statistic
                :precision="2"
                :value="recordData.avgSpeed ?? 0"
                :value-from="prevRecordData.avgSpeed ?? 0"
                animation
                title="Average Speed"
              >
                <template #suffix> Km/h</template>
              </a-statistic>
            </div>
          </a-grid-item>
          <a-grid-item>
            <div class="swipe-grid-item">
              <div>
                <icon-clock-circle class="swipe-grid-item-icon" />
              </div>
              <a-countdown
                :now="new Date().getTime()"
                :precision="0"
                :start="false"
                :value="new Date().getTime() + recordData.timeInMotion * 1000"
                title="In Motion"
              >
              </a-countdown>
            </div>
          </a-grid-item>
          <a-grid-item>
            <div class="swipe-grid-item">
              <div>
                <icon-double-right class="swipe-grid-item-icon" />
              </div>
              <a-statistic
                :precision="2"
                :value="recordData.totalDistance"
                :value-from="prevRecordData?.totalDistance ?? 0"
                animation
                title="Traveled"
              >
                <template #suffix> M</template>
              </a-statistic>
            </div>
          </a-grid-item>
        </a-grid>
      </van-swipe-item>
      <van-swipe-item>
        <a-grid :cols="2" class="swipe-grid">
          <a-grid-item>
            <div class="swipe-grid-item">
              <div>
                <icon-thunderbolt class="swipe-grid-item-icon" />
              </div>
              <a-statistic :precision="2" :value="maxSpeed" title="Max Speed">
                <template #suffix> Km/h</template>
              </a-statistic>
            </div>
          </a-grid-item>
          <a-grid-item>
            <div class="swipe-grid-item">
              <div>
                <icon-bar-chart class="swipe-grid-item-icon" />
              </div>
              <a-statistic
                :precision="0"
                :value="currentRecordDataInstant?.altitude ?? 0"
                :value-from="prevRecordDataInstant?.altitude ?? 0"
                animation
                title="Current Altitude"
              >
                <template #suffix> M</template>
              </a-statistic>
            </div>
          </a-grid-item>
          <a-grid-item>
            <div class="swipe-grid-item">
              <div>
                <icon-clock-circle class="swipe-grid-item-icon" />
              </div>
              <a-countdown
                :now="new Date().getTime()"
                :precision="0"
                :start="false"
                :value="new Date().getTime() + recordData.timeTaken * 1000"
                title="Time Taken"
              >
              </a-countdown>
            </div>
          </a-grid-item>
          <a-grid-item>
            <div class="swipe-grid-item">
              <div>
                <icon-fire class="swipe-grid-item-icon" />
              </div>
              <a-statistic
                :precision="2"
                :value="recordData.calorie"
                :value-from="recordData.calorie"
                title="Calorie burnt"
              >
                <template #suffix> KJ</template>
              </a-statistic>
            </div>
          </a-grid-item>
        </a-grid>
      </van-swipe-item>
      <van-swipe-item>
        <div class="swipe-card-item">
          <div class="navigation-instruction">
            {{
              currentLineIndex === -1
                ? '已偏离规划路线'
                : tourPlannedLines[currentLineIndex]?.instruction
            }}
          </div>
          <!--          <div v-else>-->
          <!--            <van-loading />-->
          <!--          </div>-->
          <div style="margin: 10px; font-weight: bold; color: rgba(255, 255, 255, 0.8)">
            Accuracy: {{ currentGPS }}
          </div>
        </div>
      </van-swipe-item>
    </van-swipe>

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
            strokeOpacity: 0.5
          }"
          :enable-high-accuracy="true"
          :pan-to-location="false"
          :timeout="5000"
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
    <van-toast :show="loadingTourObj.loading.value" style="padding: 0" type="loading">
      <template #message>Loading Tour</template>
    </van-toast>
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
