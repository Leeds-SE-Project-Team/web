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
import { closeToast, type PickerOption, showNotify, showToast } from 'vant'
import {
  calculateTourCalorie,
  createTour,
  type CreateTourForm,
  fetchTourDataJson,
  getTourById,
  getTourTypeImg,
  getTourTypeText,
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
import { getCurrentLocation, hapticsImpactLight, hapticsVibrate, parseTimeToString } from '@/utils'
import dayjs from 'dayjs'
import { useUserStore } from '@/stores'
import { speechSynthesis } from '@/apis/others'
import { UserType } from '@/apis/user'
import { getTourCollectionsByCurUser, type TourCollection } from '@/apis/collection'
import { getAllCreatedGroupsByUser, getAllJoinedGroupsByUser } from '@/apis/group'
import { showLoadingToast } from 'vant/es'
import {
  getGroupCollectionByGroupId,
  type SelectGroupCollectionOption
} from '@/apis/groupCollection'

const route = useRoute()
const tourId = ref(parseInt(route.params.tourId as string))
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
  tourId: tourId.value,
  trackList: []
})
const recordData = computed<RecordData>(() => saveTourForm.value.recordData)
const saveTourLoadingObj = useLoading()

const handleSaveTour = () => {
  if (isNewTour.value || saveTourLoadingObj.loading.value) {
    showSaveTourSheet.value = true
    return
  }

  saveTourLoadingObj.setLoading(true)
  showLoadingToast('Saving')
  saveTour({ ...saveTourForm.value, isComplete: true, tourId: tourId.value })
    .then((apiRes) => {
      if (apiRes.success) {
        showToast(apiRes.message)
        router.replace({ name: 'tour', query: { id: tourId.value } })
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

const savedTour = ref<TourRecord>()
const handleCreateTour = (navigate?: boolean) => {
  // if (createTourForm.value.title === '') {
  //   createTourForm.value.title = 'untitled'
  // }
  if (locationTrackList.value.length === 0) {
    showToast('No data recorded.')
    showSaveTourSheet.value = false
    return
  }

  saveTourLoadingObj.setLoading(true)
  showLoadingToast('Creating')
  createTour({
    ...createTourForm.value,
    startLocation: locationTrackList.value[0].location.toString(),
    endLocation: locationTrackList.value[locationTrackList.value.length - 1].location.toString(),
    tourCollectionId: selectedCollection.value,
    title: tourTitleInput.value.length > 0 ? tourTitleInput.value : 'Untitled',
    result: undefined,
    groupCollectionId: selectedGroupCollection.value
  })
    .then((res) => {
      if (res.success) {
        showLoadingToast('Uploading')
        uploadFileFromURL(
          mapStore.screenMap(mapRef.value.$$getInstance())!,
          `/tour/${res.data!.id}`,
          'map_screenshot.jpg'
        )
          .then((uploadRes) => {
            if (uploadRes.success) {
              savedTour.value = res.data!
              tourData.value = savedTour.value!
              tourId.value = savedTour.value!.id
              // Message.success(res.message)
              showLoadingToast('Saving')
              saveTour({ ...saveTourForm.value, isComplete: true, tourId: savedTour.value!.id })
                .then((apiRes) => {
                  if (apiRes.success) {
                    showToast('Tour saved')
                    if (navigate === true) {
                      router.push({ name: 'tour', query: { id: tourId.value } })
                    } else {
                      router.replace({ name: 'record', params: { tourId: tourId.value } })
                    }
                  } else {
                    throw apiRes.message
                  }
                })
                .catch((e) => {
                  Message.error(e)
                })
            } else {
              throw uploadRes.message
            }
          })
          .finally(() => {
            saveTourLoadingObj.setLoading(false)
            showSaveTourSheet.value = false
          })
      } else {
        throw res.message
      }
    })
    .catch((e) => {
      Message.error(e)
      saveTourLoadingObj.setLoading(false)
      showSaveTourSheet.value = false
    })
    .finally(() => {
      // saveTourLoadingObj.setLoading(false)
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
      if (!getLocationLoadObj.loading.value) {
        clearTimeout(getLocationTimeout)
        refreshCurrentLocation(true)
      }
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
  if (tourId.value === -1) {
    showNotify({ type: 'primary', message: 'New adventure start!' })
    return
  }

  loadingTourObj.setLoading(true)
  getTourById(tourId.value)
    .then((apiRes) => {
      if (apiRes.success) {
        tourData.value = apiRes.data!
        fetchTourDataJson(tourData.value)
          .then((res) => {
            if (res[0].data.result) {
              const result = res[0].data.result
              tourPlannedData.value = res[0].data
              mapStore.drawRoute(
                mapRef.value.$$getInstance(),
                tourData.value!.type === TourType.PUBLIC ? result.plans[0] : result.routes[0],
                tourData.value!.type,
                {
                  lineOptions: { strokeStyle: 'dashed', strokeColor: 'green' }
                }
              )
            }

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
            (recordData.value.totalDistance / (recordData.value.timeInMotion / 3600)).toFixed(2)
          )
        : 0
  }
}

const currentLineIndex = ref(-1)
const tourPlannedLines = computed(() => {
  if (tourPlannedData.value) {
    const result = tourPlannedData.value.result
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

const isNewTour = computed(() => tourId.value === -1)
const refreshCurrentLocation = (toCenter?: boolean) => {
  if (pauseTour.value) {
    return
  }

  if (!isNewTour.value && !tourData.value) {
    if (!getLocationLoadObj.loading.value) {
      clearTimeout(getLocationTimeout)
      getLocationTimeout = setTimeout(() => {
        refreshCurrentLocation(toCenter)
      }, 1000)
    }
    return
  }

  // const geolocationInstance = geolocationRef.value.$$getInstance() as AMap.Geolocation
  // if (geolocationInstance) {
  //   geolocationInstance.getCurrentPosition(function (status, info) {})
  // }
  console.log('start')
  getLocationLoadObj.setLoading(true)
  getCurrentLocation()
    .then((res: AMap.CurrentPositionResult) => {
      getLocationLoadObj.setLoading(false)
      if (res.info === 'SUCCESS') {
        // weakGPS.value = info.accuracy > 30
        currentGPS.value = Math.round(res.accuracy)
        mapStore.currentLocation = res.position.toArray()
        if (toCenter === true) {
          center.value = res.position.toArray()
        }
        // if (layers.length > 0) {
        //   ;(mapRef.value.$$getInstance() as AMap.Map).remove(layers)
        // }
        let recordDataInstant: RecordDataInstant = {
          altitude: (res as any)?.altitude ?? 0,
          speed: 0,
          location: res.position,
          time: parseTimeToString(dayjs())
        }
        const len = locationTrackList.value.length
        if (len > 0) {
          console.log(recordDataInstant.location)

          const distance = mapStore.getDistance(
            currentRecordDataInstant.value!.location,
            recordDataInstant.location
          )

          console.log(distance)
          // if (distance > 0) {
          if (distance > 0 && !weakGPS.value) {
            updatePrevRecordData()
            recordData.value.totalDistance += distance / 1000
            console.log('total', recordData.value.totalDistance)
            recordDataInstant.speed = parseFloat(
              ((distance / (TIME_INTERVAL + countNotInMotion.value)) * 3.6).toFixed(2)
            )
            countNotInMotion.value = 0
            if (userStore.curUser) {
              recordData.value.calorie = calculateTourCalorie(
                tourData.value?.type ?? TourType.WALK,
                userStore.curUser.weight,
                recordData.value.timeTaken,
                recordData.value.avgSpeed
              )
            }
            locationTrackList.value.push(recordDataInstant)
          } else {
            countNotInMotion.value++
          }

          if (tourPlannedData.value) {
            const distances: number[] = tourPlannedLines.value.map((l: any) =>
              AMap.GeometryUtil.distanceToLine(res.position, l.path)
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
                hapticsVibrate()
                speechSynthesis('您已偏航，请重新规划路线')
                speechOutOfRoute.value = true
              }
            } else {
              const minIndex = distances.findIndex((d) => d === minDistance)
              if (currentLineIndex.value !== minIndex) {
                currentLineIndex.value = minIndex
                hapticsVibrate()
                speechSynthesis(tourPlannedLines.value[minIndex].instruction)
                showNotify({
                  type: 'primary',
                  message: tourPlannedLines.value[minIndex].instruction
                })
              }
            }
          }
        } else {
          locationTrackList.value.push(recordDataInstant)
        }

        layers = mapStore.drawRoute(
          mapRef.value.$$getInstance(),
          locationTrackList.value.map((track) => track.location),
          tourData.value?.type ?? TourType.WALK,
          {
            startMarker: false,
            endMarker: false,
            reCenter: false,
            lineOptions: {
              strokeOpacity: 0.6,
              strokeWeight: 2
            }
          },
          false,
          true
        )
      } else {
        showToast(res.info)
        // showToast({
        //   type: 'fail',
        //   message: info.originMessage
        // })
      }
      clearTimeout(getLocationTimeout)
      getLocationTimeout = setTimeout(() => {
        refreshCurrentLocation()
      }, 2000)
    })
    .catch((e) => {
      console.log(e)
      refreshCurrentLocation(toCenter)
    })
  // (status, info: any) => { })
}

const handleCreateHighlight = (form: CreateTourHighlightForm) => {
  showNotify({ type: 'primary', message: 'uploading image...' })
  uploadFileFromURL(form.imageUrl, `/tour/${tourId.value}/highlights`)
    .then((uploadRes) => {
      if (uploadRes.success) {
        createTourHighlight({
          ...form,
          imageUrl: import.meta.env.APP_SERVER_URL + uploadRes.data!,
          tourId: tourId.value
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

const geolocationRef = ref()

const highlightPanelAnchors = [
  0,
  Math.round(0.46 * window.innerHeight),
  Math.round(0.7 * window.innerHeight)
]

const handleClickHighlight = (highlight: TourHighlight) => {
  selectedHighlight.value = highlight
  showHighlightSheet.value = true
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
    showHighlightSheet.value = true
  } else {
    showHighlightSheet.value = false
  }
})

const handleCloseHighlightAction = () => {
  if (selectedHighlight.value) {
    moveToPosition(parseLocationNumber(selectedHighlight.value.location))
  }
}
const showHighlightSheet = ref(false)

let getLocationTimeout = 0
let countTimeInterval = 0

const currentGPS = ref(Infinity)
const weakGPS = computed(() => currentGPS.value > 150)
const speechWeak = ref(false)
const speechOutOfRoute = ref(false)

watch(weakGPS, (value) => {
  if (!speechWeak.value && value) {
    hapticsVibrate()
    speechSynthesis('GPS 信号弱')
    speechWeak.value = true
  }
})

onMounted(() => {
  fetchTourCollections()
  fetchGroups()
  // countTimeInterval = setInterval(handleCountTime, 1000)
})

onUnmounted(() => {
  clearTimeout(getLocationTimeout)
  clearInterval(countTimeInterval)
})

const showCollectionPicker = ref(false)
const showGroupCollectionPicker = ref(false)
const pointSheetHeight = ref(0)
const resultPanelAnchors = [
  Math.round(0.2 * window.innerHeight),
  Math.round(0.4 * window.innerHeight),
  Math.round(0.6 * window.innerHeight)
]
const resultPanelHeight = ref(resultPanelAnchors[1])

const tourTitleInput = ref('')
const createTourForm = ref<CreateTourForm>({
  startLocation: '',
  endLocation: '',
  type: TourType.WALK,
  pons: [],
  tourCollectionId: -1,
  groupCollectionId: -1,
  result: undefined,
  title: 'Untitled'
})
// const resetForm = () => {
//   createTourForm.value.startLocation = ''
//   createTourForm.value.endLocation = ''
//   createTourForm.value.result = undefined
//   createTourForm.value.title = 'untitled'
//   createTourForm.value.pons = []
// }

const tourTypeText = computed<string>(() => getTourTypeText(createTourForm.value.type))
const tourTypeImg = computed<string>(() => getTourTypeImg(createTourForm.value.type))

const showSaveTourSheet = ref(false)
const selectGroupCollectionOptions = ref<SelectGroupCollectionOption[]>([])

const groupsLoadingObj = useLoading()
const fetchGroups = () => {
  groupsLoadingObj.setLoading(true)
  Promise.all([getAllJoinedGroupsByUser(), getAllCreatedGroupsByUser()])
    .then((apiRes) => {
      if (apiRes[0].success && apiRes[1].success) {
        const userJoinedGroups = [...apiRes[0].data!, ...apiRes[1].data!]
        selectGroupCollectionOptions.value = userJoinedGroups.map((g) => ({
          text: g.name,
          value: g.id,
          children: []
        }))
      }
    })
    .catch((reason: any) => {
      Message.error(reason)
    })
    .finally(() => {
      groupsLoadingObj.setLoading(false)
    })
}

const selectedGroupCollectionName = ref('None')

const onSelectedGroupChange = ({
  value,
  tabIndex,
  selectedOptions
}: {
  value: number
  tabIndex: number
  selectedOptions: any[]
}) => {
  if (selectedOptions.length >= 2) {
    showGroupCollectionPicker.value = false
    selectedGroupCollectionName.value = selectedOptions[1].text
    return
  }
  if (selectedOptions[0].children!.length === 0) {
    showLoadingToast('loading...')
    getGroupCollectionByGroupId(value)
      .then((apiRes) => {
        if (apiRes.success) {
          selectGroupCollectionOptions.value[tabIndex].children = apiRes.data!.map(
            (groupCollection) => ({
              text: groupCollection.name,
              value: groupCollection.id
            })
          )
        }
      })
      .finally(() => {
        closeToast()
      })
  }
}

const onCollectionConfirm = ({ selectedOptions }: { selectedOptions: PickerOption[] }) => {
  showCollectionPicker.value = false
  selectedCollection.value = selectedOptions[0].value as number
}
const userCollections = ref<TourCollection[]>([])
const selectedCollection = ref(-1)
const selectedGroupCollection = ref(-1)
const collectionLoadingObj = useLoading()
const fetchTourCollections = () => {
  collectionLoadingObj.setLoading(true)
  getTourCollectionsByCurUser()
    .then((apiRes) => {
      if (apiRes.success) {
        userCollections.value = apiRes.data!
        selectedCollection.value = userCollections.value[0].id
      } else {
        Message.error(apiRes.message)
      }
    })
    .catch((reason: any) => {
      Message.error(reason)
    })
    .finally(() => {
      collectionLoadingObj.setLoading(false)
    })
}

const handleScrollPicker = () => {
  hapticsImpactLight()
}
</script>

<template>
  <div id="page-record">
    <!--    PAUSE TOUR HINT-->
    <div v-if="pauseTour" class="weak-gps-hint">
      <span class="hint-text" style="font-weight: bold; font-size: 32px; letter-spacing: 1.8px"
        >PAUSED</span
      >
    </div>
    <!--    PAUSE TOUR HINT-->

    <!--    WEAK GPS HINT-->
    <div v-else-if="weakGPS" class="weak-gps-hint">
      <icon-loading class="hint-icon" />
      <span class="hint-text">Establishing Location</span>
    </div>
    <!--    WEAK GPS HINT-->

    <!--    VIP HINT-->
    <!--    <div-->
    <!--      v-else-if="!userStore.curUser || userStore.curUser.type !== UserType.VIP"-->
    <!--      class="weak-gps-hint"-->
    <!--    >-->
    <!--      <span class="hint-text" style="font-weight: bold; font-size: 32px; letter-spacing: 1.8px"-->
    <!--        >Not Vip</span-->
    <!--      >-->
    <!--    </div>-->
    <!--    VIP HINT-->

    <!--    TOUR DATA-->

    <van-swipe
      v-else
      :style="{
        filter:
          !userStore.curUser || userStore.curUser.type !== UserType.VIP ? 'blur(5.5px)' : 'none'
      }"
      class="record-swipe"
      indicator-color="white"
    >
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
                <template #suffix> Km</template>
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
    <div
      v-if="
        !pauseTour && !weakGPS && (!userStore.curUser || userStore.curUser.type !== UserType.VIP)
      "
      class="vip-hint"
    >
      <div class="van-ellipsis" style="text-align: center">Available for VIP</div>
    </div>
    <!--    TOUR DATA-->

    <!--    AMAP CONTAINER-->
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
        @complete="refreshCurrentLocation(true)"
        @init="mapInit"
      >
        <!--        <el-amap-polyline-->
        <!--          :draggable="polyline.draggable"-->
        <!--          :editable="polyline.editable"-->
        <!--          :path="polyline.path"-->
        <!--          :visible="polyline.visible"-->
        <!--        />-->

        <el-amap-marker :offset="[-9.5, -12]" :position="mapStore.currentLocation">
          <img
            alt="location"
            src="https://a.amap.com/jsapi/static/image/plugin/point.png"
            style="
              width: 19px;
              height: 19px;
              border-radius: 50%;
              box-shadow: 0 0 8px #4d95ec;
              background-color: #fff;
              opacity: 0.9;
              cursor: zoom-in;
              transition: transform 0.3s cubic-bezier(0.2, 0, 0.2, 1) !important;
            "
          />
        </el-amap-marker>

        <el-amap-circle
          :center="mapStore.currentLocation"
          :fill-opacity="0"
          :radius="currentGPS"
          :stroke-opacity="0.5"
          :strokeWeight="1"
        />

        <el-amap-marker
          v-for="(highlight, idx) in highlightList"
          :key="idx"
          :offset="[-10, -40]"
          :position="parseLocation(highlight.location)"
          :visible="true"
          :z-index="1"
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

        <!--        <el-amap-control-geolocation-->
        <!--          ref="geolocationRef"-->
        <!--          :circleOptions="{-->
        <!--            fillOpacity: 0,-->
        <!--            strokeOpacity: 0.5-->
        <!--          }"-->
        <!--          :enable-high-accuracy="true"-->
        <!--          :pan-to-location="false"-->
        <!--          :timeout="5000"-->
        <!--          :zoom-to-accuracy="false"-->
        <!--        />-->
      </el-amap>
    </div>
    <!--    AMAP CONTAINER-->

    <!--    HIGHLIGHT MODAL-->
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
            $router.push({ name: 'highlight', params: { id: selectedHighlight!.id } })
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
    <!--    HIGHLIGHT MODAL-->

    <!--    TOAST COMPONENT-->
    <van-toast :show="loadingTourObj.loading.value" style="padding: 0" type="loading">
      <template #message>Loading</template>
    </van-toast>
    <!--    TOAST COMPONENT-->

    <!--    CREATE TOUR PANEL-->
    <van-floating-panel
      v-if="showSaveTourSheet && !showCollectionPicker && !(pointSheetHeight > 0)"
      v-model:height="resultPanelHeight"
      :anchors="resultPanelAnchors"
      class="result-panel"
    >
      <van-cell class="result-cell">
        <template #icon><img :alt="tourTypeText" :src="tourTypeImg" class="menu-icon" /></template>
        <template #title>
          <span class="menu-title">{{ tourTypeText.toUpperCase() }}</span>
        </template>
        <!--          :loading="mapContainer.resultLoading"-->
        <!--        <van-button-->
        <!--          :loading-text="' loading'"-->
        <!--          class="adjust-btn"-->
        <!--          hairline-->
        <!--          plain-->
        <!--          size="small"-->
        <!--          type="primary"-->
        <!--          @click="alwaysShowTop = !alwaysShowTop"-->
        <!--        >-->
        <!--          <span v-if="!alwaysShowTop">ADJUST ROUTE</span>-->
        <!--          <span v-else>HIDE ROUTE</span>-->
        <!--        </van-button>-->
      </van-cell>

      <van-grid :border="false" :gutter="10" class="result-detail">
        <van-grid-item class="detail-item" icon="clock-o" text="文字">
          <template #text>
            <span class="detail-content"> {{ Math.round(recordData.timeInMotion / 60) }} min </span>
          </template>
        </van-grid-item>
        <van-grid-item class="detail-item" icon="aim">
          <template #text>
            <span class="detail-content">
              {{ (recordData.totalDistance / 1000).toFixed(2) }} km
            </span></template
          >
        </van-grid-item>
        <van-grid-item class="detail-item action-item" icon="share-o">
          <template #text><span class="detail-content"> share </span></template>
        </van-grid-item>
        <van-grid-item
          class="detail-item action-item"
          icon="close"
          @click="showSaveTourSheet = false"
        >
          <template #text><span class="detail-content"> Close </span></template>
        </van-grid-item>
      </van-grid>
      <van-cell>
        <van-field
          v-model="tourTitleInput"
          class="title-input"
          label="Tour title"
          placeholder="Untitled"
        />
      </van-cell>

      <van-cell class="collection-select" @click="showCollectionPicker = true">
        <!--        <template #icon><img :alt="tourTypeText" :src="tourTypeImg" class="menu-icon" /></template>-->
        <template #title>
          <span class="menu-title">Select collection</span>
        </template>
        <van-loading v-if="selectedCollection === -1" />
        <span v-else>{{ userCollections.find((c) => c.id === selectedCollection)?.name }}</span>
      </van-cell>

      <van-cell class="collection-select" @click="showGroupCollectionPicker = true">
        <template #title>
          <span class="menu-title">Group collection</span>
        </template>
        <van-loading v-if="groupsLoadingObj.loading.value" />
        <span v-else>{{ selectedGroupCollectionName }}</span>
      </van-cell>
    </van-floating-panel>
    <!--    CREATE TOUR PANEL-->

    <!--    COLLECTION PICKER-->
    <van-popup v-model:show="showCollectionPicker" class="popup" position="bottom" round>
      <van-picker
        :columns="
          userCollections.map((collection) => ({
            value: collection.id,
            text: collection.name
          }))
        "
        :loading="collectionLoadingObj.loading.value"
        class="collection-picker"
        @cancel="showCollectionPicker = false"
        @confirm="onCollectionConfirm"
        @scroll-into="handleScrollPicker"
      />
    </van-popup>
    <van-popup v-model:show="showGroupCollectionPicker" class="popup" position="bottom" round>
      <van-cascader
        v-model="selectedGroupCollection"
        :options="selectGroupCollectionOptions"
        class="collection-picker"
        title="Select Group Collection"
        @cancel="showGroupCollectionPicker = false"
        @change="onSelectedGroupChange"
        @close="showGroupCollectionPicker = false"
      />
    </van-popup>
    <!--    COLLECTION PICKER-->

    <!--    SAVE TOUR BUTTONS-->
    <div v-if="showSaveTourSheet" class="operation-container" style="bottom: 0">
      <van-button
        :disabled="selectedCollection === -1"
        :loading="saveTourLoadingObj.loading.value"
        class="operation-btn primary-btn-dark"
        style="background: white; color: black; border: thin solid lightgray"
        @click="handleCreateTour"
      >
        <span class="btn-text">Save</span>
      </van-button>
      <van-button
        :disabled="selectedCollection === -1"
        class="operation-btn primary-btn-dark"
        @click="handleCreateTour(true)"
      >
        <span class="btn-text" style="font-size: 16px; align-self: center">Finish</span>
      </van-button>
    </div>
    <!--    SAVE TOUR BUTTONS-->
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
