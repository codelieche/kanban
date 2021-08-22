<template>
  <TopBar title="添加分组" />

  <GroupForm
    action="add"
    :handleSubmit="handleSubmit"
    :data="{ name: '', code: '', image: ''}"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

import useBreadcrumbItems from '@/hooks/store/useBreadcrumbItems'
import fetchApi from '@/api/fetchApi'

import { ElMessage } from 'element-plus'
// 基础组件
import TopBar from '@/components/page/topBar.vue'
import GroupForm from './form.vue'

export default defineComponent({
  name: 'HelloPage',
  components: { TopBar, GroupForm },
  setup() {
    const breadcrumbItems = [
      {
        title: '首页',
        icon: 'home',
        link: '/',
      },
      {
        title: '文档分组',
        link: '/docs/group',
      },
      {
        title: '添加',
      },
    ]
    useBreadcrumbItems(breadcrumbItems)
    const router = useRouter()
    // 表单提交函数
    const handleSubmit = (data: object) => {
      // 发起添加分组的请求
      // console.log(JSON.stringify(data))
      const url = '/api/v1/docs/group/create'
      fetchApi
        .post(url, data, {})
        .then((response) => {
          return response.data
        })
        .then((responseData) => {
          // console.log(responseData)
          if (responseData.id && responseData.id > 0) {
            ElMessage.success({
              message: '添加分组成功',
              type: 'success',
            })
            // 当data中有id字段，就表示添加成功了，跳转去group的详情页
            router.push('/docs/group/' + responseData.id)
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