import { type ApiResponse, axiosRequest } from '@/apis'
import type { TourImage } from '@/apis/tour'

export interface TourSpot {
  id: number
  tourId: number
  tourImages: TourImage[]
  location: string
}

export interface CreateTourSpotForm {
  imageUrl: string
  location: string
  tourId: number
}

export const getTourSpots = (): Promise<ApiResponse<TourSpot[]>> =>
  axiosRequest({
    method: 'GET',
    url: 'tour_spot/all'
  })

export const getTourSpotExample = (num: number): TourSpot => {
  return {
    location: '',
    tourImages: [], // import.meta.env.APP_STATIC_URL.concat(`/tour/example/${num}.png`)
    id: 1,
    tourId: 1
  }
}

export const createTourSpot = (form: CreateTourSpotForm): Promise<ApiResponse<TourSpot>> =>
  axiosRequest({
    method: 'POST',
    url: 'tour_spot/create',
    data: form
  })

export const deleteTourSpot = (spotId: number): Promise<ApiResponse<void>> =>
  axiosRequest({
    method: 'DELETE',
    url: `tour_spot?id=${spotId}`
  })
