import type { TourRecord } from '@/apis/tour'

export interface TourSpot {
  id: number
  title: string
  coverUrl: string
}

export const getTourSpotExample = (num: number): TourSpot => {
  return {
    coverUrl: import.meta.env.APP_STATIC_URL.concat(`/tour/example/${num}.png`),
    id: 1,
    title: `Tour Spot Example ${num}`
  }
}
