<template>
  <div class="main">
    <TopBar title="编辑分组" />
    <el-row :gutter="16">
      <el-col :xs="24" :sm="18" :md="18">
        <GroupForm action="editor" :handleSubmit="handleSubmit" :data="data" />
      </el-col>
      <el-col :xs="24" :sm="6">
        <ModelLogs app="auth" model="group" :id="data.id" v-if="data && data.id"/>
      </el-col>
    </el-row>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

import TopBar from '@/components/page/topBar.vue'
import ModelLogs from '@/components/page/modelLogs/index.vue'

import fetchApi from '@/api/fetchApi'
import { useFetchData } from '@/hooks/utils/useFetchData'
import useBreadcrumbItems from '@/hooks/store/useBreadcrumbItems'
import useWatchParamsChange from '@/hooks/utils/useWatchParamsChange'

import GroupForm from './form.vue'

export default defineComponent({
  name: 'UserGroupEditor',
  components: { GroupForm, TopBar, ModelLogs },
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
        title: '编辑',
      },
    ]
    useBreadcrumbItems(breadcrumbItems)

    const router = useRouter()
    const id = ref<string>('')
    const apiUrl = ref<string | null>(null)
    // 获取详情数据
    const { loading, data, error } = useFetchData(apiUrl, router)
    // 组件挂载之后修改api的url
    onMounted(() => {
      const idVal = router.currentRoute.value.params['id']
      id.value = idVal as string

      if (idVal) {
        apiUrl.value = `/api/v1/account/group/${idVal}/`
      } else {
        console.log('ID为false：', idVal)
      }
    })

    // 监控路由的变化
    const handleParamsChange = (value: string) => {
      if (value && id.value !== value) {
        apiUrl.value = `/api/v1/account/group/${value}/`
        id.value = value
      }
    }
    useWatchParamsChange(router, 'id', handleParamsChange)

    // 表单提交函数
    const handleSubmit = (data: object) => {
      // 发起添加分组的请求
      const url = `/api/v1/account/group/${id.value}/`
      fetchApi
        .put(url, data, {
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
              message: '修改分组成功',
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
      data,
      loading,
      error,
    }
  },
})
</script>