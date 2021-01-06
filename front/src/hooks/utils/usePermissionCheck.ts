import { onMounted, ref, Ref, watch } from 'vue'
import { AxiosResponse } from 'axios'

import fetchApi from '@/plugins/fetchApi'

export const usePermissionCheck = <T>(
  permission: Ref<string> | string,
  successCode = 200
) => {
  const havePermission = ref<boolean>(false)

  const fetchData = (permission: string) => {
    const url = '/api/v1/account/permission/check'
    fetchApi
      .post(url, { permission: permission })
      .then((response: AxiosResponse) => {
        if (response.status == successCode) {
          //   console.log(response.data)
          if (response.data.result) {
            havePermission.value = true
          } else {
            havePermission.value = false
          }
        } else {
          havePermission.value = false
        }
      })
      .catch(err => {
        console.log(err)
        havePermission.value = false
      })
  }

  onMounted(() => {
    // console.log('即将发起ajax请求：', url, typeof url)
    if (typeof permission === 'object') {
      watch(
        permission,
        () => {
          if (permission.value) {
            fetchData(permission.value)
          }
        },
        { immediate: true }
      )
    } else {
      fetchData(permission)
    }
  })

  return {
    havePermission
  }
}

export default usePermissionCheck
