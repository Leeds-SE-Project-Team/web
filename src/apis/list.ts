import axios from 'axios'
import qs from 'query-string'
import type { DescData } from '@arco-design/web-vue/es/descriptions/interface'
import type { TourRecord } from '@/apis/tour'
import { TourState, TourStatus, TourType } from '@/apis/tour'
import type { UserRecord } from '@/apis/user'
import { UserType } from '@/apis/user'

export interface TourRecordCanEdit extends TourRecord {
  isEditing: boolean
}

export interface SearchTourForm {
  title?: string
  authorName?: string
  type?: TourType
  publishTime?: string[]
  status?: TourStatus
  state?: TourState
}

export interface SearchUserForm {
  nickname?: string
  email?: string | undefined
  registerTime?: string[]
  type?: UserType
}

export interface PolicyParamsTour extends Partial<SearchTourForm> {
  current: number
  pageSize: number
}

export interface PolicyParamsUser extends Partial<SearchUserForm> {
  current: number
  pageSize: number
}

export interface UserListRes {
  list: UserRecord[]
  total: number
}

export interface TourListRes {
  list: TourRecord[]
  total: number
}

export function queryPolicyList(params: PolicyParamsTour) {
  return axios.get<TourListRes>('/api/list/policy', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj)
    }
  })
}

export interface ServiceRecord {
  id: number
  title: string
  description: string
  name?: string
  actionType?: string
  icon?: string
  data?: DescData[]
  enable?: boolean
  expires?: boolean
}

export function queryInspectionList() {
  return axios.get('/api/list/quality-inspection')
}

export function queryTheServiceList() {
  return axios.get('/api/list/the-service')
}

export function queryRulesPresetList() {
  return axios.get('/api/list/rules-preset')
}
