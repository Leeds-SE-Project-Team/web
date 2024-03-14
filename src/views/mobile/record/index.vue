<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { ElAmap } from '@vuemap/vue-amap'
import { createTourSpot, type CreateTourSpotForm, type TourSpot } from '@/apis/tour/spot'
import { showNotify } from 'vant'
import { parseLocation, parseLocationNumber } from '@/apis/tour'

const zoom = ref(16)
const spotList = ref<TourSpot[]>([])

const center = ref([116.412866, 39.88365])

const draggable = ref(false)

const componentMarker = computed(() => ({
  position: center.value,
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

const geolocationOptions: AMap.GeolocationOptions = {
  // showButton: true, //是否显示定位按钮
  // position: 'RT', //定位按钮的位置
  // /* LT LB RT RB */
  // offset: [39, 200], //定位按钮距离对应角落的距离
  // showMarker: true, //是否显示定位点
  // showCircle: false //是否显示定位精度圈
}

const mapInit = () => {
  // useGeolocation(geolocationOptions).then((res) => {
  //   res.getCurrentPosition().then((currentPosition) => {
  //     center.value = currentPosition.position.toArray()
  //   })
  // })
}

const mapComplete = () => {
  ;(geolocationRef.value.$$getInstance() as AMap.Geolocation).getCurrentPosition((status, info) => {
    if (status === 'SUCCESS') center.value = info.position.toArray()
  })
}

const handleCreateSpot = (form: CreateTourSpotForm) => {
  // uploadFileFromURL(form.imageUrl, getStaticRes(''))

  createTourSpot(form)
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

defineExpose({
  handleCreateSpot
})

const getElasticStyle = (spot: TourSpot) => [
  {
    icon: {
      img: 'https://webapi.amap.com/theme/v1.3/markers/b/mark_bs.png',
      // size: [16, 16], //可见区域的大小
      anchor: 'bottom-center' //锚点
      // imageSize: 0.1
      // fitZoom: 16, //最合适的级别
      // fitZoom: 14, //最合适的级别
      // scaleFactor: 1, //地图放大一级的缩放比例系数
      // maxScale: 2, //最大放大比例
      // minScale: 1 //最小放大比例
    },
    label: {
      content: spot.title,
      position: 'BM'
      // minZoom: 15
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
  selectedSpot.value = spot
  showSpotSheet.value = true
  // const [x, y] = parseLocationNumber(spot.location)
  // moveToPosition([x, y - 0.002])
  // spotPanelHeight.value = spotPanelAnchors[1]
}

const moveToPosition = (position: number[]) => {
  center.value = position
  zoom.value = 16
}

const selectedSpot = ref<TourSpot | undefined>()
watch(selectedSpot, (value) => {
  if (value) {
    const [x, y] = parseLocationNumber(value.location)
    moveToPosition([x, y - 0.002])
    // spotPanelHeight.value = spotPanelAnchors[1]
    showSpotSheet.value = true
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
</script>

<template>
  <div id="page-record">
    <!--    <RecordMap ref="recordMap" />-->
    <div id="map-container">
      <el-amap
        v-model:zoom="zoom"
        :animateEnable="true"
        :center="center"
        :doubleClickZoom="false"
        :scrollWheel="true"
        mapStyle="amap://styles/fresh"
        @complete="mapComplete"
        @init="mapInit"
      >
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
              alt="marker"
              height="32px"
              src="//webapi.amap.com/theme/v1.3/markers/b/mark_bs.png"
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
          color: 'red'
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
          backgroundImage: `url(${selectedSpot.imageUrl})`
        }"
        class="blurImageContainer"
      ></div>
      <div style="text-align: center; padding: 0; order: 1">
        <!--        <h2>Highlight Spot</h2>-->
        <van-image :src="selectedSpot?.imageUrl" height="270" style="margin-top: 20px" />
        <van-divider dashed style="color: wheat; font-size: 25px">
          {{
            (selectedSpot && selectedSpot.title.length > 0
              ? selectedSpot?.title
              : 'untitled'
            )?.toLocaleUpperCase()
          }}
        </van-divider>
      </div>
      <template #cancel>Close</template>
      <template #action="{ action }">
        <div style="order: 3">{{ action.name }}</div>
      </template>
    </van-action-sheet>
    <!--    <van-floating-panel v-model:height="spotPanelHeight" :anchors="spotPanelAnchors">-->
    <!--      <div-->
    <!--        v-if="selectedSpot"-->
    <!--        :style="{-->
    <!--          backgroundImage: `url(${selectedSpot.imageUrl})`-->
    <!--        }"-->
    <!--        class="blurImageContainer"-->
    <!--      ></div>-->
    <!--      <div style="text-align: center; padding: 0">-->
    <!--        &lt;!&ndash;        <h2>Highlight Spot</h2>&ndash;&gt;-->
    <!--        <van-image :src="selectedSpot?.imageUrl" height="270" style="margin-top: 10px" />-->
    <!--        <van-divider dashed style="color: wheat; font-size: 25px">-->
    <!--          {{-->
    <!--            (selectedSpot && selectedSpot.title.length > 0-->
    <!--              ? selectedSpot?.title-->
    <!--              : 'untitled'-->
    <!--            )?.toLocaleUpperCase()-->
    <!--          }}-->
    <!--        </van-divider>-->

    <!--        &lt;!&ndash;        <van-divider dashed style="margin: -18px 0; color: white">What do next?</van-divider>&ndash;&gt;-->
    <!--      </div>-->
    <!--    </van-floating-panel>-->
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
