// Basic interface for user record
import { type ApiResponse, axiosRequest, getStaticRes } from '@/apis'

export interface UserRecord {
  id: number
  email: string
  nickname: string
  avatar: string
  // TODO: Time format: '%Y-%m-%d %H:%M:%S'
  registerTime: string
  latestLoginTime: string
  type: UserType
}

export enum UserType {
  COMMON,
  VIP,
  ADMIN
}

export const UserTypeMap = {
  0: 'common',
  1: 'VIP',
  2: 'admin'
}

export const exampleUserRecord: UserRecord = {
  // avatar: getStaticRes('user/default/avatar/avatar.jpg'),
  avatar: '',
  email: 'sc21m2w@leeds.ac.uk',
  id: 1,
  latestLoginTime: '2024-03-03 15:35:23',
  nickname: 'Walcraft User',
  registerTime: '2024-03-03 15:35:23',
  type: UserType.COMMON
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

export const getAllUsers = (): Promise<ApiResponse<UserRecord[]>> =>
  axiosRequest({
    method: 'GET',
    url: `users/all`
  })

export const getUserByToken = (token: string): Promise<ApiResponse<UserRecord>> =>
  axiosRequest({
    method: 'GET',
    url: `users/token/${token}`,
    headers: {
      byPass: true
    }
  })

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

export const updateUser = (form:{
  nickname: string
  email: string
  avatar:string
  oldPassword: string | null
  newPassword: string | null
}):Promise<ApiResponse<string>> =>
  axiosRequest({
    method: 'PUT',
    url: 'users',
    data: form
  })

export const upgradeUser = (form:any):Promise<ApiResponse<string>> => 
  axiosRequest({
    method: 'PUT',
    url: 'users/type',
    data: form
  })

export const guestUser = {
  avatar: getStaticRes('/user/default/avatar/default.jpeg'),
  nickname: '未登录'
}

export const adminUser = {
  avatar: getStaticRes('/user/default/avatar/admin-blue.png'),
  nickname: 'Admin'
}
