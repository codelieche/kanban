<template>
  <TopBar title="编辑账号" />
  <AccountForm action="editor" :handleSubmit="handleSubmit" :data="data" />
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

import useBreadcrumbItems from '@/hooks/store/useBreadcrumbItems'
import fetchApi from '@/plugins/fetchApi'
import useFetchData from '@/hooks/utils/useFetchData'

import TopBar from '@/components/page/topBar.vue'
import AccountForm from './form.vue'
import useWatchParamsChange from '@/hooks/utils/useWatchParamsChange'

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
        title: '编辑',
      },
    ]
    useBreadcrumbItems(breadcrumbItems)

    // 路由
    const router = useRouter()
    const id = ref('')
    const apiUrl = ref<string | null>(null)
    // 获取详情数据
    const { loading, data, error } = useFetchData(apiUrl, router)
    // 组件挂载之后修改api的url
    onMounted(() => {
      const idVal = router.currentRoute.value.params['id']
      id.value = idVal as string

      if (idVal) {
        apiUrl.value = `/api/v1/storage/account/${idVal}/`
      } else {
        console.log('ID为false：', idVal)
      }
    })

    // 监控路由的变化
    const handleParamsChange = (value: string) => {
      if (value && id.value !== value) {
        apiUrl.value = `/api/v1/storage/account/${value}/`
        id.value = value
      }
    }
    useWatchParamsChange(router, 'id', handleParamsChange)

    const handleSubmit = (data: object) => {
      //   console.log(data)
      const url = `/api/v1/storage/account/${id.value}/`
      fetchApi
        .put(url, data, {})
        .then((response) => {
          return response.data
        })
        .then((responseData) => {
          // console.log(responseData)
          if (responseData.id && responseData.id > 0) {
            ElMessage.success({
              message: '修改账号成功',
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
      id,
      loading,
      data,
      error,
      handleSubmit,
    }
  },
})
</script>