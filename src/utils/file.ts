import { type ApiResponse, axiosRequest } from '@/apis'
import { reject } from 'lodash-es'

export async function uploadFileFromURL(
  resURL: string,
  uploadURL: string
): Promise<ApiResponse<string>> {
  // try {
  const response = await fetch(resURL)
  const blob = await response.blob()
  const formData = new FormData()
  formData.append('file', blob, 'image.jpg')
  formData.append('uploadURL', uploadURL)
  return axiosRequest({
    method: 'POST',
    url: 'users/upload',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })

  // const data = await uploadResponse.json()
  // console.log('文件上传成功:', data)
  // } catch (error) {
  //   reject(error as string)
  // return {
  //   data: undefined,
  //   message: 'upload failed'.concat(error as string),
  //   success: false
  // } as ApiResponse<void>
  // }
}
