import { axiosRequest } from '@/apis'

export async function uploadFileFromURL(resURL: string, uploadURL: string) {
  try {
    const response = await fetch(resURL)
    const blob = await response.blob()
    const formData = new FormData()
    formData.append('file', blob, 'image.jpg') // 'image.jpg'为上传时的文件名
    const uploadResponse = await axiosRequest({
      method: 'POST',
      url: uploadURL,
      data: formData
    })

    console.log(uploadResponse)

    // const data = await uploadResponse.json()
    // console.log('文件上传成功:', data)
  } catch (error) {
    console.error('文件上传失败:', error)
  }
}
