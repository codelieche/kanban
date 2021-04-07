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

        <span class="button" v-if="canEditor" @click="() => (showAddCover = !showAddCover)">
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
          :class="['button', { active: showAddTagDialog }]"
          @click="() => (showAddTagDialog = !showAddTagDialog)"
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
            (html, text) => patchUpdateArticle(id, { title: text }, afterTitleUpdateHandle)
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
        :reFreshTimes="reFreshTagsTimes"
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
      <EditableContent
        :key="`${data.id}-description`"
        :content="data.description ? data.description : '请填写描述信息'"
        contextType="text"
        tagName="div"
        :handleContentUpdated="
          (html, text) => patchUpdateArticle(id, { description: text })
        "
        v-if="canEditor"
      />
      <div v-else>
        {{ data.description ? data.description : '无描述信息' }}
      </div>
    </div>
  </header>

  <!-- 添加标签 -->
  <ArticleAddTagDialog
    :articleID="data.id"
    :visible="showAddTagDialog"
    :afterCloseHandle="afterAddTagCloseHandle"
    :reFreshTags="reFreshTags"
  />

  <!-- 上传图片 -->
  <UploadImageDialog
    title="上传图片"
    :visible="showAddCover"
    uploadUrl="/api/v1/storage/file/upload"
    :afterCloseHandle="afterCloseAddCoverHandle"
    :tabs="['upload', 'link']" 
    :afterUploadHandle="afterCoverUploadHandle"
  />

</template>
<script lang="ts">
import { defineComponent, inject, ref } from 'vue'
import moment from 'moment'

import { globalGroup, reFreshArticlesTimes } from '@/hooks/store/useArticleLeftSiderData'
import Icon from '@/components/base/icon.vue'
// import Loading from '@/components/page/loading.vue'
import EditableContent from '@/components/base/editableContent.vue'
import ObjectTags from '@/components/page/objectTag/objectTags.vue'
import UploadImageDialog from '@/components/page/uploadImage/dialog.vue'
import { patchUpdateArticle } from './utils'
import ArticleAddTagDialog from './addTag.vue'

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
    UploadImageDialog,
    ArticleAddTagDialog,
  },

  setup(props) {
    // 开关
    const showDescription = ref(false)
    const showDiscussion = inject('showDiscussion')
    const showCover = ref(false)
    const showAddCover = ref(false)
    const showAddTagDialog = ref(false)

    // 关闭添加标签对话框
    const afterAddTagCloseHandle = () => {
      showAddTagDialog.value = false
    }

    // 刷新文章标签
    const reFreshTagsTimes = ref(0)
    const reFreshTags = () => {
      reFreshTagsTimes.value += 1
    }

    // 显示上传cover
    const afterCloseAddCoverHandle = () => {
      showAddCover.value = false
    }

    // 标题更新之后的函数
    const afterTitleUpdateHandle = () => {
      if(props.reFreshData){
        props.reFreshData()
      }
      // 左侧文章列表更新
      reFreshArticlesTimes.value += 1
    }

    // 封面上传完毕后的操作
    const afterCoverUploadHandle = (data: object | string) => {
      // console.log(data)
      let coverUrl = ''
      if(typeof data === 'string'){
        coverUrl = data
      }

      if(data && data['id'] > 0){
        const keys = ['qiniu', 'fileurl', 'file']

        for(let i=0; i < keys.length; i++){
          const item = keys[i]
          if(data[item]){
            coverUrl = data[item]
            break
          }
        }
      }

      if(coverUrl == ''){
        console.log('封面链接为空')
        return
      }

      // 设置url
      if(props.id){
        patchUpdateArticle(props.id, {cover: coverUrl}, () => {
          if(props.reFreshData){
            props.reFreshData()
            showCover.value = true
            showAddCover.value = false
          }

        })
      }
    }
    return {
      moment,
      globalGroup,
      showDescription,
      showDiscussion,
      showCover,
      showAddCover,
      showAddTagDialog,
      patchUpdateArticle,
      afterAddTagCloseHandle,
      afterTitleUpdateHandle,
      // 刷新标签
      reFreshTagsTimes,
      reFreshTags,
      // 上传cover
      afterCloseAddCoverHandle,
      afterCoverUploadHandle,
    }
  },
})
</script>