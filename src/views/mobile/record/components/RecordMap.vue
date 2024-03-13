<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue'
import AMapLoader from '@amap/amap-jsapi-loader'
import { Message } from '@arco-design/web-vue'

const map = ref<AMap.Map>()
const geolocation = ref<any>()
const getCurLocation = () => {
  if (geolocation.value) {
    geolocation.value.getCurrentLocation((cb: any) => {
      console.log(cb)
    })
  } else {
    return undefined
  }
}
defineExpose({ geolocation })

onMounted(() => {
  AMapLoader.load({
    key: import.meta.env.APP_AMAP_KEY, // 申请好的Web端开发者Key，首次调用 load 时必填
    version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: [
      'AMap.MoveAnimation',
      'AMap.Scale',
      'AMap.HawkEye',
      'AMap.ToolBar',
      'AMap.ControlBar',
      'AMap.MouseTool',
      'AMap.Geolocation',
      'AMap.Walking',
      'AMap.Riding'
    ]
  })
    .then((AMap) => {
      /* ---------- 地图实例化 ----------*/
      map.value = new AMap.Map('map-container', {
        viewMode: '2D', // 默认使用 2D 模式，如果希望使用带有俯仰角的 3D 模式，请设置 viewMode: '3D'
        zoom: 17, // 初始化地图层级
        center: [116.397428, 39.90923], // 初始化地图中心点
        // 配置地图截图
        WebGLParams: {
          preserveDrawingBuffer: true
        },
        mapStyle: 'amap://styles/fresh'
      })
      /*---------- 地图实例化 ----------*/

      const scale = new AMap.Scale({
        visible: true
      })
      const toolBar = new AMap.ToolBar({
        visible: true,
        position: {
          top: '110px',
          right: '40px'
        }
      })
      const controlBar = new AMap.ControlBar({
        visible: true,
        position: {
          top: '10px',
          right: '10px'
        }
      })
      // const overView = new AMap.HawkEye({
      //   visible: true
      // })

      /*----------当前位置定位----------*/
      const options = {
        showButton: true, //是否显示定位按钮
        position: 'RT', //定位按钮的位置
        /* LT LB RT RB */
        offset: [39, 200], //定位按钮距离对应角落的距离
        showMarker: true, //是否显示定位点
        showCircle: false //是否显示定位精度圈
      }

      // AMap.plugin(["AMap.Geolocation"], function() {
      geolocation.value = new AMap.Geolocation(options)
      map.value!.addControl(geolocation.value)
      geolocation.value.getCurrentPosition(undefined, undefined, undefined)

      // geolocation.getCurrentPosition(undefined, undefined, undefined)
      // });
      /*----------当前位置定位----------*/

      map.value!.addControl(scale)
      map.value!.addControl(toolBar)
      map.value!.addControl(controlBar)
      // map.value!.addControl(overView)

      map.value!.setFitView()
    })
    .catch((e) => {
      Message.error({
        id: 'AMap',
        content: 'Amap:' + e
      })
    })
})

onUnmounted(() => {
  map.value?.destroy()
})
</script>

<template>
  <div id="map-container" ref="mapRef" />
</template>

<style scoped></style>
