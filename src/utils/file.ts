import { type ApiResponse, axiosRequest } from '@/apis' // Importing types and axiosRequest function from APIs module

/**
 * Function to upload a file from a URL to a specified upload URL
 * @param {string} resURL - The URL of the file to be uploaded
 * @param {string} uploadURL - The URL where the file will be uploaded
 * @param {string} filename - Optional. The filename to be used for the uploaded file
 * @returns {Promise<ApiResponse<string>>} - A promise resolving to the API response containing the uploaded file's URL
 */
export async function uploadFileFromURL(
  resURL: string,
  uploadURL: string,
  filename?: string
): Promise<ApiResponse<string>> {
  // Fetching the file from the provided URL
  const response = await fetch(resURL)
  // Converting the fetched data to a Blob
  const blob = await response.blob()
  // Creating a FormData object and appending the file and uploadURL
  const formData = new FormData()
  formData.append('file', blob, 'image.jpg') // Assuming default filename as 'image.jpg'
  formData.append('uploadURL', uploadURL)
  if (filename) {
    formData.append('filename', filename)
  }

  // Making a POST request to upload the file using axios
  return axiosRequest({
    method: 'POST',
    url: 'users/upload',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
