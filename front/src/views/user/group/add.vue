<template>
  <TopBar title="添加分组" />
  <GroupForm
    action="add"
    :handleSubmit="handleSubmit"
    :data="{ name: '', user_set: [] }"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import useBreadcrumbItems from '@/hooks/store/useBreadcrumbItems'
import TopBar from '@/components/page/topBar.vue'
import GroupForm from './form.vue'
import fetchApi from '@/plugins/fetchApi'
import { ElMessage } from 'element-plus'
export default defineComponent({
  name: 'UserGroupAdd',
  components: { GroupForm, TopBar },
  setup() {
    const breadcrumbItems = [
      {
        title: '首页',
        icon: 'home',
        link: '/',
      },
      {
        title: '用户分组',
        link: '/user/group',
      },
      {
        title: '添加',
      },
    ]
    const router = useRouter()
    useBreadcrumbItems(breadcrumbItems)
    // 表单提交函数
    const handleSubmit = (data: object) => {
      // 发起添加分组的请求
      // console.log(JSON.stringify(data))
      const url = '/api/v1/account/group/create'
      fetchApi
        .post(url, data, {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        })
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
            router.push('/user/group/' + responseData.id)
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
