<template>
  <BaseLayout v-bind="layoutDisplay">
    <!-- 左侧内容 -->
    <template v-slot:left-sider>
      <LeftSiderArticle> </LeftSiderArticle>
    </template>

    <!-- 右侧主体内容 -->
    <template v-slot:right>
      <div class="right article">
        <!-- 文章右侧头部区域 -->
        <ArticleRightHeader />

        <div class="content">
          <router-view></router-view>
        </div>
      </div>
    </template>
  </BaseLayout>
</template>

<script lang="ts">
/**
 * 文章页的首页入口
 * 1. 左右布局，没有Header
 * 2. 左侧为文章所属分组的导航，右侧为文章内容
 * 3. 右侧有Header和Body
 */
import { defineComponent } from 'vue'


import BaseLayout from '@/components/layout/layout.vue'
import LeftSiderArticle from '@/components/layout/leftSider/article.vue'
import ArticleRightHeader from '@/components/layout/header/article.vue'

export default defineComponent({
  name: 'ArticleHomeIndex',
  components: {
    BaseLayout,
    LeftSiderArticle,
    ArticleRightHeader,
  },
  props: {
    layoutDisplay: {
      type: Object,
      default: () => {
        return {
          showHeader: false,
          showLeft: true,
          showBody: true,
          showRight: true,
          showFooter: false,
        }
      },
    },
  },
  setup() {
    

    return {
    }
  },
})
</script>