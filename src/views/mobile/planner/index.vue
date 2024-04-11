<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import {
  createTour,
  type CreateTourForm,
  getTourTypeImg,
  getTourTypeText,
  parseLocation,
  type TourRecord,
  TourType,
  tourTypeMap
} from '@/apis/tour'
import type { PickerOption } from 'vant'
import { Message } from '@arco-design/web-vue'
import useLoading from '@/hooks/loading'
import MapPlanner from '@/views/mobile/planner/components/MapPlanner.vue'
import { hapticsImpactLight } from '@/utils'
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
const onConfirm = ({ selectedOptions }: { selectedOptions: PickerOption[] }) => {
  showPicker.value = false
  createTourForm.value.type = selectedOptions[0].value as TourType
}
const onCollectionConfirm = ({ selectedOptions }: { selectedOptions: PickerOption[] }) => {
  showCollectionPicker.value = false
  selectedCollection.value = selectedOptions[0].value as number
}

const userCollections = ref<TourCollection[]>([])
const selectedCollection = ref(-1)

const collectionLoadingObj = useLoading()
const fetchTourCollections = () => {
  // userStore
  //   .getUserRecord()
  //   .then((user) => {
  collectionLoadingObj.setLoading(true)
  getTourCollectionsByCurUser
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
  result: undefined,
  title: 'Untitled'
})

const resetForm = () => {
  createTourForm.value.startLocation = ''
  createTourForm.value.endLocation = ''
  createTourForm.value.result = undefined
  createTourForm.value.title = 'untitled'
}

const mapContainer = ref()
const mapStore = useMapStore()

const formRef = ref()
const { loading, setLoading } = useLoading()

const savedTour = ref<TourRecord>()

const router = useRouter()

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
        title: tourTitleInput.value.length > 0 ? tourTitleInput.value : 'Untitled'
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
                  if (navigate) {
                    router.push({ name: 'record', params: { tourId: savedTour.value.id } })
                  }
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
          console.log(e)
          Message.error(e)
          setLoading(false)
        })
    }
  })
}
const handleScrollPicker = () => {
  hapticsImpactLight()
}

const selectPoint = ref<number[]>()
const pointSheetHeight = ref(0)
const floatSheetHeight = window.innerHeight * 0.35
const floatSheetAnchors = [0, floatSheetHeight]

let timer = 0
watch(selectPoint, (value) => {
  if (value) {
    clearInterval(timer)
    pointSheetHeight.value = floatSheetHeight
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

const sheetData = computed(() => mapContainer.value.sheetData)

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

const selectedAll = computed({
  get: () => createTourForm.value.startLocation && createTourForm.value.endLocation,
  set: () => {
    createTourForm.value.startLocation = ''
    createTourForm.value.endLocation = ''
  }
})

const setCenter = (center: number[] | string[]) => {
  mapContainer.value.center.value = center
  console.log(center)
}

const resultPanelAnchors = [
  Math.round(0.2 * window.innerHeight),
  Math.round(0.4 * window.innerHeight),
  Math.round(0.6 * window.innerHeight)
]
const resultPanelHeight = ref(resultPanelAnchors[2])

const hasPlanned = computed(() => {
  const result = mapContainer.value && mapContainer.value.navigationResult
  if (result) {
    fetchTourCollections()
  }
  return result
})

const alwaysShowTop = ref(false)

const plannedResult = computed(() => mapContainer.value.navigationResult)
const plannedFirstRoute = computed(() =>
  plannedResult.value ? (plannedResult.value as any).routes[0] : undefined
)

const route = useRoute()
const queryLocation = route.query.location
const handleMapComplete = () => {
  if (queryLocation) {
    const location = parseLocation(queryLocation as string).map((i) => parseFloat(i))
    mapContainer.value.handleSelectPlace(new AMap.LngLat(location[0], location[1]))
  }
}

const showSelector = ref(false)

onMounted(() => {
  App.addListener('backButton', () => {
    selectPoint.value = undefined
    showPicker.value = false
  })
})

onUnmounted(() => {
  App.removeAllListeners()
})
</script>

<template>
  <div id="mobile-planner">
    <div id="top-menu">
      <div class="outer-container">
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
            <van-picker
              :columns="tourTypeMap"
              @cancel="showPicker = false"
              @confirm="onConfirm"
              @scroll-into="handleScrollPicker"
            />
          </van-popup>
        </div>
        <div class="menu-locations">
          <van-form
            ref="formRef"
            :style="{ height: (hasPlanned || selectPoint) && !alwaysShowTop ? 0 : '78px' }"
            @submit="handleCreateTour"
          >
            <van-cell-group inset>
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
              v-else-if="!hasPlanned && createTourForm.startLocation && createTourForm.endLocation"
              ><van-loading :size="16"
            /></span>
            <span v-else-if="hasPlanned" @click="alwaysShowTop = !alwaysShowTop"
              >Route planning succeed</span
            >
            <span v-else>Long press to select a point</span>
          </div>
        </div>
      </div>
    </div>
    <div v-if="selectedAll" class="operation-container">
      <van-button
        :loading="loading"
        class="operation-btn primary-btn-dark"
        style="background: white; color: black; border: thin solid lightgray"
        @click="handleCreateTour"
      >
        <span class="btn-text">Save</span>
      </van-button>
      <van-button class="operation-btn primary-btn-dark" @click="handleCreateTour(true)">
        <van-icon :size="23" name="guide-o" style="display: flex"
          ><span class="btn-text" style="font-size: 16px; align-self: center"
            >Navigation</span
          ></van-icon
        >
      </van-button>
    </div>
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
    <van-floating-panel
      v-if="pointSheetHeight > 0"
      id="bottom-menu"
      v-model:height="pointSheetHeight"
      :anchors="floatSheetAnchors"
    >
      <div class="pos-sheet-btn-container">
        <van-button class="pos-sheet-btn primary-btn-dark" @click="handleSelectStart">
          <span class="btn-text">Start here</span>
        </van-button>
        <van-button class="pos-sheet-btn primary-btn-dark" @click="handleSelectEnd">
          <span class="btn-text">Set as end point</span>
        </van-button>
      </div>
      <div class="pos-sheet-text-container">
        <p class="name">New waypoint</p>
        <van-loading v-if="sheetData.loading" class="loading" color="#1989fa" />
        <div v-else>
          <div class="pos-sheet-distance">
            <van-icon :size="23" class="icon" name="location" />
            <span class="text"
              ><span>{{ sheetData.distance }}</span> km away</span
            >
          </div>
          <div class="pos-sheet-location">
            {{ sheetData.address }}
          </div>
        </div>
      </div>
      <div class="space"></div>
    </van-floating-panel>
    <van-floating-panel
      v-if="selectedAll && hasPlanned && !showCollectionPicker"
      v-model:height="resultPanelHeight"
      :anchors="resultPanelAnchors"
      class="result-panel"
    >
      <van-cell class="result-cell">
        <template #icon><img :alt="tourTypeText" :src="tourTypeImg" class="menu-icon" /></template>
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
            <span class="detail-content"> {{ Math.round(plannedFirstRoute?.time / 60) }} min </span>
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
      <van-cell @click="showCollectionPicker = true">
        <!--        <template #icon><img :alt="tourTypeText" :src="tourTypeImg" class="menu-icon" /></template>-->
        <template #title>
          <span class="menu-title">Select collection</span>
        </template>
        <van-loading v-if="selectedCollection === -1" />
        <span v-else>{{ userCollections.find((c) => c.id === selectedCollection)?.name }}</span>
      </van-cell>
      <!--      TODO: tour title-->
      <van-cell>
        <van-field v-model="tourTitleInput" label="Title" placeholder="Untitled" />
      </van-cell>
    </van-floating-panel>
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
  </div>
  <van-overlay id="search-overlay" :show="showSelector">
    <SearchPlaceView
      @cancel="showSelector = false"
      @select="
        (lnglat) => {
          mapContainer.handleSelectPlace(lnglat)
          showSelector = false
        }
      "
    />
  </van-overlay>
</template>

<style scoped></style>

<script lang="ts">
export default {
  name: 'plannerMobileView'
}
</script>
