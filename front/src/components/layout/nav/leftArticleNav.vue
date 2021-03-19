<template>
  <div class="articles" v-if="!loading && dataSource && dataSource.length > 0">
    <LeftArticleItem
      v-for="item in dataSource"
      :key="item.id"
      :data="item"
      :canWhite="canWhite"
    />
  </div>
  <!-- <div v-else>Loading</div> -->
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'

import { globalGroup, reFreshArticlesTimes } from '@/hooks/store/useArticleLeftSiderData'
import { useFetchListData } from '@/hooks/utils/useFetchData'

import LeftArticleItem from './components/leftArticleItem.vue'

export default defineComponent({
  name: 'LeftArticleNav',
  props: {
    canWhite: { type: Boolean, default: () => true },
  },
  components: {
    LeftArticleItem,
  },
  setup() {
    // 分组文章导航
    const apiUrl = ref('')

    // 文章数据
    const { loading, dataSource } = useFetchListData(apiUrl, reFreshArticlesTimes)
    // 监控globalGroup的变化
    watch(
      [globalGroup],
      () => {
        // console.log(globalGroup.value)
        if (
          globalGroup.value &&
          globalGroup.value['id'] &&
          globalGroup.value['id'] > 0
        ) {
          apiUrl.value = `/api/v1/docs/article/all?group=${globalGroup.value['id']}`
        }
      },
      { immediate: true }
    )

    return {
      loading,
      dataSource,
    }
  },
})
</script>