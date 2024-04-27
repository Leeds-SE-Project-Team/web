import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getCurrentLocation } from '@/utils'
import { TourType } from '@/apis/tour'
import { Message } from '@arco-design/web-vue'

export const useMapStore = defineStore('map', () => {
  const getGeocoder = (config?: any) => {
    const geocoder = ref()
    AMap.plugin('AMap.Geocoder', function () {
      geocoder.value = new (AMap as any).Geocoder({
        // radius: 1000, //以已知坐标为中心点，radius为半径，返回范围内兴趣点和道路信息
        extensions: 'base', //返回地址描述以及附近兴趣点和道路信息，默认“base”
        // lang: 'en',
        ...config
      })
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
        currentLocation.value = res.position
      })
    } else {
      currentLocation.value = value
    }
  }

  /**
   * 将路径数据转为经纬度数组
   * @param route 路径数据
   * @param tourType
   * @param other 是否跳过处理,用于对GPX的处理,默认为 false
   */
  const parseRouteToPath = (route: any, tourType: TourType, other?: boolean) => {
    if (other) {
      return route
    }
    switch (tourType) {
      case TourType.WALK:
        route = route.steps
        break
      case TourType.CYCLING:
        route = route.rides
        break
      case TourType.CAR:
        route = route.steps
        break
      case TourType.PUBLIC:
        break
    }

    const path = []

    for (let i = 0, l = route.length; i < l; i++) {
      const step = route[i]

      for (let j = 0, n = step.path.length; j < n; j++) {
        path.push(step.path[j])
      }
    }

    return path
  }

  const drawRoute = (
    mapInstance: AMap.Map,
    route: any,
    tourType: TourType,
    options: {
      startMarker?: boolean
      endMarker?: boolean
      routeLine?: boolean
      reCenter?: boolean
      lineOptions?: AMap.BezierCurveOptions
    },
    other?: boolean
  ) => {
    const path = parseRouteToPath(route, tourType, other)

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
    const compArr: AMap.Overlay[] = [
      (startMarker! as AMap.Overlay),
      (endMarker! as AMap.Overlay),
      (routeLine! as AMap.Overlay)
    ]
    // 调整视野达到最佳显示区域
    if (options.reCenter !== false) {
      mapInstance.setFitView(compArr)
    }
    return compArr
  }

  const planRoute = (
    startLocation: number[] | string[],
    endLocation: number[] | string[],
    pons: number[][] | string[][],
    tourType: TourType,
    mapInstance: AMap.Map
  ): Promise<any> =>
    new Promise((resolve) => {
      const navigateOption = {
        map: mapInstance,
        hideMarkers: false,
        isOutline: true,
        outlineColor: '#ffeeee',
        autoFitView: true
      }
      let navigate: any
      const searchArgs = [startLocation, endLocation] as any[]

      switch (tourType) {
        case TourType.WALK: // 徒步
          navigate = new (AMap as any).Walking(navigateOption)
          break
        case TourType.CYCLING: // 自行车
          navigate = new (AMap as any).Riding(navigateOption)
          break
        case TourType.CAR: // 驾车
          navigate = new (AMap as any).Driving(navigateOption)
          searchArgs.push({ waypoints: pons }) // 添加必经点
          break
        case TourType.PUBLIC: // 公交
          navigate = new (AMap as any).Transfer(navigateOption)
          break
      }

      // 规划路径并返回结果
      navigate.search(...searchArgs, function (status: any, result: any) {
        if (status === 'complete') {
          resolve({ result, navigate })
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

  const searchPlace = (keywords: string, options?: any) =>
    new Promise((resolve, reject) => {
      AMap.plugin('AMap.PlaceSearch', function () {
        const autoOptions = {
          // city: '成都', // TODO: 修改默认城市为当前城市
          type: '', //数据类别
          pageSize: 10, //每页结果数,默认10
          pageIndex: 1, //请求页码，默认1
          extensions: 'base', //返回信息详略，默认为base（基本信息）
          // lang: 'en',
          ...options
        }
        const placeSearch = new (AMap as any).PlaceSearch(autoOptions)
        placeSearch.search(keywords, function (status: any, result: any) {
          // 搜索成功时，result即是对应的匹配数据
          if (status === 'complete') {
            resolve(result)
          } else {
            reject(result)
          }
        })
      })
    }) as Promise<any>

  return {
    getGeocoder,
    getDistance,
    currentLocation,
    updateCurrentLocation,
    parseRouteToPath,
    planRoute,
    screenMap,
    drawRoute,
    searchPlace
  }
})
