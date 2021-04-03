<template>
  <el-dialog
    title=""
    v-model="showArticleEditor"
    custom-class="article-editor-dialog"
    width="80%"
    :append-to-body="true"
    :show-close="false"
    :before-close="handleDilogClose"
    destroy-on-close
  >
    <div>
      <el-alert
        :title="`${lastContent.time}:更新未提交成功，双击切换成未提交的内容`"
        type="warning"
        @dblclick.stop="lastContentDoubleClick"
        v-if="lastContent && lastContent.key"
      >
      </el-alert>
      <Editor :content="editorValue" :onChange="handleEditorValueOnChange" />
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, inject, Ref, ref, watch } from 'vue'
import Editor from '@/components/page/editor/index.vue'
import { patchUpdateArticle } from './utils'
import { ElMessage } from 'element-plus'

export default defineComponent({
  name: 'EditorDialog',
  components: { Editor },
  props: {
    id: Number,
    content: String,
    visible: { type: Boolean, default: () => false },
    afterDialogCloseHandle: Function,
  },
  setup(props) {
    const showArticleEditor: Ref<boolean> | undefined = inject(
      'showArticleEditor'
    )
    // setTimeout(() => {
    //   showEditor.value = true
    // }, 4000)

    const editorValue = ref('编辑文章')
    const lastContent = ref({ key: '', content: '', time: '' })
    const handleEditorValueOnChange = (value: string) => {
      editorValue.value = value
    }

    // 加载新的数据
    const loadLastContent = () => {
      const key = `article_${props.id}_content`
      const v = localStorage.getItem(key)
      if (v !== null && v !== '') {
        try {
          const obj = JSON.parse(v)
          lastContent.value = obj
        } catch (err) {
          console.log(err)
          lastContent.value = { key: '', content: '', time: '' }
        }
      } else {
        lastContent.value = { key: '', content: '', time: '' }
      }
    }

    watch(
      [props],
      () => {
        if (props.content) {
          editorValue.value = props.content
        }
        if (props.id) {
          loadLastContent()
        }
      },
      { immediate: true }
    )

    const callback = (data: object) => {
      if (data && data['id'] === props.id) {
        // 成功
        ElMessage.success('更新文章内容成功')
        if (props.afterDialogCloseHandle) {
          props.afterDialogCloseHandle()
          if (showArticleEditor) {
            showArticleEditor.value = false
          }
        }
      } else {
        ElMessage.error('更新文章出错')
        if (showArticleEditor) {
          showArticleEditor.value = false
        }
      }
    }

    const handleDilogClose = (done: Function) => {
      if (editorValue.value !== props.content && editorValue.value) {
        console.log('我需要提交文章更新:', props.id)
        // console.log(props.content)
        console.log(editorValue.value)
        if (props.id) {
          const data = {
            content: editorValue.value,
          }
          patchUpdateArticle(props.id, data, callback)
        } else {
          done()
        }
      } else {
        done()
      }

      // 关闭dialog，并刷新文章页
    }
    const lastContentDoubleClick = () => {
      editorValue.value = lastContent.value.content
      lastContent.value = { key: '', content: '', time: '' }
    }
    return {
      showArticleEditor,
      editorValue,
      lastContent,
      handleEditorValueOnChange,
      handleDilogClose,
      lastContentDoubleClick,
    }
  },
})
</script>

<style lang="less">
.article-editor-dialog {
  .CodeMirror-sizer {
    margin-left: 35px !important;
  }
  .el-dialog__header {
    padding: 0;
    display: none;
  }
  .CodeMirror-gutter-wrapper {
    display: block;
    left: -30px !important;
    .CodeMirror-linenumber {
      width: 21px !important;
    }
  }
  .CodeMirror-gutter.CodeMirror-linenumbers {
    width: 37px !important;
  }
}
</style>