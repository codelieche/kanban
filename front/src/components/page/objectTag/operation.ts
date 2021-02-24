import fetchApi from '@/plugins/fetchApi'
import { ElMessage } from 'element-plus'

// 添加对象标签操作
const handleObjectTagAdd = (
  appLabel: string,
  model: string,
  objectID: number,
  tagKey: string,
  value: string,
  callback: Function
) => {
  const data = {
    'app_label': appLabel,
    model: model,
    key: tagKey,
    value: value,
    'object_id': objectID
  }
  const url = '/api/v1/tags/objecttag/create'
  // 发起添加标签请求
  fetchApi
    .post(url, data)
    .then(response => response.data)
    .then(responseData => {
      if (responseData.id > 0) {
        ElMessage.success('添加标签成功')
        // 判断是否有回调函数
        if(callback && typeof callback === 'function'){
            callback(responseData)
        }
      } else {
        ElMessage.warning(`添加标签失败:${JSON.stringify(responseData)}`)
      }
    })
    .catch(err => {
      console.log(err)
    })
}

export { handleObjectTagAdd }

export default handleObjectTagAdd
