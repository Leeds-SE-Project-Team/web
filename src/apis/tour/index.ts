import type { UserRecord } from '@/apis/user'
import type { ApiResponse } from '@/apis'
import { axiosRequest } from '@/apis'
import type { CommentRecord } from '@/apis/comment'
import type { TourSpot } from '@/apis/tour/spot'

export enum TourType {
  WALK,
  CYCLING,
  CAR,
  PUBLIC
}

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
}

export const parseLocation = (location: string): string[] => {
  return location.split(',')
}

export const createTour = (form: CreateTourForm): Promise<ApiResponse<void>> =>
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
