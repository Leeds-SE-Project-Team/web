import { type ApiResponse, axiosRequest } from '@/apis'
import type { UserRecord } from '../user'
import type { GroupCollectionRecord } from '../groupCollection'

export interface GroupRecord {
    id: number,
    leaderId: number,
    members: UserRecord[],
    name: string,
    coverUrl: string,
    description: string,
    groupCollections: GroupCollectionRecord[],
}

export interface CreateGroupForm {
    name: string,
    description: string,
    coverUrl: string
}

export interface PutGroupFrom {
    id: number
    leaderId: number
    name: string
    coverUrl: string
    description: string
}


export const getAllGroups = () :Promise<ApiResponse<GroupRecord[]>> => axiosRequest({
    method: "GET",
    url: "/groups/all"
})

export const getAllJoinedGroupsByUser = () :Promise<ApiResponse<GroupRecord[]>> => axiosRequest({
    method: "GET",
    url: "/groups/joinedByUser"
})

export const getAllCreatedGroupsByUser = () :Promise<ApiResponse<GroupRecord[]>> => axiosRequest({
    method: "GET",
    url: "/groups/createdByUser"
})

export const createGroup = (form: CreateGroupForm) :Promise<ApiResponse<GroupRecord>> => axiosRequest({
    method: "POST",
    url: "/groups/create",
    data: form
})

export const updateGroup = (form: PutGroupFrom) :Promise<ApiResponse<GroupRecord>> => axiosRequest({
    method: "PUT",
    url: "/groups",
    data: form
})

export const deleteGroup = (id: string | number) :Promise<ApiResponse<void>> => axiosRequest({
    method: "DELETE",
    url: `/groups?id=${id}`,
})