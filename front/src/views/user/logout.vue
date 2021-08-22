<template>
  <span></span>
</template>
 
<script lang="ts">
import fetchApi from '@/api/fetchApi'
import { ElMessage } from 'element-plus'
import { defineComponent, onMounted } from 'vue'
import { useRouter } from 'vue-router'
export default defineComponent({
  name: 'UserLogout',
  setup() {
    const router = useRouter()
    // 退出登录
    const logout = () => {
      const url = '/api/v1/account/logout'
      fetchApi
        .get(url)
        .then((response) => response.data)
        .then((data) => {
          console.log(data)
          if (data.status === 'success' || data.status === true) {
            ElMessage.success('退出登录成功')
            router.push('/user/login')
          } else {
            // console.log(data);
            ElMessage.error('退出登录失败！！！')
          }
        })
        .catch((err) => {
          console.log(err)
        })
    }
    onMounted(() => {
      logout()
    })
  },
})
</script>