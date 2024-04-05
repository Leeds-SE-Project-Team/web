import { type ApiResponse, axiosRequest } from '@/apis'
import type { TourImage } from '@/apis/tour'

export interface TourHighlight {
  id: number
  title: string
  toursId: number[]
  tourImages: TourImage[]
  location: string
}

export interface CreateTourHighlightForm {
  title: string
  imageUrl: string
  location: string
  tourId: number
}

export const getTourHighlights = (): Promise<ApiResponse<TourHighlight[]>> =>
  axiosRequest({
    method: 'GET',
    url: 'tour_highlight/all'
  })

export const getTourHighlightExample = (num: number): TourHighlight => {
  return {
    title: 'title',
    location: '',
    tourImages: [], // import.meta.env.APP_STATIC_URL.concat(`/tour/example/${num}.png`)
    id: 1,
    toursId: []
  }
}

export const createTourHighlight = (form: CreateTourHighlightForm): Promise<ApiResponse<void>> =>
  axiosRequest({
    method: 'POST',
    url: 'tour_highlight/create',
    data: form
  })

export const deleteTourHighlight = (highlightId: number): Promise<ApiResponse<void>> =>
  axiosRequest({
    method: 'DELETE',
    url: `tour_highlight?id=${highlightId}`
  })
