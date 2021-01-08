<template>
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
import GroupForm from './form.vue'
import fetchApi from '@/plugins/fetchApi'
export default defineComponent({
  name: 'UserGroupAdd',
  components: { GroupForm },
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
      console.log(JSON.stringify(data))
      const url = '/api/v1/account/group/create'
      fetchApi
        .post(
          url,
          data,
          {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
          }
        )
        .then((response) => {
          return response.data
        })
        .then((responseData) => {
          // console.log(responseData)
          if (responseData.id && responseData.id > 0) {
            // 当data中有id字段，就表示添加成功了，跳转去group的详情页
            router.push("/user/group/" + responseData.id);
          } else {
            console.log(JSON.stringify(responseData), 8);
          }
        })
        .catch((err) => {
          console.log(err)
        })
    }
    return {
      handleSubmit,
    }
  },
})
</script>
