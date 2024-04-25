import type { UserRecord } from '@/apis/user'
import type { ApiResponse } from '@/apis'
import { axiosRequest } from '@/apis'
import type { CommentRecord } from '@/apis/comment'
import type { TourSpot } from '@/apis/tour/spot'
import type { TourHighlight } from '@/apis/tour/highlight'
import walkSvgUrl from '@/assets/walk.svg'
import cyclingSvgUrl from '@/assets/cycling.svg'
import driveSvgUrl from '@/assets/drive.svg'
import axios from 'axios'
import type { ContentDataRecord } from '@/views/web/admin/dashboard/types'

export enum TourType {
  WALK,
  CYCLING,
  CAR,
  PUBLIC
}

export const tourTypeMap = [
  { text: 'hiking', value: TourType.WALK, img: walkSvgUrl },
  {
    text: 'cycling',
    value: TourType.CYCLING,
    img: cyclingSvgUrl
  },
  { text: 'car', value: TourType.CAR, img: driveSvgUrl }
  // { text: 'public', value: TourType.PUBLIC, img: driveSvgUrl }
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

export const fetchTourDataJson = (tour: TourRecord) =>
  axios.get(tour.dataUrl, {
    headers: { 'Content-Type': 'application/json' }
  })

export interface PON {
  name: string
  location: string
  sequence: number
}

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
  dataUrl: string
  completeUrl: string
  tourSpotList: TourSpot[]
  tourHighlightList: TourHighlight[]
  comments: CommentRecord[]
  state: TourState
  status: TourStatus
  title: string
  likedBy: number[]
  starredBy: number[]
}

export enum TourStatus {
  ONLINE,
  OFFLINE,
  AWAIT_APPROVAL
}

export enum TourState {
  UNFINISHED,
  ONGOING,
  FINISHED
}

export const TourStatusMap = {
  0: 'online',
  1: 'offline',
  2: 'awaitApproval'
}
export const TourStateMap = {
  0: 'unfinished',
  1: 'ongoing',
  2: 'finished'
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

export interface UpdateTourForm extends Partial<CreateTourForm> {
  id: number
  status: TourStatus
  state: TourState
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

export const getTourByUser = (): Promise<ApiResponse<TourRecord[]>> =>
  axiosRequest({
    method: 'GET',
    url: 'tours/user'
  })

export const getToursWeeklyData = (): Promise<ApiResponse<ContentDataRecord[]>> =>
  axiosRequest({
    method: 'GET',
    url: 'tours/weekly'
  })

export const updateTour = (form: UpdateTourForm): Promise<ApiResponse<TourRecord>> =>
  axiosRequest({
    method: 'PUT',
    url: 'tours',
    data: form
  })

export const deleteTour = (tourId: number): Promise<ApiResponse<void>> =>
  axiosRequest({
    method: 'DELETE',
    url: `tours?id=${tourId}`
  })

export interface SaveTourForm {
  isComplete?: boolean
  tourId: number
  recordData: RecordData
  trackList: RecordDataInstant[]
}

export interface RecordData {
  totalDistance: number // km
  avgSpeed: number // km/h
  timeInMotion: number // s
  timeTaken: number // s
  calorie: number // kj
}

export interface RecordDataInstant {
  speed: number // km/h
  altitude: number // m
  location: AMap.LngLat
  time: string
}

export const saveTour = (form: SaveTourForm): Promise<ApiResponse<TourRecord>> =>
  axiosRequest({
    method: 'POST',
    url: 'tours/complete',
    data: form
  })
