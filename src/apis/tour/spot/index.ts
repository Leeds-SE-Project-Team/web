import { type ApiResponse, axiosRequest } from '@/apis'

export interface TourSpot {
  id: number
  title: string
  imageUrl: string
  location: string
}

export interface CreateTourSpotForm {
  title: string
  imageUrl: string
  location: string
  tourId: number
}

export const getTourSpotExample = (num: number): TourSpot => {
  return {
    location: '',
    imageUrl: import.meta.env.APP_STATIC_URL.concat(`/tour/example/${num}.png`),
    id: 1,
    title: `Tour Spot Example ${num}`
  }
}

export const createTourSpot = (form: CreateTourSpotForm): Promise<ApiResponse<TourSpot>> =>
  axiosRequest({
    method: 'POST',
    url: 'tour_spot/create',
    data: form
  })
