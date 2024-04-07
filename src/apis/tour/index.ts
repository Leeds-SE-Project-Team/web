import type { UserRecord } from '@/apis/user'
import type { ApiResponse } from '@/apis'
import { axiosRequest } from '@/apis'
import type { CommentRecord } from '@/apis/comment'
import type { TourSpot } from '@/apis/tour/spot'
import type { TourCollection } from '@/apis/collection'
import type { TourHighlight } from '@/apis/tour/highlight'

export enum TourType {
  WALK,
  CYCLING,
  CAR,
  PUBLIC
}

import walkSvgUrl from '@/assets/walk.svg'
import cyclingSvgUrl from '@/assets/cycling.svg'
import driveSvgUrl from '@/assets/drive.svg'

export const tourTypeMap = [
  { text: 'hiking', value: TourType.WALK, img: walkSvgUrl },
  { text: 'cycling', value: TourType.CYCLING, img: cyclingSvgUrl },
  { text: 'car', value: TourType.CAR, img: driveSvgUrl },
  { text: 'public', value: TourType.PUBLIC, img: driveSvgUrl }
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

export interface TourImage {
  id: number
  imageUrl: string
  tourHighlightId: number
  tourSpotId: number
  tourId: number
}
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
  mapUrl: string

  tourSpotList: TourSpot[]
  tourHighlightList: TourHighlight[]
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
  title: string
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
