<template>
  <div className="results" v-if="display">
    <BaseList
      :pageUrlPrefix="pageUrlPrefix"
      :apiUrlPrefix="apiUrlPrefix"
      :paramsFields="['page', 'page_size', 'searchType', 'search']"
      :showHeader="false"
      :showTools="false"
      :pageSize="20"
      :reFreshTimes="reFreshTimes"
      v-if="searchValue.value !== '' && searchType == 'article'"
    >
      <template v-slot:default="data">
        <!-- 文章的结果 -->
        <div class="no-content" v-if="data.dataSource < 1">无搜索结果</div>
        <ColumnWrap class="articles-list" :width="400" v-else>
          <ArticleItem
            v-for="(item, index) in data.dataSource"
            :key="`${item.id}-${index}`"
            :data="item"
          />
        </ColumnWrap>
      </template>
    </BaseList>

    <BaseList
      :pageUrlPrefix="pageUrlPrefix"
      :apiUrlPrefix="apiUrlPrefix"
      :paramsFields="['page', 'page_size', 'searchType', 'search']"
      :showHeader="false"
      :showTools="false"
      :pageSize="20"
      :reFreshTimes="reFreshTimes"
      v-if="searchValue.value !== '' && searchType == 'image'"
    >
      <template v-slot:default="data">
        <!-- 图片的结果 -->
        <div class="no-content" v-if="data.dataSource < 1">无搜索结果</div>
        <ColumnWrap class="images-list" :width="270" v-else>
          <ImageItem
            v-for="(item, index) in data.dataSource"
            :key="`image-${item.id}-${index}`"
            :data="item"
            @click="handleImageClick(item)"
          />
        </ColumnWrap>
        <!-- 图片弹出框 -->
        <ImageDialog
          :visible="showImageDialog"
          :data="currentImage"
          :reFreshData="reFreshData"
          :afterCloseHandle="afterImageCloseHandle"
        />
      </template>
    </BaseList>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'

import BaseList from '@/components/page/baseList.vue'
import ColumnWrap from '@/components/page/base/columnWrap.vue'
import ArticleItem from '@/views/docs/article/listItem.vue'
import ImageItem from '@/views/docs/image/listItem.vue'
import ImageDialog from '@/views/docs/image/imageDialog.vue'

export default defineComponent({
  name: 'SearchResults',
  props: {
    searchType: { type: String, default: () => 'article' },
    searchValue: { type: String, default: () => '' },
  },
  components: { BaseList, ColumnWrap, ArticleItem, ImageItem, ImageDialog },
  setup(props) {
    // 是否显示结果内容
    const display = ref(false)

    // 搜索相关的数据
    const apiUrlPrefix = ref('')
    const pageUrlPrefix = ref('/tools/search')
    // 刷新数据
    const reFreshTimes = ref(0)
    const reFreshData = () => {
      reFreshTimes.value += 1
    }

    // 监控搜索类型和搜索值的变化
    watch(
      [props],
      () => {
        if (props.searchType && props.searchValue) {
          display.value = true
        } else {
          display.value = false
        }

        //   pageUrlPrefix.value = `/tools/search?searchType=${searchType.value}`
        if (props.searchValue == '') {
          apiUrlPrefix.value = ''
        } else {
          if (props.searchType == 'image') {
            apiUrlPrefix.value =
              '/api/v1/docs/image/list?search=' + props.searchValue
          } else {
            apiUrlPrefix.value =
              '/api/v1/docs/article/list?search=' + props.searchValue
          }
        }
      },

      { immediate: true }
    )

    // 图片对话框
    // 弹出图片对话框
    const showImageDialog = ref(false)
    const currentImage = ref({})
    const afterImageCloseHandle = () => {
      showImageDialog.value = false
      currentImage.value = {}
    }

    const handleImageClick = (data: object) => {
      //   console.dir(data)
      showImageDialog.value = true
      currentImage.value = data
    }

    return {
      display,
      apiUrlPrefix,
      pageUrlPrefix,
      // 数据刷新
      reFreshTimes,
      reFreshData,
      // 图片对话框
      showImageDialog,
      currentImage,
      afterImageCloseHandle,
      handleImageClick,
    }
  },
})
</script>