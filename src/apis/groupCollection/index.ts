import { type ApiResponse, axiosRequest } from '@/apis'

export interface GroupCollectionRecord {}

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
): Promise<ApiResponse<GroupCollectionRecord>> =>
  axiosRequest({
    method: 'GET',
    url: `group_collection/group?id=${groupId}`
  })

export interface CreateGroupCollectionForm {
  groupId: number
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
