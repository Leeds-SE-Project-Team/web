<script lang="ts" setup>
import MapContainer from '@/components/map/MapContainer.vue'
import { ref } from 'vue'
import { createTour, type CreateTourForm, TourType } from '@/apis/tour'
import { Message } from '@arco-design/web-vue'
import useLoading from '@/hooks/loading'

const customStyle = {
  borderRadius: '6px',
  marginBottom: '18px',
  border: 'none',
  overflow: 'hidden'
}

const createTourForm = ref<CreateTourForm>({
  startLocation: '',
  endLocation: '',
  type: TourType.WALK,
  pons: [],
  tourCollectionId: 1
})

const mapContainer = ref()

const { loading, setLoading } = useLoading()
const handleCreateTour = () => {
  setLoading(true)
  createTour(createTourForm.value)
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
</script>

<template>
  <!-- the section of route planner sider -->
  <section class="sider">
    <div class="top">
      <!-- search bar input part -->
      <div class="search">
        <a-input allow-clear class="input" placeholder="Search For Place Or Address" />
      </div>

      <!-- tool part -->
      <div class="tool">
        <a-collapse accordion expand-icon-position="right">
          <a-collapse-item key="1" :style="customStyle" header="Sports">
            <div>Beijing Toutiao Technology Co., Ltd.</div>
          </a-collapse-item>
          <a-collapse-item key="2" :style="customStyle" header="Fitness">
            <div>Beijing Toutiao Technology Co., Ltd.</div>
          </a-collapse-item>
          <!--          <a-collapse-item-->
          <!--            :style="customStyle"-->
          <!--            header="Beijing Toutiao Technology Co., Ltd."-->
          <!--            key="3"-->
          <!--          >-->
          <!--            <div>Beijing Toutiao Technology Co., Ltd.</div>-->
          <!--          </a-collapse-item>-->
        </a-collapse>
      </div>
    </div>

    <div class="middle">
      <!-- place part -->
      <div class="place">
        <div>
          <a-input
            v-model:model-value="createTourForm.startLocation"
            allow-clear
            class="place-input"
            placeholder="Enter Starting Point"
          >
            <template #prefix>A</template>
            <!--            <template #append><icon-delete /></template>-->
          </a-input>
        </div>
        <div>
          <a-input
            v-model:model-value="createTourForm.endLocation"
            allow-clear
            class="place-input"
            placeholder="Enter Destination"
          >
            <template #prefix>B</template>
          </a-input>
        </div>
      </div>

      <!-- icon part -->
      <div class="icons-part">
        <div></div>
        <div></div>
        <div class="right-icon">
          <svg
            aria-hidden="true"
            class="css-rjl6tn"
            fill="none"
            role="presentation"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clip-rule="evenodd"
              d="M2 12C2 6.48 6.48 2 12 2s10 4.48 10 10-4.48 10-10 10S2 17.52 2 12zm8.25.25c0-.963.787-1.75 1.75-1.75s1.75.787 1.75 1.75S12.963 14 12 14s-1.75-.787-1.75-1.75zm7-1.75c-.962 0-1.75.787-1.75 1.75S16.288 14 17.25 14 19 13.213 19 12.25s-.788-1.75-1.75-1.75zM5 12.25c0-.963.787-1.75 1.75-1.75s1.75.787 1.75 1.75S7.713 14 6.75 14 5 13.213 5 12.25z"
              fill="currentColor"
              fill-rule="evenodd"
            ></path>
          </svg>
        </div>
      </div>
    </div>

    <div class="bottom">
      <div class="route-img">
        <img alt="route" src="/route/route.png" />
      </div>
      <div class="route-text">
        <h3 class="header">Where do you want to go?</h3>
<!--        <p class="text">Enter a destination or click on the map to add it.</p>-->
      </div>
      <a-button :loading="loading" style="width: 100px" @click="handleCreateTour">创建</a-button>
    </div>
  </section>

  <MapContainer ref="mapContainer" v-model:create-tour-form="createTourForm" />
</template>

<style scoped></style>

<script lang="ts">
export default {
  name: 'PlannerView'
}
</script>
