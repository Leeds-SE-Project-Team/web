import axios, { type AxiosRequestConfig, type AxiosResponse, HttpStatusCode } from 'axios'

const axiosInstance = axios.create({
  baseURL: import.meta.env.APP_SERVER_URL,
  timeout: 30000
})

export const axiosRequest = <T>(config: AxiosRequestConfig): Promise<T> =>
  new Promise((resolve, reject) => {
    axiosInstance
      .request(config)
      .then((res: AxiosResponse<T>) => {
        if (res.status === HttpStatusCode.Ok) {
          resolve(res.data)
        } else {
          reject(res.statusText)
        }
      })
      .catch((e) => reject(e.message))
  })

export interface ApiResponse<T> {
  data: T | undefined
  message: string
  success: boolean
}
