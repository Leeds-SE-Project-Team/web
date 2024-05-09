<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import {
  createTour,
  type CreateTourForm,
  getTourTypeImg,
  getTourTypeText,
  parseLocation,
  type TourRecord,
  TourType
} from '@/apis/tour'
// import type { PickerOption } from 'vant'
import { Message } from '@arco-design/web-vue'
import useLoading from '@/hooks/loading'
import MapPlanner from '@/views/mobile/planner/components/MapPlanner.vue'
// import { hapticsImpactLight } from '@/utils'
import { App } from '@capacitor/app'
import { useMapStore } from '@/stores/map'
import { getTourCollectionsByCurUser, type TourCollection } from '@/apis/collection'
import { useRoute, useRouter } from 'vue-router'
import { uploadFileFromURL } from '@/utils/file'
import SearchPlaceView from '@/views/mobile/planner/SearchPlaceView.vue'

const tourTypeText = computed<string>(() => getTourTypeText(createTourForm.value.type))
const tourTypeImg = computed<string>(() => getTourTypeImg(createTourForm.value.type))

const showPicker = ref(false)
const showCollectionPicker = ref(false)
// const onConfirm = ({ selectedOptions }: { selectedOptions: PickerOption[] }) => {
//   showPicker.value = false
//   createTourForm.value.type = selectedOptions[0].value as TourType
// }
// const onCollectionConfirm = ({ selectedOptions }: { selectedOptions: PickerOption[] }) => {
//   showCollectionPicker.value = false
//   selectedCollection.value = selectedOptions[0].value as number
// }

const userCollections = ref<TourCollection[]>([])
const selectedCollection = ref(-1)

const collectionLoadingObj = useLoading()
const fetchTourCollections = () => {
  // userStore
  //   .getUserRecord()
  //   .then((user) => {
  collectionLoadingObj.setLoading(true)
  getTourCollectionsByCurUser()
    .then((apiRes) => {
      if (apiRes.success) {
        userCollections.value = apiRes.data!
        selectedCollection.value = userCollections.value[0].id
        createGPXFrom.value.tourCollectionId = userCollections.value[0].id
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
  // })
  // .catch((reason: any) => {
  //   Message.error(reason)
  // })
}

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

const route = useRoute()
const router = useRouter()

const createGPXFrom = ref<CreateTourForm>({
  startLocation: '',
  endLocation: '',
  type: TourType.WALK,
  pons: [],
  tourCollectionId: -1,
  groupCollectionId: -1,
  result: undefined,
  title: 'Untitled'
})

const isGPX = computed(() => {
  if (route.query.type && route.query.type === 'gpx') {
    return true
  }
  return false
})
const isGPS = computed(() => {
  if (route.query.type && route.query.gps === 'true') {
    return true
  }
  return false
})

if (isGPX.value) {
  createGPXFrom.value.result = useMapStore().FileGpxData
  createGPXFrom.value.startLocation = createGPXFrom.value.result.origin.toString()
  createGPXFrom.value.endLocation = createGPXFrom.value.result.destination.toString()
  // fetchTourCollections()
}

const resetForm = () => {
  if (route.query.gpx) {
    router.go(-1)
    return
  }
  createTourForm.value.startLocation = ''
  createTourForm.value.endLocation = ''
  createTourForm.value.result = undefined
  createTourForm.value.title = 'untitled'
  createTourForm.value.pons = []
}

const mapContainer = ref()
const mapStore = useMapStore()

const formRef = ref()
const { loading, setLoading } = useLoading()

const savedTour = ref<TourRecord>()

// const router = useRouter()

const handleCreateTour = (navigate = false) => {
  formRef.value.validate().then((e: any) => {
    if (!e) {
      setLoading(true)
      // if (createTourForm.value.title === '') {
      //   createTourForm.value.title = 'untitled'
      // }

      createTour({
        ...createTourForm.value,
        tourCollectionId: selectedCollection.value,
        title: tourTitleInput.value.length > 0 ? tourTitleInput.value : 'Untitled',
        result: mapContainer.value.navigationResult
      })
        .then((res) => {
          if (res.success) {
            uploadFileFromURL(
              mapStore.screenMap(mapContainer.value.mapRef.$$getInstance())!,
              `/tour/${res.data!.id}`,
              'map_screenshot.jpg'
            )
              .then((uploadRes) => {
                if (uploadRes.success) {
                  savedTour.value = res.data!
                  Message.success(res.message)
                  // if (navigate) {
                  //   router.push({ name: 'record', params: { tourId: savedTour.value.id } })
                  // }
                } else {
                  throw uploadRes.message
                }
              })
              .finally(() => {
                setLoading(false)
              })
          } else {
            throw res.message
          }
        })
        .catch((e) => {
          Message.error(e)
          setLoading(false)
        })
    }
  })
}

const handleGPXTour = (navigate = false) => {
  formRef.value.validate().then((e: any) => {
    if (!e) {
      setLoading(true)
      // if (createTourForm.value.title === '') {
      //   createTourForm.value.title = 'untitled'
      // }
      console.log(createGPXFrom.value)
      createTour(createGPXFrom.value)
        .then((res) => {
          if (res.success) {
            uploadFileFromURL(
              mapStore.screenMap(mapContainer.value.mapRef.$$getInstance())!,
              `/tour/${res.data!.id}`,
              'map_screenshot.jpg'
            )
              .then((uploadRes) => {
                if (uploadRes.success) {
                  savedTour.value = res.data!
                  Message.success(res.message)
                  // if (navigate) {
                  //   router.push({ name: 'record', params: { tourId: savedTour.value.id } })
                  // }
                } else {
                  throw uploadRes.message
                }
              })
              .finally(() => {
                setLoading(false)
              })
          } else {
            throw res.message
          }
        })
        .catch((e) => {
          Message.error(e)
          setLoading(false)
        })
    }
  })
}
// const handleScrollPicker = () => {
//   hapticsImpactLight()
// }

const selectPoint = ref<number[]>()
const pointSheetHeight = ref(0)
const floatSheetHeight = window.innerHeight * 0.4
// const floatSheetAnchors = [0, floatSheetHeight]

let timer: any = 0
watch(selectPoint, (value) => {
  if (value) {
    clearInterval(timer)
    pointSheetHeight.value = floatSheetHeight
    // resultPanelHeight.value = resultPanelAnchors[0]
  } else {
    timer = setInterval(() => {
      if (pointSheetHeight.value > 1) {
        pointSheetHeight.value /= 1.2
      } else {
        pointSheetHeight.value = 0
        clearInterval(timer)
      }
    }, 1)
  }
})

watch(createTourForm, () => {
  if (hasPlanned.value) {
    alwaysShowTop.value = false
  }
})

const sheetData = computed<{
  address: string
  loading: boolean
  distance: number
  neighborhoodType: string
  neighborhood: string
  street: string
}>(() => mapContainer.value.sheetData)

const handleSelectStart = () => {
  if (selectPoint.value) {
    createTourForm.value.startLocation = selectPoint.value.join(',')
    selectPoint.value = undefined
  }
}
const handleSelectEnd = () => {
  if (selectPoint.value) {
    createTourForm.value.endLocation = selectPoint.value.join(',')
    selectPoint.value = undefined
  }
}

const handleSelectWaypoint = () => {
  if (selectPoint.value) {
    createTourForm.value.pons.push({
      name: sheetData.value.neighborhood,
      location: selectPoint.value.join(','),
      sequence: -1
    })
    createTourForm.value.pons.forEach((pon, idx) => {
      pon.sequence = idx + 1
    })
    selectPoint.value = undefined
  }
}

const selectedAll = computed({
  get: () => createTourForm.value.startLocation && createTourForm.value.endLocation,
  set: () => {
    createTourForm.value.startLocation = ''
    createTourForm.value.endLocation = ''
  }
})

// const setCenter = (center: number[] | string[]) => {
//   mapContainer.value.center.value = center
//   console.log(center)
// }

// const resultPanelAnchors = [
//   Math.round(0.2 * window.innerHeight),
//   Math.round(0.4 * window.innerHeight),
//   Math.round(0.6 * window.innerHeight)
// ]
// const resultPanelHeight = ref(resultPanelAnchors[1])

const hasPlanned = computed(() => {
  const result = mapContainer.value && mapContainer.value.navigationResult
  if (result || isGPX.value) {
    fetchTourCollections()
  }
  return result || isGPX.value
})

const alwaysShowTop = ref(false)

const plannedResult = computed(() => mapContainer.value.navigationResult)
const plannedFirstRoute = computed(() =>
  plannedResult.value
    ? createTourForm.value.type === TourType.PUBLIC
      ? (plannedResult.value as any).plans[0]
      : (plannedResult.value as any).routes[0]
    : undefined
)

const queryLocation = route.query.location
const handleMapComplete = () => {
  if (queryLocation) {
    const location = parseLocation(queryLocation as string).map((i) => parseFloat(i))
    mapContainer.value.handleSelectPlace(new AMap.LngLat(location[0], location[1]))
  }
}

const showSelector = ref(false)
const GPXCollectionPicker = ref(false)

watch(
  () => mapContainer.value?.mapRef.$$getInstance(),
  () => {
    console.log(mapContainer.value.mapRef.$$getInstance())
  }
)

onMounted(() => {
  App.addListener('backButton', () => {
    selectPoint.value = undefined
    showPicker.value = false
  })
  // setInterval(()=>{
  //   if(isGPX.value){
  //     console.log(mapContainer.value?.mapRef.$$getInstance())
  //   }
  // },1000)
  if (isGPX.value) {
    setTimeout(() => {
      const map = mapContainer.value.mapRef.$$getInstance()
      console.log(map)
      if (isGPS.value) {
        AMap.convertFrom(
          mapStore.parseRouteToPath(createGPXFrom.value.result.routes[0], 0),
          'gps',
          function (status: any, result: any) {
            //status：complete 表示查询成功，no_data 为查询无结果，error 代表查询错误
            //查询成功时，result.locations 即为转换后的高德坐标系
            if (status === 'complete' && result.info === 'ok') {
              const path = result.locations //转换后的高德坐标 Array.<LngLat>
              createGPXFrom.value.result.routes[0].steps[0].path = path
              createGPXFrom.value.startLocation = path[0].toString()
              createGPXFrom.value.endLocation = path[path.length - 1].toString()
              useMapStore().drawRoute(
                map,
                createGPXFrom.value.result.routes[0],
                0,
                { startMarker: true, endMarker: true, reCenter: true },
                false,
                true
              )
            }
          }
        )
      } else {
        useMapStore().drawRoute(
          map,
          createGPXFrom.value.result.routes[0],
          0,
          { startMarker: true, endMarker: true, reCenter: true },
          isGPS.value
        )
      }
    }, 1000)
  }
})

onUnmounted(() => {
  App.removeAllListeners()
})
</script>

<template>
  <div id="mobile-planner" class="flex-r">
    <div class="left">
      <div id="top-menu" style="height: 100%">
        <div class="outer-container" style="height: 100%">
          <div
            :style="{ height: (hasPlanned || selectPoint) && !alwaysShowTop ? 0 : '44px' }"
            class="menu-select"
          >
            <van-cell @click="showPicker = true">
              <template #icon
                ><img :alt="tourTypeText" :src="tourTypeImg" class="menu-icon"
              /></template>
              <template #title>
                <span class="menu-title">{{ tourTypeText }}</span>
              </template>
              How to Tour
            </van-cell>
            <van-popup
              v-model:show="showPicker"
              class="popup"
              position="top"
              round
              @open="selectPoint = undefined"
            >
              <div v-if="isGPX" class="flex-r flex-justify-c" style="height: 100px; width: 100%">
                <a-select
                  v-model="createGPXFrom.type"
                  :bordered="false"
                  :style="{ maxWidth: '400px' }"
                  placeholder="Please select ..."
                  @change="showPicker = false"
                >
                  <a-option :value="TourType.WALK">Hiking</a-option>
                  <a-option :value="TourType.CYCLING">Cycling</a-option>
                  <a-option :value="TourType.CAR">Car</a-option>
                </a-select>
              </div>
              <div v-else class="flex-r flex-justify-c" style="height: 100px; width: 100%">
                <a-select
                  v-model="createTourForm.type"
                  :bordered="false"
                  :style="{ maxWidth: '400px' }"
                  placeholder="Please select ..."
                  @change="showPicker = false"
                >
                  <a-option :value="TourType.WALK">Hiking</a-option>
                  <a-option :value="TourType.CYCLING">Cycling</a-option>
                  <a-option :value="TourType.CAR">Car</a-option>
                </a-select>
              </div>
            </van-popup>
          </div>
          <div class="menu-locations flex-c" style="height: 100%">
            <!--          '78px'-->
            <van-form
              ref="formRef"
              :style="{
                height:
                  (hasPlanned || selectPoint) && !alwaysShowTop
                    ? 0
                    : 80 +
                      (createTourForm.type === TourType.CAR && createTourForm.pons.length > 0
                        ? createTourForm.pons.length * 34 + 44
                        : 0) +
                      'px'
              }"
              @submit="handleCreateTour"
            >
              <van-cell-group v-if="!isGPX" inset>
                <van-field
                  v-model="createTourForm.startLocation"
                  :border="false"
                  clear-icon="delete"
                  clear-trigger="always"
                  clearable
                  disabled
                  label="A:"
                  name="startLocation"
                  placeholder="Current Location"
                  @click-input="showSelector = true"
                >
                  <template #extra>
                    <van-icon class="field-icon" color="white" name="wap-nav" size="20" />
                  </template>
                  <template #input>
                    <span style="font-weight: bold; color: white">
                      {{
                        !createTourForm.startLocation ||
                        createTourForm.startLocation === mapStore.currentLocation.join(',')
                          ? 'Current location'
                          : createTourForm.startLocation
                      }}
                    </span>
                  </template>
                </van-field>
                <div v-if="createTourForm.type === TourType.CAR && createTourForm.pons.length > 0">
                  <van-divider
                    dashed
                    style="
                      color: rgba(255, 255, 255, 0.5);
                      border-color: white;
                      margin: 5px 0 0 0;
                      height: 18px;
                      padding: 0 24px;
                    "
                  >
                    click to delete
                  </van-divider>
                  <van-field
                    v-for="(pon, idx) in createTourForm.pons"
                    :key="idx"
                    :border="false"
                    clear-icon="delete"
                    clear-trigger="always"
                    clearable
                    disabled
                    label=""
                    name="waypoints"
                    placeholder="Add Waypoints"
                    @click-input="
                      () => {
                        createTourForm.pons.splice(idx, 1)
                      }
                    "
                  >
                    <template #label>
                      <van-icon name="weapp-nav" />
                    </template>
                    <template #extra>
                      <van-icon class="field-icon" color="white" name="wap-nav" size="20" />
                    </template>
                    <template #input>
                      <span style="color: white">Waypoint {{ idx + 1 }}</span>
                    </template>
                  </van-field>
                  <van-divider
                    dashed
                    style="
                      color: rgba(255, 255, 255, 0.5);
                      border-color: white;
                      margin: 0 0 5px 0;
                      height: 18px;
                      padding: 0 24px;
                    "
                  >
                    {{ createTourForm.pons.length }} way points
                  </van-divider>
                </div>

                <van-field
                  v-model="createTourForm.endLocation"
                  :border="false"
                  clear-icon="delete"
                  clear-trigger="always"
                  clearable
                  disabled
                  label="B:"
                  name="endLocation"
                  placeholder="Choose Destination"
                  @click-input="showSelector = true"
                >
                  <template #extra>
                    <van-icon class="field-icon" color="white" name="wap-nav" size="20" />
                  </template>
                  <template #input>
                    <span v-if="createTourForm.endLocation" style="font-weight: bold; color: white">
                      {{ createTourForm.endLocation }}
                    </span>
                    <span v-else style="color: white">Select Destination</span>
                  </template>
                </van-field>
              </van-cell-group>
            </van-form>
            <div class="hint">
              <span v-if="selectPoint" @click="alwaysShowTop = !alwaysShowTop">{{
                selectPoint
              }}</span>
              <span
                v-else-if="
                  (mapContainer && mapContainer.resultLoading) ||
                  (!hasPlanned && createTourForm.startLocation && createTourForm.endLocation)
                "
                ><van-loading :size="16"
              /></span>
              <span v-else-if="hasPlanned" @click="alwaysShowTop = !alwaysShowTop"
                >Route planning succeed</span
              >
              <span v-else>Long press to select a point</span>
            </div>
            <div class="float-panne flex-c" style="flex: 1">
              <!-- <van-floating-panel
                v-if="pointSheetHeight > 0"
                id="bottom-menu"
                v-model:height="pointSheetHeight"
                :anchors="floatSheetAnchors"
              > -->
              <div v-if="pointSheetHeight > 0" id="choose-info">
                <div class="pos-sheet-btn-container">
                  <div v-if="!plannedResult" class="flex-r flex-justify-c" style="gap: 1rem">
                    <van-button class="pos-sheet-btn primary-btn-dark" @click="handleSelectStart">
                      <span class="btn-text">Start here</span>
                    </van-button>
                    <van-button class="pos-sheet-btn primary-btn-dark" @click="handleSelectEnd">
                      <span class="btn-text">Set as end point</span>
                    </van-button>
                  </div>
                  <div v-else>
                    <van-button
                      :disabled="createTourForm.type !== TourType.CAR"
                      class="pos-sheet-btn primary-btn-dark"
                      @click="handleSelectWaypoint"
                    >
                      <span class="btn-text">Add way point to route</span>
                    </van-button>
                  </div>
                </div>
                <div class="pos-sheet-text-container">
                  <p class="name van-multi-ellipsis--l2">
                    {{ sheetData.neighborhood || sheetData.street }}
                  </p>
                  <van-loading v-if="sheetData.loading" class="loading" color="#1989fa" />
                  <div v-else>
                    <van-tag
                      v-for="(tag, idx) in sheetData.neighborhoodType
                        .split(';')
                        .filter((type: string) => type.length > 0)"
                      :key="idx"
                      class="search-result-area-label-tag"
                      plain
                      size="large"
                      type="primary"
                    >
                      {{ tag }}
                    </van-tag>
                    <div class="pos-sheet-distance">
                      <van-icon :size="23" class="icon" name="location" />
                      <span class="text"
                        ><span>{{ sheetData.distance }}</span> km away</span
                      >
                    </div>

                    <div class="pos-sheet-location van-multi-ellipsis--l3">
                      {{ sheetData.address }}
                    </div>
                  </div>
                </div>
              </div>
              <!-- </van-floating-panel> -->
              <div
                v-if="selectedAll && hasPlanned && !(pointSheetHeight > 0)"
                id="plan-info"
                class="result-panel"
              >
                <van-cell class="result-cell">
                  <template #icon
                    ><img :alt="tourTypeText" :src="tourTypeImg" class="menu-icon"
                  /></template>
                  <template #title>
                    <span class="menu-title">{{ tourTypeText.toUpperCase() }}</span>
                  </template>
                  <van-button
                    :loading="mapContainer.resultLoading"
                    :loading-text="' loading'"
                    class="adjust-btn"
                    hairline
                    plain
                    size="small"
                    type="primary"
                    @click="alwaysShowTop = !alwaysShowTop"
                  >
                    <span v-if="!alwaysShowTop">ADJUST ROUTE</span>
                    <span v-else>HIDE ROUTE</span>
                  </van-button>
                </van-cell>

                <van-grid :border="false" :gutter="10" class="result-detail">
                  <van-grid-item class="detail-item" icon="clock-o" text="文字">
                    <template #text>
                      <span class="detail-content">
                        {{ Math.round(plannedFirstRoute?.time / 60) }} min
                      </span>
                    </template>
                  </van-grid-item>
                  <van-grid-item class="detail-item" icon="aim">
                    <template #text>
                      <span class="detail-content">
                        {{ (plannedFirstRoute?.distance / 1000).toFixed(2) }} km
                      </span></template
                    >
                  </van-grid-item>
                  <van-grid-item class="detail-item action-item" icon="share-o">
                    <template #text><span class="detail-content"> share </span></template>
                  </van-grid-item>
                  <van-grid-item class="detail-item action-item" icon="revoke" @click="resetForm">
                    <template #text><span class="detail-content"> Reset </span></template>
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
                  <span v-else>{{
                    userCollections.find((c) => c.id === selectedCollection)?.name
                  }}</span>
                </van-cell>
                <van-popup
                  id="thepop"
                  v-model:show="showCollectionPicker"
                  class="popup"
                  position="top"
                  round
                >
                  <div class="flex-r flex-justify-c" style="height: 100px; width: 100%">
                    <a-select
                      v-model="selectedCollection"
                      :bordered="false"
                      :options="
                        userCollections.map((collection) => ({
                          value: collection.id,
                          label: collection.name
                        }))
                      "
                      :style="{ maxWidth: '400px' }"
                      placeholder="Please select ..."
                      @change="showCollectionPicker = false"
                    ></a-select>
                  </div>
                </van-popup>
                <div v-if="selectedAll" class="operation-container">
                  <van-button
                    :loading="loading"
                    class="operation-btn primary-btn-dark"
                    style="background: white; color: black; border: thin solid lightgray"
                    @click="handleCreateTour"
                  >
                    <span class="btn-text">Save</span>
                  </van-button>
                </div>
              </div>
              <div v-if="isGPX" id="gpx-info" class="result-panel">
                <van-cell class="result-cell">
                  <template #icon>
                    <img
                      :alt="getTourTypeText(createGPXFrom.type)"
                      :src="getTourTypeImg(createGPXFrom.type)"
                      class="menu-icon"
                    />
                  </template>
                  <template #title>
                    <span class="menu-title">{{
                      getTourTypeText(createGPXFrom.type).toUpperCase()
                    }}</span>
                  </template>
                  <van-button
                    :loading="mapContainer?.resultLoading"
                    :loading-text="' loading'"
                    class="adjust-btn"
                    hairline
                    plain
                    size="small"
                    type="primary"
                    @click="alwaysShowTop = !alwaysShowTop"
                  >
                    <span v-if="!alwaysShowTop">ADJUST TYPE</span>
                    <span v-else>HIDE</span>
                  </van-button>
                </van-cell>

                <van-grid :border="false" :gutter="10" class="result-detail">
                  <van-grid-item class="detail-item" icon="clock-o" text="文字">
                    <template #text>
                      <span class="detail-content">
                        {{ Math.round(createGPXFrom.result.time / 60) }} min
                      </span>
                    </template>
                  </van-grid-item>
                  <van-grid-item class="detail-item" icon="aim">
                    <template #text>
                      <span class="detail-content">
                        {{ ((createGPXFrom.result as any).distance / 1000).toFixed(2) }} km
                      </span></template
                    >
                  </van-grid-item>
                  <van-grid-item class="detail-item action-item" icon="revoke" @click="resetForm">
                    <template #text><span class="detail-content"> Return </span></template>
                  </van-grid-item>
                </van-grid>
                <van-cell>
                  <van-field
                    v-model="createGPXFrom.title"
                    class="title-input"
                    label="Tour title"
                    placeholder="Untitled"
                  />
                </van-cell>

                <van-cell class="collection-select" @click="GPXCollectionPicker = true">
                  <!--        <template #icon><img :alt="tourTypeText" :src="tourTypeImg" class="menu-icon" /></template>-->
                  <template #title>
                    <span class="menu-title">Select collection</span>
                  </template>
                  <van-loading v-if="createGPXFrom.tourCollectionId === -1" />
                  <span v-else>{{
                    userCollections.find((c) => c.id === createGPXFrom.tourCollectionId)?.name
                  }}</span>
                </van-cell>
                <van-popup
                  id="thepop"
                  v-model:show="GPXCollectionPicker"
                  class="popup"
                  position="top"
                  round
                >
                  <div class="flex-r flex-justify-c" style="height: 100px; width: 100%">
                    <a-select
                      v-model="createGPXFrom.tourCollectionId"
                      :bordered="false"
                      :options="
                        userCollections.map((collection) => ({
                          value: collection.id,
                          label: collection.name
                        }))
                      "
                      :style="{ maxWidth: '400px' }"
                      placeholder="Please select ..."
                      @change="GPXCollectionPicker = false"
                    ></a-select>
                  </div>
                </van-popup>
                <div class="operation-container">
                  <van-button
                    :loading="loading"
                    class="operation-btn primary-btn-dark"
                    style="background: white; color: black; border: thin solid lightgray"
                    @click="handleGPXTour"
                  >
                    <span class="btn-text">Save</span>
                  </van-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="right" style="flex: 1">
      <MapPlanner
        ref="mapContainer"
        v-model:selectPoint="selectPoint"
        :tour-data="createTourForm"
        @complete="handleMapComplete"
        @update-tour-data="
          (...args: [keyof CreateTourForm, never]) => {
            createTourForm[args[0]] = args[1]
          }
        "
      />
    </div>
  </div>
  <van-overlay id="search-overlay" :lock-scroll="false" :show="showSelector">
    <SearchPlaceView
      @cancel="showSelector = false"
      @reset="
        () => {
          resetForm()
          showSelector = false
        }
      "
      @select="
        (lnglat) => {
          mapContainer.handleSelectPlace(lnglat)
          showSelector = false
        }
      "
    />
  </van-overlay>
</template>

<style scoped>
#mobile-planner #map-container {
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

#mobile-planner #top-menu .outer-container .menu-locations #choose-info {
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 15px;
  padding: 0.5rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

#mobile-planner #top-menu .outer-container .menu-locations .pos-sheet-btn {
  background-color: green;
}

#mobile-planner #top-menu .outer-container .menu-locations #plan-info,
#mobile-planner #top-menu .outer-container .menu-locations #gpx-info {
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 15px;
  padding: 0.5rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

#mobile-planner #top-menu .outer-container .menu-locations #thepop {
  background-color: white;
}
</style>

<script lang="ts">
export default {
  name: 'plannerWebView'
}
</script>
