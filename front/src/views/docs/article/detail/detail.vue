<template>
  <article v-if="data && data.id > 0">
    <!-- 右上角的菜单 -->
    <div class="tools" v-if="canEditor">
      <el-dropdown>
        <div class="toogle">
          <Icon type="ellipsis-h" />
        </div>
      </el-dropdown>
    </div>
    <!-- 文章头部 -->
    <header class="middle">
      <div class="title">
        <!-- 显示描述等的开关 -->
        <div class="toogle">
          <span
            :class="['button', { active: showDescription }]"
            @click="() => (showDescription = !showDescription)"
          >
            <Icon type="info-circle" />
            {{ showDescription ? '隐藏描述' : '显示描述' }}
          </span>

          <span
            :class="['button', { active: showDiscussion }]"
            @click="() => (showDiscussion = !showDiscussion)"
          >
            <Icon type="commenting" />
            {{ showDiscussion ? '隐藏讨论' : '显示讨论' }}
          </span>

          <span class="button" v-if="canEditor">
            <Icon type="image" />
            {{ data && data.cover ? '修改封面' : '添加封面' }}
          </span>

          <span
            class="button"
            v-if="data && data.cover"
            :class="['button', { active: showCover }]"
            @click="() => (showCover = !showCover)"
          >
            <Icon type="image" />
            {{ showCover ? '隐藏封面' : '显示封面' }}
          </span>

          <span
            class="button"
            v-if="canEditor"
            :class="['button', { active: showAddTagModal }]"
          >
            <Icon type="tag" />
            添加标签
          </span>
        </div>

        <!-- 文章的标题 -->
        <div class="row">
          <div class="icon">
            <Icon type="file-text-o" />
          </div>
          <EditableContent
            :key="`${data.id}-title`"
            :content="data.title ? data.title : '无标题'"
            contentType="text"
            tagName="h1"
            :spellCheck="false"
            :handleContentUpdated="(data) => patchUpdateArticle(id, {title: data}, reFreshData)"
            v-if="canEditor"
          />
          <h1 v-else>
            {{ data.title ? data.title : '无标题' }}
          </h1>
        </div>
      </div>
    </header>
  </article>
  <el-divider></el-divider>
  {{ data }}
</template>
<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import useFetchData from '@/hooks/utils/useFetchData'
import { globalGroup, canWrite } from '@/hooks/store/useArticleLeftSiderData'
import Icon from '@/components/base/icon.vue'
// import Loading from '@/components/page/loading.vue'
import EditableContent from '@/components/base/editableContent.vue'
import { patchUpdateArticle } from './utils'

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
    EditableContent,
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
    // 开关
    const showDescription = ref(false)
    const showDiscussion = ref(false)
    const showCover = ref(false)
    const showAddTagModal = ref(false)

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
      showDescription,
      showDiscussion,
      showCover,
      showAddTagModal,
      loading,
      data,
      error,
      reFreshData,
      patchUpdateArticle,
    }
  },
})
</script>