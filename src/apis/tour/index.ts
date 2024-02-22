import type { UserRecord } from '@/apis/user'
import type { ApiResponse } from '@/apis'
import { axiosRequest } from '@/apis'

export enum TourType {
  WALK,
  RUNNING,
  DRIVE,
  CYCLING
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
}

export interface CreateTourForm {
  startLocation: string
  endLocation: string
  type: TourType
  pons: PON[]
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
