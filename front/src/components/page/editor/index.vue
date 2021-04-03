<template>
  <div class="editor">
    <!-- 头部按钮 -->
    <EditorToolbar :editor="editor" />
    <!-- 主体内容 -->
    <div class="content">
      <!-- 左侧内容 -->
      <div
        class="markdown"
        :style="{ display: display.markdown ? 'block' : 'none' }"
      >
        <textarea id="markdown-editor" v-model="value"> </textarea>
      </div>
      <div class="html" v-if="display.html">
        <VueMarkdown :source="value" />
      </div>
    </div>
  </div>

  <!-- 上传图片 -->
  <UploadImageDialog
    title="上传图片"
    :visible="showUploadImage"
    uploadUrl="/api/v1/storage/file/upload"
    :afterCloseHandle="afterCloseUploadImageHandle"
    :tabs="['upload', 'link']"
    :afterUploadHandle="afterUploadImageHandle"
  />
</template>

<script lang="ts">
import { defineComponent, onMounted, provide, Ref, ref, watch } from 'vue'
import CodeMirror from 'codemirror' // CodeMirror，必要
import 'codemirror/lib/codemirror.css' // css，必要
import 'codemirror/mode/markdown/markdown' // markdown的语法高亮，自行替换为你需要的语言
import 'codemirror/mode/javascript/javascript' // markdown的语法高亮，自行替换为你需要的语言

import UploadImageDialog from '@/components/page/uploadImage/dialog.vue'
import VueMarkdown from '@/components/page/vue-markdown/index'
import EditorToolbar from './toolbar/index.vue'

export default defineComponent({
  name: 'Editor',
  components: {
    VueMarkdown,
    EditorToolbar,
    UploadImageDialog,
  },
  props: {
    content: { type: String, default: () => '' },
    onChange: Function,
  },
  setup(props) {
    // 编辑器的值
    const value = ref('')
    const display = ref({
      markdown: true,
      html: true,
    })
    // 把display传递给子组件
    provide('display', display)
    // 上传图片
    const showUploadImage = ref(false)
    provide('showUploadImage', showUploadImage)

    // 编辑器对象
    const editor: Ref<CodeMirror.Editor | null> = ref(null)

    const initEditor = () => {
      // 组件挂载之后实例化CodeMirror
      const markdownEditor = document.getElementById('markdown-editor')
      if (markdownEditor) {
        editor.value = CodeMirror.fromTextArea(
          markdownEditor as HTMLTextAreaElement,
          {
            tabSize: 2, // tab的空格个数
            theme: 'default', //主题样式
            lineNumbers: true, //是否显示行数
            lineWrapping: true, //是否自动换行
            mode: 'markdown', //实现javascript代码高亮
            readOnly: false, //只读
            autofocus: true,
            autocorrect: true,
          }
        )
        // 捕获事件
        editor.value.on('change', (e: CodeMirror.Editor) => {
          value.value = e.getValue()
          // 每次数据变更，都调用props的onChange方法
          if (props.onChange && typeof props.onChange === 'function') {
            props.onChange(value.value)
          }
        })
        // 获取焦点
        // setTimeout(() => {
        //   if (editor.value) {
        //     editor.value.focus()
        //   }
        // }, 50)
      }
    }

    onMounted(() => {
      initEditor()
    })

    // 修改value，当父级传递的content变更的时候，修改
    watch(
      [props],
      () => {
        if (props.content && value.value !== props.content) {
          value.value = props.content
          // 获取焦点
          setTimeout(() => {
            if (editor.value) {
              // editor.value.refresh()
              // editor.value.setCursor(1, 1)
              editor.value.getSelection()
              // editor.value.focus()
            }
          }, 50)
          // editor.value?.setValue(props.content)
          // 采用setValue会出问题
          if (value.value !== '') {
            const ele = document.getElementsByClassName('CodeMirror-wrap')
            if (ele.length === 1) {
              ele[0].remove()
              // initEditor()
              setTimeout(initEditor, 50)
            }
          }
        }
      },
      { immediate: true }
    )

    // 显示上传cover
    const afterCloseUploadImageHandle = () => {
      showUploadImage.value = false
    }
    // 图片上传完毕后操作
    const afterUploadImageHandle = (data: object | string) => {
      // console.log(data)
      let imageUrl = ''
      if (typeof data === 'string') {
        imageUrl = data
      }

      if (data && data['id'] > 0) {
        const keys = ['qiniu', 'fileurl', 'file']

        for (let i = 0; i < keys.length; i++) {
          const item = keys[i]
          if (data[item]) {
            imageUrl = data[item]
            break
          }
        }
      }

      if (imageUrl == '') {
        console.log('图片链接为空')
        return
      } else {
        const imageEle = `![](${imageUrl})`
        editor.value?.replaceSelection(imageEle)
        // 关闭上传图片
        showUploadImage.value = false
      }
    }

    return {
      value,
      display,
      editor,
      // 上传图片
      showUploadImage,
      afterCloseUploadImageHandle,
      afterUploadImageHandle,
    }
  },
})
</script>