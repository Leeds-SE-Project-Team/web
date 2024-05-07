import { assembleIflyAuthUrl } from '@/utils/iflytek' // Importing function for assembling iFlyTek authentication URL
import CryptoJS from 'crypto-js' // Importing CryptoJS library for cryptographic functions
/**
 * Function to synthesize speech from text using iFlyTek API
 * @param {string} text - The text to be synthesized into speech
 */
export const speechSynthesis = (text: string) => {
  // Establishing a WebSocket connection
  const ws = new WebSocket(assembleIflyAuthUrl())

  // Event handler for WebSocket connection opening
  ws.onopen = () => {
    // Converting text to WordArray object
    const words = CryptoJS.enc.Utf8.parse(text)
    // Converting WordArray object to base64 string
    const base64 = CryptoJS.enc.Base64.stringify(words)
    // Constructing parameter object for speech synthesis request
    const param = {
      business: {
        aue: 'lame',
        vcn: 'xiaoyan',
        pitch: 50,
        speed: 50,
        tte: 'UTF8'
      },
      data: {
        status: 2,
        text: base64
      },
      common: {
        app_id: import.meta.env.APP_IFLY_ID // Importing iFlytek app ID from environment variables
      }
    }

    // Sending speech synthesis request as JSON string through WebSocket
    ws.send(JSON.stringify(param))
  }

  // Event handler for receiving message from WebSocket
  ws.onmessage = function (evt) {
    // Extracting audio data from received message and creating audio element
    const data = evt.data
    const snd = new Audio(`data:audio/x-wav;base64,${JSON.parse(data).data.audio}`)
    // Playing the synthesized speech and closing WebSocket connection afterwards
    snd.play().then(() => {
      ws.close()
    })
  }
}
