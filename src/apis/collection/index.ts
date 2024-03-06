import type { UserRecord } from '@/apis/user'
import { exampleUserRecord } from '@/apis/user'
import { type ApiResponse, axiosRequest } from '@/apis'

export interface TourCollection {
  id: number
  user: UserRecord
  coverUrl: string
  title: string
  description: string
  createTime: string
  name: string
  // tours: TourRecord
}

export const getTourCollection: () => Promise<ApiResponse<TourCollection[]>> = () =>
  axiosRequest({
    method: 'GET',
    url: 'tour_collection/all'
  })

export const exampleTourCollection: TourCollection = {
  coverUrl: 'http://walcraft.wmzspace.space/static/tour/example/1.png',
  createTime: '2024-3-1 00:00:00',
  description:
    'For those who love cycling, adventure and, more generally, the outdoors, the idea of conquering epic mountains is certainly a strong driving force.',
  id: 1,
  title: 'Hike a hidden gem in Southwest Germany – Palatinate High Route',
  user: exampleUserRecord,
  name: 'Hiking Collection'
}

export const exampleTourCollection2: TourCollection = {
  coverUrl: 'http://walcraft.wmzspace.space/static/tour/example/2.png',
  createTime: '2024-3-3 00:00:00',
  description:
    'For those who love cycling, adventure and, more generally, the outdoors, the idea of conquering epic mountains is certainly a strong driving force.',
  id: 1,
  title: 'A land of contrasts – Lake Zurich',
  user: exampleUserRecord,
  name: 'Hiking Collection'
}
