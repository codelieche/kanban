// 发起fetch请求时候的url前缀
export const apiBaseUrl = process.env.VUE_APP_BASE_URL !== undefined
  ? process.env.VUE_APP_BASE_URL
  : ''

//  发起api请求的超时时间
export const apiTimeout = process.env.VUE_APP_API_TIMEOUT
  ? process.env.VUE_APP_API_TIMEOUT
  : 30000

export default {
  apiBaseUrl,
  apiTimeout
}
