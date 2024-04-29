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
  likedBy: UserRecord[]
}

const api_prefix = 'comments/'

export const getCommentsByTourId = (tourId: number): Promise<ApiResponse<CommentRecord[]>> => {
  // const tourString = `tourId=${tourId}`
  const tourString = `id=${1}`
  return axiosRequest({
    method: 'GET',
    url: api_prefix + 'by_tour_id?'.concat(tourString)
  })
}

export interface PostCommentForm {
  tourId: number
  parentId?: number
  content: string
}

export const postComment = (form: PostCommentForm): Promise<ApiResponse<CommentRecord>> =>
  axiosRequest({
    method: 'POST',
    url: api_prefix + 'create',
    data: form
  })

// const exampleCommentRecord: CommentRecord = {
//   author: exampleUserRecord,
//   content: '',
//   id: 0,
//   parent: 0,
//   publishTime: '',
//   replies: [],
//   tourId: 0
// }
