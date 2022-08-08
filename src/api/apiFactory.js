import moment from 'moment'
import { getToken } from 'ff24-js/src/utils/authCookie'
import Axios from 'axios'

function isValidDateTime(datetime) {
  return (
    datetime &&
    Object.prototype.toString.call(datetime) === '[object Date]' &&
    !isNaN(datetime)
  )
}

function getQueryStringValue(value) {
  const sRet = isValidDateTime(value)
    ? moment(value).format('YYYY/MM/DD HH:mm:ss')
    : value
  return encodeURIComponent(sRet)
}

function checkIsNullOrUndefined(obj) {
  return obj === undefined || obj === 'undefined' || obj === null || obj === ''
}

const objectToParams = obj =>
  Object.keys(obj)
    .reduce(function(a, k) {
      if (!checkIsNullOrUndefined(obj[k])) {
        if (k === 'page') {
          const page = Number(obj[k]) >= 1 ? Number(obj[k]) - 1 : Number(obj[k])
          a.push(`${k}=${getQueryStringValue(page)}`)
        } else {
          a.push(`${k}=${getQueryStringValue(obj[k])}`)
        }
      }
      return a
    }, [])
    .join('&')

const token = getToken()

const headerStatic = {
  Authorization: token,
  cApiKey: process.env.VUE_APP_API_KEY,
  'Content-Type': 'application/json;charset=UTF-8'
}

export const getHeader = () => ({
  Authorization: getToken(),
  cApiKey: process.env.VUE_APP_API_KEY,
  'Content-Type': 'application/json;charset=UTF-8'
  // "Access-Control-Allow-Origin": "*",
  // "Access-Control-Allow-Methods": "DELETE, POST, PUT, GET, OPTIONS",
  // "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With"
})

export const getHeaderFile = () => ({
  Authorization: getToken(),
  cApiKey: process.env.VUE_APP_API_KEY,
  'Content-Type': 'application/json;charset=UTF-8'
  // "Access-Control-Allow-Origin": "*",
  // "Access-Control-Allow-Methods": "DELETE, POST, PUT, GET, OPTIONS",
  // "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With"
})

class ApiFactory {
  /**
   * @param constantApi : {} config in ConstantAPI.MENU_CODE.ENDPOINT
   * @param payload : {} set {} when ignore
   * @param params: {} parameters list: not pass if ignore
   * */
  static callAPI(constantApi, payload = {}, params = {}) {
    const url = `${constantApi['url']}?${objectToParams(params)}`
    const method = constantApi['method']
    const header = getHeader()

    return Axios({
      method: method,
      url: url,
      data: payload,
      headers: header
    })
      .then(res => {
        return res.data
      })
      .catch(err => {
        return Promise.reject(err)
      })
  }

  static callAPIUpload(constantApi, payload, params = {}) {
    const url = `${constantApi['url']}?${objectToParams(params)}`
    const formData = new FormData()
    formData.append('file', payload)
    const header = getHeaderFile()
    return Axios({
      method: 'POST',
      url: url,
      data: formData,
      headers: header
    })
      .then(res => {
        return res.data
      })
      .catch(err => {
        return Promise.reject(err)
      })
  }

  static callAPIFormFile(constantApi, payload, files, params = {}) {
    const url = `${constantApi['url']}?${objectToParams(params)}`
    const method = constantApi['method']
    const header = getHeaderFile()
    const formData = new FormData()
    // formData.append('file', payload)
    formData.append(
      'data',
      new Blob([JSON.stringify(payload)], { type: 'application/json' })
    )
    if (files !== undefined && files !== null && files.length > 0) {
      let i
      const len = files.length
      for (i = 0; i < len; i++) {
        formData.append('file', files[i].raw)
      }
    }

    return Axios({
      method: method,
      url: url,
      data: formData,
      headers: header
    })
      .then(res => {
        return res.data
      })
      .catch(err => {
        return Promise.reject(err)
      })
  }
  static callAPIFormListFile(constantApi, payload, files, files1, params = {}) {
    const url = `${constantApi['url']}?${objectToParams(params)}`
    const method = constantApi['method']
    const header = getHeaderFile()
    const formData = new FormData()
    // formData.append('file', payload)
    formData.append(
      'data',
      new Blob([JSON.stringify(payload)], { type: 'application/json' })
    )
    if (files !== undefined && files !== null && files.length > 0) {
      let i
      const len = files.length
      for (i = 0; i < len; i++) {
        formData.append('file', files[i].raw)
      }
    }
    if (files1 !== undefined && files1 !== null && files1.length > 0) {
      let i
      const len = files1.length
      for (i = 0; i < len; i++) {
        formData.append('files', files1[i].raw)
      }
    }

    return Axios({
      method: method,
      url: url,
      data: formData,
      headers: header
    })
      .then(res => {
        return res.data
      })
      .catch(err => {
        return Promise.reject(err)
      })
  }

  /**
   * @param constantApi : {} config in ConstantAPI.MENU_CODE.ENDPOINT
   * @param fileName : string fileName to download
   * @param params : {} object request params
   * @param $this : Object component
   * */
  static download(constantApi, fileName, params, $this) {
    const url = `${constantApi['url']}?${objectToParams(params)}`
    const header = getHeader()
    return Axios({
      method: 'GET',
      url: url,
      headers: header,
      responseType: 'blob'
    })
      .then(res => {
        const fileURL = window.URL.createObjectURL(new Blob([res.data]))
        const fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', fileName)
        document.body.appendChild(fileLink)
        fileLink.click()
      })
      .catch(err => {
        return Promise.reject(err)
      })
  }

  static showReport(constantApi, params, $this) {
    const url = `${constantApi['url']}?${objectToParams(params)}`
    const header = getHeader()
    return Axios({
      method: 'GET',
      url: url,
      headers: header,
      responseType: 'blob'
    })
      .then(res => {
        const fileURL = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }))
        return fileURL
      })
      .catch(err => {
        return Promise.reject(err)
      })
  }
}

export default ApiFactory
