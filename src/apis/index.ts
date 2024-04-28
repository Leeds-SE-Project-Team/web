import axios, { type AxiosRequestConfig, type AxiosResponse, HttpStatusCode } from 'axios'
import { useAuthStore } from '@/stores/auth'

// axios 全局配置
const axiosInstance = axios.create({
  baseURL: import.meta.env.APP_SERVER_URL,
  timeout: 30000,
  headers: {
    common: {
      'Content-Type': 'application/json'
      // 'User-ID': 1
    }
  }
})

// 添加请求拦截器
axiosInstance.interceptors.request.use(
  function (config) {
    const authStore = useAuthStore()

    if (config.headers.byPass) {
      return config
    }

    return new Promise((resolve) => {
      authStore
        .refreshAccessToken(localStorage.getItem('accessToken'))
        .then((user) => {
          if (authStore.accessToken === 'root') {
            config.headers.setAuthorization(authStore.accessToken)
            resolve(config)
            return
          }
          if (user) {
            console.log(authStore.accessToken, localStorage.getItem('accessToken'))
            config.headers.setAuthorization(authStore.accessToken)
            config.headers.set('User-ID', user.id)
            resolve(config)
          } else {
            resolve(config)
          }
        })
        .catch(() => {
          resolve(config)
        })
    })

    // if (!authStore.isTokenValid && authStore.accessToken) {
    //   authStore.refreshAccessToken(null)
    // }
    // const userStore = useUserStore()
    // if (userStore.curUser) {
    //   config.headers.set('User-ID', userStore.curUser.id)
    // } else if (authStore.accessToken) {
    //   if (authStore.accessToken === 'root') {
    //     return config
    //   }
    //   return new Promise((resolve) => {
    //     getUserByToken(authStore.accessToken!).then((apiRes) => {
    //       if (apiRes.success) {
    //         config.headers.set('User-ID', apiRes.data!.id)
    //         resolve(config)
    //       }
    //     })
    //   })
    // }
    // return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

// request 函数包装
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

// API 返回值接口
export interface ApiResponse<T> {
  data: T | undefined
  message: string
  success: boolean
}

// 获取服务端静态资源URL
export const getStaticRes = (relativePath: string) => {
  return import.meta.env.APP_STATIC_URL.concat(relativePath)
}
