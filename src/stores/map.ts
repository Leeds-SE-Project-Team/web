import { defineStore } from 'pinia'
import { ref } from 'vue'

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

  return {
    getGeocoder
  }
})
