<template>
  <div class="main base-layout">
    <div class="search results">
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
            @change="handleSearch"
          ></el-input>
        </div>
      </div>

      <!-- 类型选择 -->
      <el-tabs v-model="searchType">
        <el-tab-pane label="文章" name="article"></el-tab-pane>
        <el-tab-pane label="图片" name="image"></el-tab-pane>
      </el-tabs>

      <!-- 结果列表 -->
      <BaseList
        :pageUrlPrefix="pageUrlPrefix"
        :apiUrlPrefix="apiUrlPrefix"
        :showHeader="false"
        :showTools="false"
        :pageSize="20"
      >
        <template v-slot:default="data">
          <!-- 文章的结果 -->
          <ColumnWrap
            class="articles-list"
            :width="400"
            v-if="searchType === 'article'"
          >
            <ArticleItem
              v-for="(item, index) in data.dataSource"
              :key="`${item.id}-${index}`"
              :data="item"
            />
          </ColumnWrap>
          <ColumnWrap
            class="images-list"
            :width="270"
            v-if="searchType === 'image'"
          >
            <ImageItem
              v-for="(item, index) in data.dataSource"
              :key="`${item.id}-${index}`"
              :data="item"
            />
          </ColumnWrap>
        </template>
      </BaseList>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'

import { useRouter } from 'vue-router'

import BaseList from '@/components/page/baseList.vue'
import ColumnWrap from '@/components/page/base/columnWrap.vue'
import ArticleItem from '@/views/docs/article/listItem.vue'
import ImageItem from '@/views/docs/image/listItem.vue'

export default defineComponent({
  name: 'SearchIndexPage',
  props: {},
  components: { BaseList, ColumnWrap, ArticleItem, ImageItem },
  setup() {
    // 搜索的类型
    const searchType = ref('article')
    // 搜索的值
    const searchValue = ref('')
    const inputValue = ref('')
    // 搜索相关的数据
    const apiUrlPrefix = ref('/api/v1/docs/article/list')
    const pageUrlPrefix = ref('/tools/search')

    // 路由
    const router = useRouter()

    // 搜索处理函数
    const handleSearch = (value: string) => {
      console.log('value:', value)
      searchValue.value = value
    }

    // 监控值的变化
    watch([searchType, searchValue], () => {
      if (searchType.value == 'image') {
        apiUrlPrefix.value = '/api/v1/docs/image/list'
      } else {
        apiUrlPrefix.value = '/api/v1/docs/article/list'
      }

      if (searchValue.value) {
        // 推送
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

    return {
      searchType,
      inputValue,
      searchValue,
      handleSearch,
      // 获取列表相关的数据
      apiUrlPrefix,
      pageUrlPrefix,
    }
  },
})
</script>