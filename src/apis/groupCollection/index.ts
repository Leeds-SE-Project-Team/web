import { type ApiResponse, axiosRequest } from '@/apis'
import type { TourRecord } from '../tour'
import type { UserRecord } from '../user'

export interface GroupCollectionRecord {
  id: number
  groupId: number
  title: string
  name: string
  coverUrl: string
  description: string
  tours: TourRecord[]
  members: UserRecord[]
}

export interface SelectGroupCollectionOption {
  text: string
  value: number
  children?: SelectGroupCollectionOption[]
}

export const getAllGroupCollection = (): Promise<ApiResponse<GroupCollectionRecord[]>> =>
  axiosRequest({
    method: 'GET',
    url: 'group_collection/all'
  })

export const getGroupCollectionById = (id: number): Promise<ApiResponse<GroupCollectionRecord>> =>
  axiosRequest({
    method: 'GET',
    url: `group_collection?id=${id}`
  })

export const getGroupCollectionByGroupId = (
  groupId: number
): Promise<ApiResponse<GroupCollectionRecord[]>> =>
  axiosRequest({
    method: 'GET',
    url: `group_collection/group?id=${groupId}`
  })

export interface CreateGroupCollectionForm {
  groupId: number | string
  name: string
  title: string
  coverUrl: string
  description: string
}

export const createGroupCollection = (
  form: CreateGroupCollectionForm
): Promise<ApiResponse<GroupCollectionRecord>> =>
  axiosRequest({
    method: 'POST',
    url: `group_collection/create`,
    data: form
  })
