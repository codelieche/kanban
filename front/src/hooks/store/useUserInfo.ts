import { ref } from 'vue'
import { UserInfo } from '@/types/base/user'

export const userInfo = ref<UserInfo | null>(null)

export const setUserInfo = function(data: UserInfo) {
  if (data) {
    userInfo.value = data
  }
}

export default {
    userInfo,
    setUserInfo,
}