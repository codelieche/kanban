import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
// import qs from 'qs';

import env from '../config/env'

const api: AxiosInstance = axios.create({
  // baseURL: "http://127.0.0.1:9000/",
  baseURL: env.apiBaseUrl,
  // timeout: 20000,
  timeout: env.apiFetchTimeout
})

// axios实例默认配置
api.defaults.headers.common['Content-Type'] = 'application/json'
// api.defaults.headers.common["Content-Type"] = "application/x-www-form-urlencoded";
// api.defaults.headers.common["Host"] = "www.codelieche.com";
// 允许携带cookie
api.defaults.withCredentials = true

// POST、PUT传递的数据处理
api.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // console.log(config)
    if (
      config.method === 'post' ||
      config.method === 'put' ||
      config.method === 'patch'
    ) {
      // console.log(
      //     qs.stringify(config.data),
      //      config.data instanceof Object,
      // )
      // if (!config.data instanceof String){
      //     config.data = qs.stringify(config.data);
      // }else{
      //     // config.data = JSON.stringify(config.data);
      // }
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应处理
api.interceptors.response.use(
  response => {
    // console.log(response)

    if (response.config.method === 'delete') {
      return Promise.resolve(response)
    }
    // const responseData = response.data
    // return Promise.resolve(responseData)
    return Promise.resolve(response)
  },

  error => {
    // 请求出现错误的时候处理函数
    // console.log(error);

    // console.log(error.message, error.response);
    if (/timeout/.test(error.message)) {
      // 超时
      console.log('网络超时，请稍后重试！')
    } else {
      // console.log(error.message);
    }

    if (error.response) {
      let next: string
      let url: string
      // http状态码判断
      switch (error.response.status) {
        // http status handler
        case 401:
          // this.props.history.push(next);
          next = `/user/login?next=${window.location.href}`
          url = window.location.origin + next
          window.location.href = url
          break
        case 403:
          // message.warn("您无权限访问相关数据", 3);
          // alert("您没有权限访问当前数据");
          break
        case 404:
          // console.log('404 Not Found');
          break
        case 500:
          console.log('服务器错误！')
          break
        case 503:
          console.log('服务器响应不过来！')
          break
        default:
          console.log('默认错误提示')
      }
    }

    // 把响应的错误返回
    return Promise.reject(error.response)
  }
)

// export function useAxiosPlugin(app: any) {
//   app.config.globalProperties.$http = api
// }

export default api
