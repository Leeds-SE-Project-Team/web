// Basic interface for user record
import { type ApiResponse, axiosRequest } from '@/apis'
export interface UserRecord {
  id: number
  email: string
  nickname: string
  password: string

  // TODO: Time format: '%Y-%m-%d %H:%M:%S'
  registerTime: string
  latestLoginTime: string
}

// API for query single user
// export const getUserById = (userId: number): Promise<UserRecord> =>
//   axiosRequest({
//     method: 'GET',
//     url: `users/${userId}`
//   })
export const getUserByEmail = (userEmail: string): Promise<ApiResponse<UserRecord>> =>
  axiosRequest({
    method: 'GET',
    url: `users?email=${userEmail}`
  })

export const createUser = (form: {
  nickname: string
  email: string
  password: string
}): Promise<ApiResponse<string>> =>
  axiosRequest({
    method: 'POST',
    url: 'users/signup',
    data: form
  })
