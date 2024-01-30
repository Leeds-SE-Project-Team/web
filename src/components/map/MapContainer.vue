<!--
JS API Loader是我们提供的 API 加载器，其加载方式为异步加载 JS API 内容，所以在使用 AMap 对象前需进行验证，
这种使用场景下，JS API 不会阻塞页面其他内容的执行和解析，但是脚本解析将有可能发生其他脚本资源执行之后，
因为需要特别处理，以保证在 AMap对象完整生成之后再调用 JS API 的相关接口，否则有可能报错。
-->

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import AMapLoader from '@amap/amap-jsapi-loader'
import { Message } from '@arco-design/web-vue'

const map = ref<any>(null)
const marker = ref<any>(null)

let lineArr = [
  [103.9817, 30.761996],
  [103.985154, 30.758851],
  [103.985929, 30.757237],
  [103.987023, 30.764215],
  [103.989933, 30.769289],
  [103.985644, 30.76618],
  [103.983198, 30.768578],
  [103.976736, 30.768636],
  [103.981473, 30.764366],
  [103.981688, 30.761998]
]

const startAnimation = function () {
  marker.value.moveAlong(lineArr, {
    // 每一段的时长
    duration: 500, //可根据实际采集时间间隔设置
    // JSAPI2.0 是否延道路自动设置角度在 moveAlong 里设置
    autoRotation: true
  })
}

const pauseAnimation = function () {
  marker.value.pauseMove()
}

const resumeAnimation = function () {
  marker.value.resumeMove()
}

const stopAnimation = function () {
  marker.value.stopMove()
}

onMounted(() => {
  AMapLoader.load({
    key: import.meta.env.APP_AMAP_KEY, // 申请好的Web端开发者Key，首次调用 load 时必填
    version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: ['AMap.MoveAnimation'] // 需要使用的的插件列表，如比例尺'AMap.Scale'等
  })
    .then((AMap) => {
      map.value = new AMap.Map('container', {
        // 设置地图容器id
        viewMode: '3D', // 是否为3D地图模式
        zoom: 11, // 初始化地图级别
        center: [103.9817, 30.761996] // 初始化地图中心点位置
      })

      marker.value = new AMap.Marker({
        map: map.value,
        position: [103.9817, 30.761996],
        icon: 'https://a.amap.com/jsapi_demos/static/demo-center-v2/car.png',
        offset: new AMap.Pixel(-13, -26)
      })

      // 绘制轨迹
      new AMap.Polyline({
        map: map.value,
        path: lineArr,
        showDir: true,
        strokeColor: '#28F', //线颜色
        // strokeOpacity: 1,     //线透明度
        strokeWeight: 6 //线宽
        // strokeStyle: "solid"  //线样式
      })

      let passedPolyline = new AMap.Polyline({
        map: map.value,
        strokeColor: '#AF5', //线颜色
        strokeWeight: 6 //线宽
      })

      marker.value.on('moving', function (e) {
        passedPolyline.setPath(e.passedPath)
        map.value.setCenter(e.target.getPosition(), true)
      })

      map.value.setFitView()
    })
    .catch((e) => {
      Message.error({
        id: 'AMap',
        content: e
      })
    })
})

onUnmounted(() => {
  map.value?.destroy()
})

defineExpose({
  startAnimation,
  pauseAnimation,
  resumeAnimation,
  stopAnimation
})
</script>

<template>
  <div id="container"></div>
</template>
