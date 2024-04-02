<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import {
  createTour,
  type CreateTourForm,
  getTourTypeImg,
  getTourTypeText,
  TourType,
  tourTypeMap
} from '@/apis/tour'
import type { PickerOption } from 'vant'
import { Message } from '@arco-design/web-vue'
import useLoading from '@/hooks/loading'
import MapPlanner from '@/views/planner/components/MapPlanner.vue'
import { hapticsImpactLight } from '@/utils'
import { App } from '@capacitor/app'
import { useMapStore } from '@/stores/map'

const tourTypeText = computed<string>(() => getTourTypeText(createTourForm.value.type))
const tourTypeImg = computed<string>(() => getTourTypeImg(createTourForm.value.type))

const showPicker = ref(false)

const onConfirm = ({ selectedOptions }: { selectedOptions: PickerOption[] }) => {
  showPicker.value = false
  createTourForm.value.type = selectedOptions[0].value as TourType
}

const createTourForm = ref<CreateTourForm>({
  startLocation: '',
  endLocation: '',
  type: TourType.WALK,
  pons: [],
  tourCollectionId: 1
})

const mapContainer = ref()
const mapStore = useMapStore()

const formRef = ref()
const { loading, setLoading } = useLoading()
const handleCreateTour = () => {
  formRef.value.validate().then((e: any) => {
    if (!e) {
      setLoading(true)
      createTour(createTourForm.value)
        .then((res) => {
          if (res.success) {
            Message.success(res.message)
            console.log(mapStore.screenMap(mapContainer.value.mapRef.$$getInstance()))
          } else {
            Message.info(res.message)
          }
        })
        .catch((e) => {
          console.log(e)
          Message.error(e)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  })
}
const handleScrollType = () => {
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
        <div class="menu-select">
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
              @scroll-into="handleScrollType"
            />
          </van-popup>
        </div>
        <div class="menu-locations">
          <van-form ref="formRef" @submit="handleCreateTour">
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
              >
                <template #extra>
                  <van-icon class="field-icon" color="white" name="wap-nav" size="20" />
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
              >
                <template #extra>
                  <van-icon class="field-icon" color="white" name="wap-nav" size="20" />
                </template>
              </van-field>
            </van-cell-group>
          </van-form>
          <div class="hint"><span>Long press to select a point</span></div>
        </div>
      </div>
    </div>
    <div v-if="selectedAll" class="operation-container">
      <van-button
        class="operation-btn primary-btn-dark"
        style="background: white; color: black; border: thin solid lightgray"
        @click="handleCreateTour"
      >
        <span class="btn-text">Save</span>
      </van-button>
      <van-button class="operation-btn primary-btn-dark">
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
      v-model:tour-data="createTourForm"
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
            <!--          Southwest Jiaotong University Xipu Campus, Pidu, Chengdu, Sichuan-->
          </div>
        </div>
      </div>
      <div class="space"></div>
    </van-floating-panel>
  </div>
</template>

<style scoped></style>

<script lang="ts">
export default {
  name: 'plannerMobileView'
}
</script>
