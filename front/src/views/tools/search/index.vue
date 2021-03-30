<template>
  <div class="main full">
    <div :class="['search', { 'with-results': searchValue !== '' }]">
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
            focus
            @change="handleSearch"
          >
            <template #prepend v-if="searchValue === ''">
              <el-select
                v-model="selectType"
                placeholder="请选择"
                class="hiddle-icon"
                :style="{ width: '60px' }"
                @change="onSelectChange"
              >
                <el-option label="文章" value="article"></el-option>
                <el-option label="图片" value="image"></el-option>
                <el-option label="对象" value="object"></el-option>
              </el-select>
            </template>
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
        <el-tab-pane label="对象" name="object">
          <template #label>
            <span><Icon type="cubes" /> 对象</span>
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
    // select
    const selectType = ref('')

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
        selectType.value = query['searchType'] as string
      } else {
        selectType.value = 'article'
      }
      if (query['search']) {
        searchValue.value = query['search'] as string
        inputValue.value = query['search'] as string
      }
    })

    // 监控路由的变化
    watch([router.currentRoute], () => {
      const query = router.currentRoute.value.query
      //   console.log(query)
      if (query['searchType']) {
        searchType.value = query['searchType'] as string
      }
      if (query['search']) {
        searchValue.value = query['search'] as string
        inputValue.value = query['search'] as string
      } else {
        searchValue.value = ''
        inputValue.value = ''
      }
    })

    // onUnmounted(() => {
    //   console.log('我要卸载了')
    // })

    // 监控值的变化
    watch([searchType, searchValue], () => {
      // console.log('searchType:', searchType.value)
      //   pageUrlPrefix.value = `/tools/search?searchType=${searchType.value}`
      if (searchType.value === '') {
        // 默认使用article
        searchType.value = 'article'
      }

      if (selectType.value !== searchType.value) {
        selectType.value = searchType.value
      }

      // 使用新的路由
      if (searchValue.value) {
        router.push({
          path: '/tools/search',
          query: {
            searchType: searchType.value,
            search: searchValue.value,
            page: 1,
          },
        })
      }
    })

    // select变更的时候
    const onSelectChange = (value: string) => {
      // console.log(value)
      searchType.value = value
    }

    return {
      searchType,
      selectType,
      inputValue,
      searchValue,
      handleSearch,
      onSelectChange,
    }
  },
})
</script>