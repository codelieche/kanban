<template>
  <TopBar title="添加账号" />
  <AccountForm
    action="add"
    :handleSubmit="handleSubmit"
    :data="{ user: '', account: '', 'is_active': true, 'is_default': false }"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

import useBreadcrumbItems from '@/hooks/store/useBreadcrumbItems'
import fetchApi from '@/api/fetchApi'

import TopBar from '@/components/page/topBar.vue'
import AccountForm from './form.vue'

export default defineComponent({
  name: 'AccountAddPage',
  components: { TopBar, AccountForm },
  setup() {
    const breadcrumbItems = [
      {
        title: '首页',
        icon: 'home',
        link: '/',
      },
      {
        title: '存储账号',
        link: '/storage/account',
      },
      {
        title: '添加',
      },
    ]
    useBreadcrumbItems(breadcrumbItems)

    // 路由
    const router = useRouter()

    const handleSubmit = (data: object) => {
      //   console.log(data)
      const url = '/api/v1/storage/account/'
      fetchApi
        .post(url, data, {})
        .then((response) => {
          return response.data
        })
        .then((responseData) => {
          // console.log(responseData)
          if (responseData.id && responseData.id > 0) {
            ElMessage.success({
              message: '添加账号成功',
              type: 'success',
            })
            // 当data中有id字段，就表示添加成功了，跳转去group的详情页
            router.push('/storage/account/' + responseData.id)
          } else {
            console.log(responseData)
            ElMessage.error({
              message: JSON.stringify(responseData),
              type: 'error',
            })
          }
        })
        .catch((err) => {
          console.log(err)
          ElMessage.error({
            message: JSON.stringify(err.data),
            type: 'error',
          })
        })
    }
    return {
      handleSubmit,
    }
  },
})
</script>