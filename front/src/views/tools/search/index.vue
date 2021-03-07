<template>
  <div class="main base-layout">
    <div :class="['search', { results: searchValue !== '' }]">
      <!-- 搜索表单 -->
      <div class="form">
        <div class="logo">
          <img
            src="http://127.0.0.1:9000/static/image/kanban-blue.svg"
            alt="logo"
          />
        </div>

        <div class="input">
          <el-input
            v-model="inputValue"
            :placeholder="searchValue ? searchValue : ''"
            clearable
            size="small"
            class="primary"
            @change="handleSearch"
          >
            <template #append>
              <el-button size="small" type="primary">搜索一下</el-button>
            </template>
          </el-input>
        </div>
      </div>

      <!-- 类型选择 -->
      <el-tabs v-model="searchType" v-if="searchValue !== ''">
        <el-tab-pane label="文章" name="article">
          <template #label>
            <span><Icon type="file-text-o" /> 文章</span>
          </template>
        </el-tab-pane>
        <el-tab-pane label="图片" name="image">
          <template #label>
            <span><Icon type="image" /> 图片</span>
          </template>
        </el-tab-pane>
      </el-tabs>

      <!-- 结果列表 -->
      <SearchResults :searchType="searchType" :searchValue="searchValue" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue'

import { useRouter } from 'vue-router'

import Icon from '@/components/base/icon.vue'
import SearchResults from './results.vue'

export default defineComponent({
  name: 'SearchIndexPage',
  props: {},
  components: { Icon, SearchResults },
  setup() {
    // 搜索的类型
    const searchType = ref('')
    // 搜索的值
    const searchValue = ref('')
    const inputValue = ref('')

    // 路由
    const router = useRouter()

    // 搜索处理函数
    const handleSearch = (value: string) => {
      // console.log('value:', value)
      searchValue.value = value
    }

    // 组件加载的时候获取searchType
    onMounted(() => {
      const query = router.currentRoute.value.query
      if (query['searchType']) {
        searchType.value = query['searchType'] as string
      }
      if (query['search']) {
        searchValue.value = query['search'] as string
        inputValue.value = query['search'] as string
      }
    })

    // 监控值的变化
    watch([searchType, searchValue], () => {
      //   pageUrlPrefix.value = `/tools/search?searchType=${searchType.value}`
      if (searchValue.value == '') {
        searchType.value === ''
        searchType.value = ''
      } else {
        if (searchType.value === '') {
          // 默认使用article
          searchType.value = 'article'
        }
      }

      // 使用新的路由
      router.push({
        path: '/tools/search',
        query: {
          searchType: searchType.value,
          search: searchValue.value,
          page: 1,
        },
      })
    })

    return {
      searchType,
      inputValue,
      searchValue,
      handleSearch,
    }
  },
})
</script>