<script lang="ts" setup>
import { computed, reactive, ref } from 'vue'
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
import {
  hapticsImpactLight,
  hapticsSelectionChanged,
  hapticsSelectionEnd,
  hapticsSelectionStart
} from '@/utils'

const tourTypeText = computed<string>(() => getTourTypeText(createTourForm.type))
const tourTypeImg = computed<string>(() => getTourTypeImg(createTourForm.type))

const showPicker = ref(false)

const onConfirm = ({ selectedOptions }: { selectedOptions: PickerOption[] }) => {
  showPicker.value = false
  createTourForm.type = selectedOptions[0].value as TourType
}

const createTourForm = reactive<CreateTourForm>({
  startLocation: '',
  endLocation: '',
  type: TourType.WALK,
  pons: [],
  tourCollectionId: 1
})

const mapContainer = ref()

const formRef = ref()
const { loading, setLoading } = useLoading()
const handleCreateTour = () => {
  formRef.value.validate().then((e: any) => {
    if (!e) {
      setLoading(true)
      createTour(createTourForm)
        .then((res) => {
          if (res.success) {
            Message.success(res.message)
            mapContainer.value.screenMap()
          } else {
            Message.info(res.message)
          }
        })
        .catch((e) => {
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
          <van-popup v-model:show="showPicker" position="bottom" round>
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
        </div>
      </div>
    </div>
    <MapPlanner />
  </div>
</template>

<style scoped></style>

<script lang="ts">
export default {
  name: 'plannerMobileView'
}
</script>
