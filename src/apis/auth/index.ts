import type { ApiResponse } from '@/apis'
import type { UserRecord } from '@/apis/user'
import { axiosRequest } from '@/apis'

export const authPwdLogin = (form: {
  email: string
  password: string
}): Promise<ApiResponse<string>> =>
  axiosRequest({
    method: 'POST',
    url: 'auth/pwd',
    data: form
  })
