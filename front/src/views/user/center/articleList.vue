<template>
  <TopBar title="文章列表" class="position-relative">
    <div class="right">
      <router-link to="/docs/article/list">
        more<Icon type="angle-double-right" />
      </router-link>
    </div>
  </TopBar>
  <!-- 文章分组过滤 -->
  <ArticleGroupFilter :handleGroupChange="handleGroupChange" />

  <!-- 文章列表 -->
  <Loading v-if="loading" />
  <ColumnWrap class="articles-list" :width="400" v-else-if="dataSource.length > 0">
    <ArticleItem
      v-for="(item, index) in dataSource"
      :key="`${item.id}-${index}`"
      :data="item"
    />
  </ColumnWrap>
  <div class="no-content articles-list" v-else>
      无文章数据...
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'

import { useFetchListData } from '@/hooks/utils/useFetchData'

import Icon from '@/components/base/icon.vue'
import TopBar from '@/components/page/topBar.vue'
import Loading from '@/components/page/loading.vue'
import ColumnWrap from '@/components/page/base/columnWrap.vue'
import ArticleGroupFilter from '@/views/docs/article/groupsFilter.vue'
import ArticleItem from '@/views/docs/article/listItem.vue'

export default defineComponent({
  name: 'ArticleList',
  components: {
    Icon,
    TopBar,
    Loading,
    ColumnWrap,
    ArticleGroupFilter,
    ArticleItem,
  },
  setup() {
    // 当前选中的分组
    const currentGroupID = ref('')
    // 获取文章列表的api
    const apiUrl = ref('/api/v1/docs/article/list?ordering=-time_added')

    // 获取文章数据
    const { loading, dataSource } = useFetchListData(apiUrl)

    // 处理分组变更函数
    const handleGroupChange = (id: string) => {
      currentGroupID.value = id
    }

    // 监控变化
    watch([currentGroupID], () => {
      apiUrl.value = `/api/v1/docs/article/list?ordering=-time_added&group=${currentGroupID.value}`
    })

    return {
      handleGroupChange,
      apiUrl,
      loading,
      dataSource,
    }
  },
})
</script>