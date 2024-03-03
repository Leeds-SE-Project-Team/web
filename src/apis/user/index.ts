// Basic interface for user record
import { type ApiResponse, axiosRequest } from '@/apis'
export interface UserRecord {
  id: number
  email: string
  nickname: string
  avatar: string
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

export interface QueryUserForm {
  email?: string
  id?: string
}

export const checkUserExist = (form: QueryUserForm): Promise<ApiResponse<void>> => {
  const emailString = form.email ? `email=${form.email}` : ''
  const idString = form.id ? `id=${form.id}` : ''
  return axiosRequest({
    method: 'GET',
    url: 'users/exist?'.concat(emailString).concat(idString)
  })
}

export const createUser = (form: {
  nickname: string
  email: string
  password: string
}): Promise<ApiResponse<void>> =>
  axiosRequest({
    method: 'POST',
    url: 'users/signup',
    data: form
  })
