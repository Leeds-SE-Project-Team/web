import type { UserRecord } from '@/apis/user'
import { type ApiResponse } from '@/apis'
import { axiosRequest } from '@/apis'

export interface TourCollection {
  id: number
  user: UserRecord
  coverUrl: string
  title: string
  description: string
  // tours: TourRecord
}

export const getTourCollection: () => Promise<ApiResponse<TourCollection[]>> = () =>
  axiosRequest({
    method: 'GET',
    url: 'tour_collection/all',
    data: null
  })
