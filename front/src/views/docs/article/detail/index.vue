<template>
  <div class="main">
    <ArticleDetail :id="id" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import useWatchParamsChange from '@/hooks/utils/useWatchParamsChange'
import ArticleDetail from './detail.vue'

export default defineComponent({
  name: 'ArticleDetailIndex',
  components: {
    ArticleDetail,
  },
  setup() {
    // 获取路由中的参数
    const router = useRouter()
    const id = ref('')

    // 组件挂载之后修改api的url
    onMounted(() => {
      const idVal = router.currentRoute.value.params['id']
      id.value = idVal as string
    })

    // 监控路由的变化
    const handleParamsChange = (value: string) => {
      if (value && id.value !== value) {
        id.value = value
      }
    }
    useWatchParamsChange(router, 'id', handleParamsChange)

    return {
      id,
    }
  },
})
</script>