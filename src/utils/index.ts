import dayjs, { Dayjs } from 'dayjs'
import { range } from 'lodash-es'
import { useGeolocation } from '@vuemap/vue-amap'

const THOUSAND = Math.pow(10, 3)
const WAN = Math.pow(10, 4)
const MILLION = Math.pow(10, 6)
const YI = Math.pow(10, 8)
const BILLION = Math.pow(10, 9)

export const simplifyNumber = (value: number, fix: number, unit = 'EN') => {
  let prefix = ''
  if (value < 0) {
    value = Math.abs(value)
    prefix = '-'
  }
  if (unit === 'CN') {
    if (value >= YI * WAN) {
      return {
        value: prefix.concat('9999+'),
        unit: '亿',
        string: prefix.concat('9999+亿')
      }
    } else if (value >= YI) {
      return {
        value: prefix.concat((value / YI).toFixed(fix)),
        unit: '亿',
        string: prefix.concat((value / YI).toFixed(fix) + '亿')
      }
    } else if (value >= WAN) {
      return {
        value: prefix.concat((value / WAN).toFixed(fix)),
        unit: '万',
        string: prefix.concat((value / WAN).toFixed(fix) + '万')
      }
    } else {
      return {
        value: prefix.concat(value.toFixed(fix)),
        unit: '',
        string: prefix.concat(value.toFixed(0) + '')
      }
    }
  } else {
    if (value >= BILLION * WAN) {
      return {
        value: prefix.concat('9999+'),
        unit: 'B',
        string: prefix.concat('9999+B')
      }
    } else if (value >= BILLION) {
      return {
        value: prefix.concat((value / BILLION).toFixed(fix)),
        unit: 'B',
        string: prefix.concat((value / BILLION).toFixed(fix) + 'B')
      }
    } else if (value >= MILLION) {
      return {
        value: prefix.concat((value / MILLION).toFixed(fix)),
        unit: 'M',
        string: prefix.concat((value / MILLION).toFixed(fix) + 'M')
      }
    } else if (value >= THOUSAND) {
      return {
        value: prefix.concat((value / THOUSAND).toFixed(fix)),
        unit: 'K',
        string: prefix.concat((value / THOUSAND).toFixed(fix) + 'K')
      }
    } else {
      return {
        value: prefix.concat(value.toFixed(fix)),
        unit: '',
        string: prefix.concat(value.toFixed(0) + '')
      }
    }
  }
}

export const getTimeDiffUntilNow = (datetimeString: string) => {
  // 将日期时间字符串转换为日期对象
  const datetime = new Date(datetimeString)
  // 获取当前时间
  const now = new Date()

  // 计算时间差（以毫秒为单位）
  const timeDiff = now.getTime() - datetime.getTime()

  // 计算时间差对应的年、月、天、小时、分钟和秒数
  const seconds = Math.floor(timeDiff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)

  // 根据时间差返回相应的描述
  if (years > 0) {
    return `${years}年前`
  } else if (months > 0) {
    return `${months}个月前`
  } else if (days > 0) {
    return `${days}天前`
  } else if (hours > 0) {
    return `${hours}小时前`
  } else if (minutes > 0) {
    return `${minutes}分钟前`
  } else {
    return `1分钟内`
  }
}

// 禁止选择当时之后的时刻
export const disabledDateTime = (dates: Dayjs) => {
  const hours = dayjs().hour()
  const minutes = dayjs().minute()
  const seconds = dayjs().second()
  // 当日只能选择当前时间之后的时间点
  if (dates && dayjs(dates).date() === dayjs().date()) {
    if (dayjs(dates).hour() === dayjs().hour()) {
      return {
        disabledHours: () => range(hours + 1, 24),
        disabledMinutes: () => range(minutes + 1, 60),
        disabledSeconds: () => range(seconds + 1, 60)
      }
    } else {
      return {
        disabledHours: () => range(hours + 1, 24),
        disabledMinutes: () => [],
        disabledSeconds: () => []
      }
    }
  } else {
    return {
      disabledHours: () => [],
      disabledMinutes: () => [],
      disabledSeconds: () => []
    }
  }
}

// 检查时间是否在范围中
export const isTimeInRange = (range: string[], time: string) => {
  // const startDate = new Date(range[0])
  const startDate = new Dayjs(range[0])
  const endDate = new Dayjs(range[1])
  const checkTime = new Dayjs(time)

  return checkTime >= startDate && checkTime <= endDate
}

export const getRankings = (arr: number[]) => {
  const arrCopy = arr.slice()
  // 返回结果
  return arr.map(function (num) {
    return 1 + arrCopy.sort((a, b) => b - a).indexOf(num)
  })
}

// 检查邮箱格式是否正确
export const checkEmail = (email: string | undefined) => {
  if (email === undefined) {
    return false
  }

  if (email.length == 0) {
    return false
  }
  const reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
  return reg.test(email)
}

/**
 * 获取当前的位置
 * */

// 获取当前的位置
export const getCurrentLocation = (
  options?: AMap.GeolocationOptions
): Promise<AMap.CurrentPositionResult> =>
  new Promise((resolve, reject) => {
    useGeolocation(options)
      .then((res) => {
        res.getCurrentPosition().then((currentPosition) => {
          // curPosition.value = currentPosition.position.toArray()
          resolve(currentPosition)
        })
      })
      .catch((e) => {
        reject(e)
      })

    // new AMap.Geolocation(geolocationOptions).getCurrentPosition((...cb) => {
    //   if (cb[0] === 'error') {
    //     reject('error when get location')
    //   }
    //   resolve(cb[1])
    // })
  })

import { Haptics, ImpactStyle } from '@capacitor/haptics'

export const hapticsImpactMedium = async () => {
  await Haptics.impact({ style: ImpactStyle.Medium })
}

export const hapticsImpactLight = async () => {
  await Haptics.impact({ style: ImpactStyle.Light })
}

export const hapticsVibrate = async () => {
  await Haptics.vibrate()
}

export const hapticsSelectionStart = async () => {
  await Haptics.selectionStart()
}

export const hapticsSelectionChanged = async () => {
  await Haptics.selectionChanged()
}

export const hapticsSelectionEnd = async () => {
  await Haptics.selectionEnd()
}
