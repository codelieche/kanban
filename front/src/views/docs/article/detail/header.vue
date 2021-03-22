<template>
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
          :handleContentUpdated="
            (html, text) => patchUpdateArticle(id, { title: text }, reFreshData)
          "
          v-if="canEditor"
        />
        <h1 v-else>
          {{ data.title ? data.title : '无标题' }}
        </h1>
      </div>
    </div>
    <!-- title结束 -->

    <!-- 文章的元数据 -->
    <div class="metadata">
      <!-- 文章标签 -->
      <ObjectTags
        appLabel="docs"
        model="article"
        :objectID="data.id"
        :canDelete="canEditor"
      />

      <div class="infos">
        <div class="item">
          {{ data.user }}
        </div>
        <div class="item">
          发布于:
          {{
            moment(data.time_added, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD')
          }}
          · {{ moment(data.time_added, 'YYYY-MM-DD HH:mm:ss').fromNow() }}
        </div>
        <div class="item" v-if="data && data.time_updated">
          更新于:
          {{
            data.time_updated &&
            moment(data.time_updated, 'YYYY-MM-DD HH:mm:ss').fromNow()
          }}
        </div>
      </div>
    </div>

    <!-- 封面 -->
    <div class="cover" v-if="data && data.cover && showCover">
      <img :src="data.cover" alt="封面" />
    </div>

    <!-- 文章描述 -->
    <div class="description" v-if="showDescription">
      <EditableContent :key="`${data.id}-description`" 
       :content="data.description ? data.description : '请填写描述信息'"
       contextType="text"
       tagName="div"
       :handleContentUpdated="(html, text) => patchUpdateArticle(id, { description: text })"
       v-if="canEditor"
      />
      <div v-else>
        {{ data.description ? data.description : '无描述信息' }}
      </div>
    </div>
  </header>
</template>
<script lang="ts">
import { defineComponent, inject, ref } from 'vue'
import moment from 'moment'

import { globalGroup } from '@/hooks/store/useArticleLeftSiderData'
import Icon from '@/components/base/icon.vue'
// import Loading from '@/components/page/loading.vue'
import EditableContent from '@/components/base/editableContent.vue'
import ObjectTags from '@/components/page/objectTag/objectTags.vue'
import { patchUpdateArticle } from './utils'

export default defineComponent({
  name: 'ArticleDetailHeader',
  props: {
    id: String,
    data: Object,
    canEditor: Boolean,
    reFreshData: Function,
  },
  components: {
    Icon,
    // Loading,
    EditableContent,
    ObjectTags,
  },

  setup() {
    // 开关
    const showDescription = ref(false)
    const showDiscussion = inject('showDiscussion')
    const showCover = ref(false)
    const showAddTagModal = ref(false)

    return {
      moment,
      globalGroup,
      showDescription,
      showDiscussion,
      showCover,
      showAddTagModal,
      patchUpdateArticle,
    }
  },
})
</script>