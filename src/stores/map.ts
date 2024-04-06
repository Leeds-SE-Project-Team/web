import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getCurrentLocation } from '@/utils'
import type { TourType } from '@/apis/tour'
import { Message } from '@arco-design/web-vue'

export const useMapStore = defineStore('map', () => {
  const getGeocoder = (config?: {
    radius: 1000 //以已知坐标为中心点，radius为半径，返回范围内兴趣点和道路信息
    extensions: 'all' //返回地址描述以及附近兴趣点和道路信息，默认“base”
  }) => {
    const geocoder = ref()
    AMap.plugin('AMap.Geocoder', function () {
      geocoder.value = new (AMap as any).Geocoder(config)
    })
    return geocoder.value
  }

  const getDistance = (posA: AMap.LngLat, posB: AMap.LngLat) => {
    return posA.distance(posB)
  }

  const currentLocation = ref([116.412866, 39.88365])

  const updateCurrentLocation = (value?: number[]) => {
    if (value === undefined) {
      getCurrentLocation().then((res) => {
        console.log(res)
        currentLocation.value = res.position
      })
    } else {
      currentLocation.value = value
    }
  }

  /**
   * 将路径数据转为经纬度数组
   * @param route 路径数据
   * @param other 是否跳过处理,用于对GPX的处理,默认为 false
   */
  const parseRouteToPath = (route: any, other?: boolean) => {
    if (other) {
      return route
    }
    const path = []

    for (let i = 0, l = route.steps.length; i < l; i++) {
      const step = route.steps[i]

      for (let j = 0, n = step.path.length; j < n; j++) {
        path.push(step.path[j])
      }
    }

    return path
  }

  const drawRoute = (
    mapInstance: AMap.Map,
    route: any,
    options: {
      startMarker?: boolean
      endMarker?: boolean
      routeLine?: boolean
      reCenter?: boolean
      lineOptions?: AMap.BezierCurveOptions
    },
    other?: boolean
  ) => {
    const path = parseRouteToPath(route, other)

    let startMarker
    if (options.startMarker !== false) {
      startMarker = new AMap.Marker({
        position: path[0],
        icon: 'https://webapi.amap.com/theme/v1.3/markers/n/start.png',
        map: mapInstance,
        anchor: 'bottom-center'
      })
    }

    let endMarker
    if (options.endMarker !== false) {
      endMarker = new AMap.Marker({
        position: path[path.length - 1],
        icon: 'https://webapi.amap.com/theme/v1.3/markers/n/end.png',
        map: mapInstance,
        anchor: 'bottom-center'
      })
    }

    let routeLine
    if (options.routeLine !== false) {
      routeLine = new AMap.Polyline({
        path: path,
        isOutline: true,
        outlineColor: '#ffeeee',
        borderWeight: 2,
        strokeWeight: 5,
        strokeColor: '#0091ff',
        strokeOpacity: 0.9,
        lineJoin: 'round',
        ...options.lineOptions
      })
    }

    if (routeLine) {
      mapInstance.add(routeLine)
    }
    const compArr: AMap.VectorLayer | AMap.Overlay[] = [
      startMarker!,
      endMarker!,
      routeLine!
    ].filter((e) => !!e)
    // 调整视野达到最佳显示区域
    if (options.reCenter !== false) {
      mapInstance.setFitView(compArr)
    }
    return compArr
  }

  const planRoute = (
    startLocation: number[] | string[],
    endLocation: number[] | string[],
    tourType: TourType,
    mapInstance: AMap.Map
  ): Promise<any> =>
    new Promise((resolve) => {
      mapInstance.clearMap()

      const walkOption = {
        map: mapInstance,
        panel: 'panel',
        hideMarkers: false,
        isOutline: true,
        outlineColor: '#ffeeee',
        autoFitView: true
      }
      const walking = new (AMap as any).Walking(walkOption)

      walking.search(startLocation, endLocation, function (status: any, result: any) {
        // result即是对应的路线数据信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_RidingResult
        if (status === 'complete') {
          // showNotify({ type: 'success', message: '路线数据查询成功' })
          // drawRoute(result.routes[0])
          // console.log(result)
          resolve(result)
        } else {
          Message.error('路线数据查询失败' + result)
        }
      })
    })

  const screenMap = (mapRef: AMap.Map) => {
    if (mapRef) {
      const canvas = mapRef.canvas!
      return canvas.toDataURL('image/jpeg', 1.0)
    }
  }

  return {
    getGeocoder,
    getDistance,
    currentLocation,
    updateCurrentLocation,
    parseRouteToPath,
    planRoute,
    screenMap,
    drawRoute
  }
})
