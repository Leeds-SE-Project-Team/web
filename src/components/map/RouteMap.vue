<template>
    <div ref="mapRef" id="route-map"></div>
</template>

<script setup lang="ts">
import AMapLoader from '@amap/amap-jsapi-loader'
import { onMounted, onUnmounted, ref } from 'vue';

const map = ref<AMap.Map|null>(null)

onMounted(()=>{
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
  }).then(
    (AMap)=>{
        /* ---------- 地图实例化 ----------*/
      map.value = new AMap.Map('route-map', {
        viewMode: '2D', // 默认使用 2D 模式，如果希望使用带有俯仰角的 3D 模式，请设置 viewMode: '3D'
        zoom: 11, // 初始化地图层级
        center: [116.397428, 39.90923], // 初始化地图中心点
        // 配置地图截图
        WebGLParams: {
          preserveDrawingBuffer: true
        }
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

      map.value!.addControl(scale)
      map.value!.addControl(toolBar)
      map.value!.addControl(controlBar)
      map.value!.setFitView()
    }
  )
})

onUnmounted(()=>{
    map.value?.destroy()
})
</script>