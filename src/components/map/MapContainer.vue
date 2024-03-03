<!--
JS API Loader是我们提供的 API 加载器，其加载方式为异步加载 JS API 内容，所以在使用 AMap 对象前需进行验证，
这种使用场景下，JS API 不会阻塞页面其他内容的执行和解析，但是脚本解析将有可能发生其他脚本资源执行之后，
因为需要特别处理，以保证在 AMap对象完整生成之后再调用 JS API 的相关接口，否则有可能报错。
-->

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, type UnwrapRef, watch } from 'vue'
import AMapLoader from '@amap/amap-jsapi-loader'
import { Message } from '@arco-design/web-vue'
import { type CreateTourForm, parseLocation, TourType } from '@/apis/tour'
import { Screenshot } from '@amap/screenshot'

const map = ref<any>(null)
const screenshot = ref<Screenshot | null>(null)
const mapRef = ref<HTMLDivElement | null>(null)

// TODO: screen shot
// API documentation: https://github.com/AMap-Web/amap-screenshot

const screenMap = () => {
  if(mapRef.value){
    const canvas = mapRef.value.getElementsByTagName('canvas');
    console.log(canvas[0].toDataURL('image/jpeg', 1.0));
  }
}

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

// 解析WalkRoute对象，构造成AMap.Polyline的path参数需要的格式
// WalkRoute对象的结构文档 https://lbs.amap.com/api/javascript-api/reference/route-search#m_WalkRoute
const parseRouteToPath = (route: any) => {
  const path = []

  for (let i = 0, l = route.steps.length; i < l; i++) {
    const step = route.steps[i]

    for (let j = 0, n = step.path.length; j < n; j++) {
      path.push(step.path[j])
    }
  }

  return path
}

const drawRoute = (route: any) => {
  const path = parseRouteToPath(route)

  const startMarker = new AMap.Marker({
    position: path[0],
    icon: 'https://webapi.amap.com/theme/v1.3/markers/n/start.png',
    map: map.value,
    anchor: 'bottom-center'
  })

  const endMarker = new AMap.Marker({
    position: path[path.length - 1],
    icon: 'https://webapi.amap.com/theme/v1.3/markers/n/end.png',
    map: map.value,
    anchor: 'bottom-center'
  })

  const routeLine = new AMap.Polyline({
    path: path,
    isOutline: true,
    outlineColor: '#ffeeee',
    borderWeight: 2,
    strokeWeight: 5,
    strokeColor: '#0091ff',
    strokeOpacity: 0.9,
    lineJoin: 'round'
  })

  map.value.add(routeLine)

  // 调整视野达到最佳显示区域
  map.value.setFitView([startMarker, endMarker, routeLine])
}

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

const emits = defineEmits(['update-createTourForm'])
const props = defineProps<{
  createTourForm: UnwrapRef<CreateTourForm>
}>()

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
        zoom: 11, // 初始化地图层级
        center: [116.397428, 39.90923], // 初始化地图中心点
        // 配置地图截图
        WebGLParams: {
          preserveDrawingBuffer: true
        }
      })
      /*---------- 地图实例化 ----------*/

      /*---------- 创建右键菜单 ----------*/
      const contextMenu = new AMap.ContextMenu()
      let contextMenuPosition: AMap.LngLat
      // 选择目的地
      contextMenu.addItem(
        'Set as Destination',
        function (e: any) {
          let form = props.createTourForm
          form.endLocation = `${contextMenuPosition.lng},${contextMenuPosition.lat}`
          emits('update-createTourForm', form)
          nextTick(() => {
            if (form.startLocation.length > 0) {
              scheduleRoute(props.createTourForm.type)
            }
          })
        },
        0
      )

      // 选择起点
      contextMenu.addItem(
        'Start here',
        function () {
          let form = props.createTourForm
          form.startLocation = `${contextMenuPosition.lng},${contextMenuPosition.lat}`
          emits('update-createTourForm', form)
          nextTick(() => {
            if (form.endLocation.length > 0) {
              scheduleRoute(props.createTourForm.type)
            }
          })
        },
        1
      )

      //右键显示全国范围
      // contextMenu.addItem(
      //   '缩放至全国范围',
      //   function (e: any) {
      //     map.value.setZoomAndCenter(4, [108.946609, 34.262324])
      //   },
      //   2
      // )

      //右键添加Marker标记
      // contextMenu.addItem(
      //   'Add PON',
      //   function (e: any) {
      //     const marker = new AMap.Marker({
      //       map: map.value,
      //       position: contextMenuPosition //基点位置
      //     })
      //   },
      //   3
      // )

      //地图绑定鼠标右击事件——弹出右键菜单
      map.value.on('rightclick', function (e: any) {
        contextMenu.open(map.value, e.lnglat)
        contextMenuPosition = e.lnglat
      })

      // contextMenu.open(map, lnglat)
      /*---------- 创建右键菜单 ----------*/

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
      const overView = new AMap.HawkEye({
        visible: true
      })

      /*----------当前位置定位----------*/
      const options = {
        showButton: true, //是否显示定位按钮
        position: 'RT', //定位按钮的位置
        /* LT LB RT RB */
        offset: [39, 200], //定位按钮距离对应角落的距离
        showMarker: true, //是否显示定位点
        markerOptions: {
          //自定义定位点样式，同Marker的Options
          offset: new AMap.Pixel(-18, -36),
          content:
            '<img src="https://a.amap.com/jsapi_demos/static/resource/img/user.png" style="width:36px;height:36px" alt="current position"/>'
        },
        showCircle: true, //是否显示定位精度圈
        circleOptions: {
          //定位精度圈的样式
          isVisible: false,
          strokeColor: '#0093FF',
          noSelect: true,
          strokeOpacity: 0.5,
          strokeWeight: 1,
          fillColor: '#02B0FF',
          fillOpacity: 0.25
        }
      }

      // AMap.plugin(["AMap.Geolocation"], function() {
      const geolocation = new AMap.Geolocation(options)
      map.value.addControl(geolocation)
      geolocation.getCurrentPosition(undefined, undefined, undefined)
      // });
      /*----------当前位置定位----------*/

      /*----------步行配置----------*/
      const walkOption = {
        map: map,
        panel: 'panel',
        hideMarkers: false,
        isOutline: true,
        outlineColor: '#ffeeee',
        autoFitView: true
      }
      // 步行导航
      const walking = new AMap.Walking(walkOption)
      /*----------步行配置----------*/

      /*----------骑行配置----------*/
      const ridingOption = {
        map: map,
        panel: 'panel',
        policy: 1,
        hideMarkers: false,
        isOutline: true,
        outlineColor: '#ffeeee',
        autoFitView: true
      }
      const cycling = new AMap.Riding(ridingOption)
      /*----------骑行配置----------*/

      /*----------开始导航----------*/
      const getTypeObject = (type: TourType) => {
        switch (type) {
          case TourType.WALK:
            return walking
          case TourType.CYCLING:
            return cycling
          case TourType.DRIVE:
          case TourType.RUNNING:
          default:
            throw 'no such method'
        }
      }

      const scheduleRoute = (type: TourType) => {
        const typeObject = getTypeObject(type)

        //根据起终点坐标规划路线
        typeObject.search(
          parseLocation(props.createTourForm.startLocation),
          parseLocation(props.createTourForm.endLocation),
          function (status: any, result: any) {
            // result即是对应的路线数据信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_RidingResult
            if (status === 'complete') {
              Message.success('路线数据查询成功')
              drawRoute(result.routes[0])
            } else {
              Message.error('路线数据查询失败' + result)
              console.log(result)
            }
          }
        )
      }
      /*----------开始导航----------*/

      map.value.addControl(scale)
      map.value.addControl(toolBar)
      map.value.addControl(controlBar)
      map.value.addControl(overView)
      // map.value = new AMap.Map('container', {
      //   // 设置地图容器id
      //   viewMode: '3D', // 是否为3D地图模式
      //   zoom: 11, // 初始化地图级别
      //   center: [103.9817, 30.761996] // 初始化地图中心点位置
      // })

      // marker.value = new AMap.Marker({
      //   map: map.value,
      //   position: [103.9817, 30.761996],
      //   icon: 'https://a.amap.com/jsapi_demos/static/demo-center-v2/car.png',
      //   offset: new AMap.Pixel(-13, -26)
      // })
      //
      // // 绘制轨迹
      // new AMap.Polyline({
      //   map: map.value,
      //   path: lineArr,
      //   showDir: true,
      //   strokeColor: '#28F', //线颜色
      //   // strokeOpacity: 1,     //线透明度
      //   strokeWeight: 6 //线宽
      //   // strokeStyle: "solid"  //线样式
      // })
      //
      // let passedPolyline = new AMap.Polyline({
      //   map: map.value,
      //   strokeColor: '#AF5', //线颜色
      //   strokeWeight: 6 //线宽
      // })
      //
      // marker.value.on('moving', function (e) {
      //   passedPolyline.setPath(e.passedPath)
      //   map.value.setCenter(e.target.getPosition(), true)
      // })
      //

      map.value.setFitView()
      screenshot.value = new Screenshot(map.value);
    })
    .catch((e) => {
      Message.error({
        id: 'AMap',
        content: 'Amap' + e
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
  stopAnimation,
  screenMap
})
</script>

<template>
  <div ref="mapRef" id="map-container"></div>
  <div id="panel"></div>
</template>
