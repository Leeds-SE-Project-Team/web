import type { UserRecord } from '@/apis/user'
import type { ApiResponse } from '@/apis'
import { axiosRequest } from '@/apis'
import type { CommentRecord } from '@/apis/comment'
import type { TourSpot } from '@/apis/tour/spot'
import type { TourCollection } from '@/apis/collection'

export enum TourType {
  WALK,
  CYCLING,
  CAR,
  PUBLIC
}

export const tourTypeMap = [
  { text: 'hiking', value: TourType.WALK, img: 'src/assets/walk.svg' },
  { text: 'cycling', value: TourType.CYCLING, img: 'src/assets/cycling.svg' },
  { text: 'car', value: TourType.CAR, img: 'src/assets/drive.svg' },
  { text: 'public', value: TourType.PUBLIC, img: 'src/assets/drive.svg' }
]

export const getTourTypeText = (type: TourType) =>
  tourTypeMap.find((item) => item.value === type)!.text
export const getTourTypeImg = (type: TourType) =>
  tourTypeMap.find((item) => item.value === type)!.img

export const getTourById: (tourId: number | string) => Promise<ApiResponse<TourRecord>> = (
  tourId
) =>
  axiosRequest({
    method: 'GET',
    url: `tours?id=${tourId}`
  })

export interface PON {}

export interface TourRecord {
  id: number
  startLocation: string
  endLocation: string

  // TODO: Time format: '%Y-%m-%d %H:%M:%S'
  createTime: string

  type: TourType
  pons: PON[]
  user: UserRecord
  tourCollectionId: number
  mapCapture: string

  spots: TourSpot[]
  comments: CommentRecord[]
  status: 'online' | 'offline' | 'awaitApproval'
  title: string
}

export interface CreateTourForm {
  startLocation: string
  endLocation: string
  type: TourType
  pons: PON[]
  tourCollectionId: number
  result: any
}

export const parseLocation = (location: string): string[] => {
  return location.split(',')
}

export const parseLocationNumber = (location: string): number[] => {
  return location.split(',').map((e) => parseFloat(e))
}

export const createTour = (form: CreateTourForm): Promise<ApiResponse<TourRecord>> =>
  axiosRequest({
    method: 'POST',
    url: `tours/create`,
    data: form
  })

export const getTours = (): Promise<ApiResponse<TourRecord[]>> =>
  axiosRequest({
    method: 'GET',
    url: 'tours/all'
  })
