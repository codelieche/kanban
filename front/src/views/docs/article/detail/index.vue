<template>
  <div>{{ data?.id }} -- {{ data?.title }}}</div>
  {{ data?.description }}
</template>

<script lang="ts">
import useFetchData from '@/hooks/utils/useFetchData'
import useWatchParamsChange from '@/hooks/utils/useWatchParamsChange'
import { defineComponent, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import {
  updateGlobalGroup,
  updateLeftSiderActiveItems,
  updateHeaderNavData,
} from './watch'

export default defineComponent({
  name: 'ArticleDetail',
  setup() {
    // 获取路由中的参数
    const router = useRouter()
    const id = ref('')
    const apiUrl = ref<string | null>(null)
    // 刷新数据
    const reFreshTimes = ref(0)
    // 获取详情数据
    const { loading, data, error } = useFetchData<object>(apiUrl, router, reFreshTimes)

    // 每次文章数据变化了，就需要判断当前分组、导航标题、左侧文章
    watch([data], () => {
      
      if (data.value) {
        // 判断是否需要修改全局的分组
        updateGlobalGroup(data.value)
        // 设置左侧展开的文章item
        updateLeftSiderActiveItems(data.value)
        // 设置右侧的文章导航
        updateHeaderNavData(data.value)
      }
    })

    // 组件挂载之后修改api的url
    onMounted(() => {
      const idVal = router.currentRoute.value.params['id']
      id.value = idVal as string
      if (idVal) {
        apiUrl.value = `/api/v1/docs/article/${idVal}`
      } else {
        console.log('ID为False：', idVal)
      }
    })

    // 监控路由的变化
    const handleParamsChange = (value: string) => {
      if (value && id.value !== value) {
        apiUrl.value = `/api/v1/docs/article/${value}`
        id.value = value
      }
    }
    useWatchParamsChange(router, 'id', handleParamsChange)

    return {
      id,
      loading,
      data,
      error,
    }
  },
})
</script>