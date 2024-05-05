import type { UserRecord } from '@/apis/user'
import { type ApiResponse, axiosRequest } from '@/apis'
import type { TourRecord } from '../tour'

export interface TourCollection {
  id: number
  user: UserRecord
  coverUrl: string
  title: string
  description: string
  createTime: string
  name: string
  tours: TourRecord[]
}

export interface CollectionCreate {
  name: string
  title: string
  coverUrl: string
  description: string
}

export const getTourCollectionsByCurUser: () => Promise<ApiResponse<TourCollection[]>> = () =>
  axiosRequest({
    method: 'GET',
    url: 'tour_collection/user'
  })

export const getTourCollection: () => Promise<ApiResponse<TourCollection[]>> = () =>
  axiosRequest({
    method: 'GET',
    url: 'tour_collection/all'
  })

export const getCollectionByUser = ():Promise<ApiResponse<TourCollection[]>> => 
  axiosRequest({
    method: "GET",
    url: 'tour_collection/user',
  })

export const getCollectionById = (id: string):Promise<ApiResponse<TourCollection>> => 
  axiosRequest({
    method: 'GET',
    url: `tour_collection?id=${id}`,
  })

export const createCollection = (form: CollectionCreate):Promise<ApiResponse<TourCollection>> =>
  axiosRequest({
    method: "POST",
    url: "/tour_collection/create",
    data: form
  })