<template>
  <article v-if="data && data.id > 0">
    <!-- 右上角的菜单 -->
    <ArticleDetailTools :id="id" :data="data" :canEditor="canEditor" />

    <!-- 文章头部 -->
    <ArticleDetailHeader
      :id="id"
      :data="data"
      :canEditor="canEditor"
      :reFreshData="reFreshData"
    />

    <!-- 文章主体内容 -->

    <!-- 文章评论 -->
    <ArticleDetailDiscussions :id="data.id" v-if="showDiscussion" />

    <!-- 子文章列表 -->
    <section class="children" v-if="data.children && data.children.length > 0">
      <div class="title">
        <h3>文章列表</h3>
      </div>
      <ul>
        <li v-for="item in data.children" :key="item.id">
          <router-link :to="`/docs/article/${item.id}`">
            <Icon type="file-text-o" />
            {{ item.title ? item.title : '无标题' }}
          </router-link>
        </li>
      </ul>
    </section>
  </article>
  <el-divider></el-divider>
  {{ data }}
</template>
<script lang="ts">
import { defineComponent, provide, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import useFetchData from '@/hooks/utils/useFetchData'
import { globalGroup, canWrite } from '@/hooks/store/useArticleLeftSiderData'
import Icon from '@/components/base/icon.vue'
// import Loading from '@/components/page/loading.vue'
// import EditableContent from '@/components/base/editableContent.vue'
// import ObjectTags from '@/components/page/objectTag/objectTags.vue'
import { patchUpdateArticle } from './utils'
import ArticleDetailTools from './tools.vue'
import ArticleDetailHeader from './header.vue'
import ArticleDetailDiscussions from './discussions.vue'
import {
  updateGlobalGroup,
  updateLeftSiderActiveItems,
  updateHeaderNavData,
} from './watch'

export default defineComponent({
  name: 'ArticleDetail',
  props: {
    id: String,
  },
  components: {
    Icon,
    // Loading,
    // EditableContent,
    // ObjectTags,
    ArticleDetailTools,
    ArticleDetailHeader,
    ArticleDetailDiscussions,
  },

  setup(props) {
    // 获取路由中的参数
    const router = useRouter()
    const apiUrl = ref<string | null>(null)
    // 刷新数据
    const reFreshTimes = ref(0)

    // 获取详情数据
    const { loading, data, error } = useFetchData<object>(
      apiUrl,
      router,
      reFreshTimes
    )

    // 用户能否编辑
    const canEditor = ref(false)
    // 显示评论的开关
    const showDiscussion = ref(false)
    // 把显示Discussion传递给子组件
    provide('showDiscussion', showDiscussion)

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

    watch([canWrite], () => {
      // 其实是还需要判断分组是否是文章的分组的，后续再修复这个
      canEditor.value = canWrite.value
    })

    // 组件挂载之后修改api的url
    watch(
      [props],
      () => {
        if (props.id) {
          apiUrl.value = `/api/v1/docs/article/${props.id}`
          canEditor.value = canWrite.value
        }
      },
      { immediate: true }
    )

    // 刷新文章数据
    const reFreshData = () => {
      reFreshTimes.value += 1
    }

    return {
      globalGroup,
      canEditor,
      showDiscussion,
      loading,
      data,
      error,
      reFreshData,
      patchUpdateArticle,
    }
  },
})
</script>