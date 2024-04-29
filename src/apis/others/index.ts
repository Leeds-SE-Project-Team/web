import { assembleIflyAuthUrl } from '@/utils/iflytek'
import CryptoJS from 'crypto-js'
export const speechSynthesis = (text: any) => {
  const ws = new WebSocket(assembleIflyAuthUrl())

  ws.onopen = () => {
    const words = CryptoJS.enc.Utf8.parse(text) // WordArray object
    const base64 = CryptoJS.enc.Base64.stringify(words)
    //请求参数
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
        app_id: import.meta.env.APP_IFLY_ID
      }
    }

    ws.send(JSON.stringify(param))
  }

  ws.onmessage = function (evt) {
    const data = evt.data
    // console.log(JSON.parse(data).dataaudio)
    const snd = new Audio(`data:audio/x-wav;base64,${JSON.parse(data).data.audio}`)
    snd.play().then(() => {
      ws.close()
    })
  }
}
