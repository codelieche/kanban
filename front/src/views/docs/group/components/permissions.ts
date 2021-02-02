import fetchApi from '@/plugins/fetchApi'
import { ElMessage } from 'element-plus'

// 删除分组的用户
export const delteGroupUserPermission = (
  code: string,
  user: string,
  callback: Function
) => {
  const url = `/api/v1/docs/groupuser/delete?group=${code}&user=${user}`
  // 发起delete请求
  fetchApi
    .delete(url)
    .then(responseData => {
      if (responseData.status === 204) {
        ElMessage.success(`删除${user}权限成功`)
        if (callback && typeof callback === 'function') {
          callback()
        }
      } else {
        ElMessage.warning('删除权限失败')
      }
    })
    .catch(err => {
      console.log(err)
    })
}
