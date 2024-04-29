import CryptoJS from 'crypto-js'

export const assembleIflyAuthUrl = () => {
  const hostUrl = 'wss://tts-api.xfyun.cn/v2/tts'
  const ul = new URL(hostUrl)

  // Signature time
  const date = new Date().toUTCString()

  // Fields participating in the signature: host, date, request-line
  const signString = ['host: ' + ul.host, 'date: ' + date, 'GET ' + ul.pathname + ' HTTP/1.1']
  // Joining signature strings
  const sign = signString.join('\n')

  // Signature result
  const sha = CryptoJS.HmacSHA256(sign, import.meta.env.APP_IFLY_SECRET).toString(
    CryptoJS.enc.Base64
  )

  // Building request parameters (no need for URL encoding at this point)
  const authUrl = `api_key="${import.meta.env.APP_IFLY_KEY}", algorithm="hmac-sha256", headers="host date request-line", signature="${sha}"`

  // Encoding the request parameters using base64
  const authorization = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(authUrl))

  // Constructing URL parameters
  const v = new URLSearchParams()
  v.append('host', ul.host)
  v.append('date', date)
  v.append('authorization', authorization)

  // Appending the encoded string to the URL after URL encoding it
  return hostUrl + '?' + v.toString()
}
