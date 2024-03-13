<script lang="ts" setup>
import { computed, ref } from 'vue'
import { ElAmap, ElAmapElasticMarker, useGeolocation } from '@vuemap/vue-amap'
import { createTourSpot, type CreateTourSpotForm, type TourSpot } from '@/apis/tour/spot'
import { showNotify } from 'vant'
import { parseLocation } from '@/apis/tour'

const zoom = ref(16)
const spotList = ref<TourSpot[]>([])

const curPosition = ref([116.412866, 39.88365])

const draggable = ref(false)

const componentMarker = computed(() => ({
  position: curPosition.value,
  visible: true,
  draggable: false,
  zoomStyleMapping: {
    14: 0,
    15: 0,
    16: 1,
    17: 1,
    18: 1,
    19: 1,
    20: 1
  },
  styles: [
    {
      icon: {
        img: 'https://a.amap.com/jsapi_demos/static/resource/img/故宫.png',
        size: [16, 16], //可见区域的大小
        anchor: 'bottom-center', //锚点
        fitZoom: 14, //最合适的级别
        scaleFactor: 2, //地图放大一级的缩放比例系数
        maxScale: 2, //最大放大比例
        minScale: 1 //最小放大比例
      },
      label: {
        content: '祈年殿',
        position: 'BM',
        minZoom: 15
      }
    },
    {
      icon: {
        img: 'https://a.amap.com/jsapi_demos/static/resource/img/qiniandian.png',
        size: [128, 160],
        anchor: 'bottom-center',
        fitZoom: 17.5,
        scaleFactor: 2,
        maxScale: 2,
        minScale: 0.125
      },
      label: {
        content: '祈年殿',
        position: 'BM'
      }
    }
  ]
}))

const changeVisible = () => {
  componentMarker.value.visible = !componentMarker.value.visible
}

const clickMap = (e: any) => {
  // console.log('click map: ', e)
}
const initMap = (map: any) => {
  // console.log('init map: ', map)
}

const changeDraggable = () => {
  componentMarker.value.draggable = !componentMarker.value.draggable
}
const clickMarker = () => {
  alert('点击了标号')
}

const markerInit = (e) => {
  // console.log('marker init: ', e)
}

const mapInit = () => {
  useGeolocation().then((res) => {
    res.getCurrentPosition().then((currentPosition) => {
      curPosition.value = currentPosition.position.toArray()
    })
  })
}

const handleCreateSpot = (form: CreateTourSpotForm) => {
  createTourSpot(form)
    .then((apiRes) => {
      if (apiRes.success) {
        spotList.value.push(apiRes.data!)
        showNotify({ type: 'success', message: apiRes.message })
      } else {
        showNotify({ type: 'primary', message: apiRes.message })
      }
    })
    .catch((e) => {
      // 成功通知
      showNotify({ type: 'danger', message: e })
    })
}

defineExpose({
  handleCreateSpot
})

const getElasticStyle = (spot: TourSpot) => [
  {
    icon: {
      img: spot.imageUrl,
      size: [16, 16], //可见区域的大小
      anchor: 'bottom-center', //锚点
      fitZoom: 17.5, //最合适的级别
      // fitZoom: 14, //最合适的级别
      scaleFactor: 2, //地图放大一级的缩放比例系数
      maxScale: 2, //最大放大比例
      minScale: 1 //最小放大比例
    },
    label: {
      content: spot.title,
      position: 'BM',
      minZoom: 15
    }
  },
  {
    icon: {
      img: spot.imageUrl,
      size: [128, 160],
      anchor: 'bottom-center',
      fitZoom: 17.5,
      // fitZoom: 17.5,
      scaleFactor: 2,
      maxScale: 2,
      minScale: 0.125
    },
    label: {
      content: spot.title,
      position: 'BM'
    }
  }
]
</script>

<template>
  <div id="page-record">
    <!--    <RecordMap ref="recordMap" />-->
    <div id="map-container">
      <el-amap :center="curPosition" :zoom="zoom" @init="mapInit">
        <el-amap-elastic-marker
          v-for="(spot, idx) in spotList"
          :key="idx"
          :position="parseLocation(spot.location)"
          :styles="getElasticStyle(spot)"
          :visible="true"
          :zoom-style-mapping="{
            14: 0,
            15: 0,
            16: 1,
            17: 1,
            18: 1,
            19: 1,
            20: 1
          }"
          @init="markerInit"
        />
        <!--        <el-amap-elastic-marker-->
        <!--          :draggable="componentMarker.draggable"-->
        <!--          :position="componentMarker.position"-->
        <!--          :styles="componentMarker.styles"-->
        <!--          :visible="componentMarker.visible"-->
        <!--          :zoom-style-mapping="componentMarker.zoomStyleMapping"-->
        <!--          title="标号"-->
        <!--          @click="clickMarker"-->
        <!--          @init="markerInit"-->
        <!--        />-->
      </el-amap>
    </div>
  </div>
</template>

<style scoped></style>

<script lang="ts">
export default {
  name: 'MobileRecord'
}
</script>
