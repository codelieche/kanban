<template>
  <GroupForm
    action="editor"
    :handleSubmit="handleSubmit"
    :data="data"
  />
   <div class="test">
        <el-divider></el-divider>
        <div>
          <div v-for="item in [1, 2, 3, 4, 5, 6]" :key="item">
            <router-link :to="`/user/group/${item}/editor`">
              {{ `/user/group/${item}` }}
            </router-link>
          </div>
        </div>
      </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import useBreadcrumbItems from '@/hooks/store/useBreadcrumbItems'
import GroupForm from './form.vue'
import fetchApi from '@/plugins/fetchApi'
import { useFetchData } from '@/hooks/utils/useFetchData'
import useWatchParamsChange from '@/hooks/utils/useWatchParamsChange'
export default defineComponent({
  name: 'UserGroupEditor',
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
        title: '编辑',
      },
    ]
    useBreadcrumbItems(breadcrumbItems)
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
        apiUrl.value = `/api/v1/account/group/${idVal}`
      } else {
        console.log('ID为false：', idVal)
      }
    })

    // 监控路由的变化
    const handleParamsChange = (value: string) => {
      if(value && id.value !== value){
        apiUrl.value = `/api/v1/account/group/${value}`
        id.value = value
      }
    }
    useWatchParamsChange(router, 'id', handleParamsChange)

    // 表单提交函数
    const handleSubmit = (data: object) => {
      // 发起添加分组的请求
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
            // 当data中有id字段，就表示添加成功了，跳转去group的详情页
            router.push('/user/group/' + responseData.id)
          } else {
            console.log(JSON.stringify(responseData), 8)
          }
        })
        .catch((err) => {
          console.log(err)
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