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
      <Editor :content="content" :onChange="handleEditorValueOnChange" />
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, inject, Ref, ref } from 'vue'
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
    const showArticleEditor: Ref<boolean> | undefined = inject('showArticleEditor')
    // setTimeout(() => {
    //   showEditor.value = true
    // }, 4000)

    const editorValue = ref('')
    const handleEditorValueOnChange = (value: string) => {
      editorValue.value = value
    }

    const callback = (data: object) => {
      if (data && data['id'] === props.id) {
        // 成功
        if (props.afterDialogCloseHandle) {
          props.afterDialogCloseHandle()
          if(showArticleEditor){
            showArticleEditor.value = false
          }
        } else {
          ElMessage.error('更新文章出错')
        }
      }
    }

    const handleDilogClose = (done: Function) => {
      if (editorValue.value !== props.content && editorValue.value) {
        console.log('我需要提交文章更新')
        // console.log(props.content)
        // console.log(editorValue.value)
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
    return {
      showArticleEditor,
      handleEditorValueOnChange,
      handleDilogClose,
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