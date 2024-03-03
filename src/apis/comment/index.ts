import type { UserRecord } from '@/apis/user'
import { type ApiResponse, axiosRequest } from '@/apis'

export interface CommentRecord {
  id: number
  tourId: number
  author: UserRecord
  content: string
  publishTime: string
  replies: CommentRecord[]
  parent?: number
}

export const getCommentsByTourId = (tourId: number): Promise<ApiResponse<CommentRecord[]>> => {
  // const tourString = `tourId=${tourId}`
  const tourString = `id=${1}`
  return axiosRequest({
    method: 'GET',
    url: 'comments/by_tour_id?'.concat(tourString)
  })
}
