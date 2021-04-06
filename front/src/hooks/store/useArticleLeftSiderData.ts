import { Ref, ref } from 'vue'
import { useFetchDataOneTimes } from '../utils/useFetchData'

export const showLeftSider = ref(true)

export const globalGroup = ref({})
export const canWrite = ref(false)
export const globalGroupPermissions: Ref<Array<string>> = ref([])
// 设置全局分组
export const setGlobalGroup = (data: object) => {
  // console.log('setGlobalGroup:', data)
  globalGroup.value = data
  
  // 在这里获取权限数据
  if(globalGroup.value && globalGroup.value['id'] > 0){
    const permissionUrl = `/api/v1/docs/group/${globalGroup.value['id']}/permissions`
    const callback = (permissions: Array<string>) => {
      if(permissions && Array.isArray(permissions)){
        globalGroupPermissions.value = permissions
        if(permissions.indexOf('write') >= 0){
          canWrite.value = true
        }
      }
    }
    useFetchDataOneTimes<Array<string>>(permissionUrl, null, callback)
  }
}

// 控制获取刷新文章页数据的
export const reFreshArticlesTimes = ref(0)

// 激活展开的文章ids
export const activeArticeIDs: Ref<Array<number>> = ref([])