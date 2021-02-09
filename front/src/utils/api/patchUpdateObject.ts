import fetchApi from '@/plugins/fetchApi'
import { ElMessage } from 'element-plus'

export const patchUpdateObject = (
  appLabel: string,
  model: string,
  objectID: string | number,
  data: {},
  callback: Function
) => {
  // 参数校验
  if (!(!!appLabel && !!model && !!objectID)) {
    console.log('参数传递错误：', appLabel, model, objectID)
  }

  if (objectID === undefined) {
    console.log('传入的objectID为空')
    return
  }
  if (data === {}) {
    return
  }

  // 1. 生成api的url
  const url = `/api/v1/${appLabel}/${model}/${objectID}`

  // 2. 发起请求
  fetchApi
    .patch(url, data)
    .then(response => response.data)
    .then(responseData => {
      //   console.log(responseData);
      if (responseData.id > 0) {
        // 如果成功了，需要执行callback
        if (typeof callback === 'function') {
          // 执行回调函数:把新的值传给callBack
          callback(responseData)
        }
      } else {
        // 出错了
        console.log(responseData)
      }
    })
    .catch(err => {
      console.log(err)

      if (err && err.status) {
        if (err.status === 403) {
          ElMessage.error('您无权限')
        } else if (err.status === 404) {
          ElMessage.error('404错误')
        } else {
          ElMessage.error(`出现错误：${err.status}`)
        }
      }
    })
  // 发起请求结束
}

export default patchUpdateObject
