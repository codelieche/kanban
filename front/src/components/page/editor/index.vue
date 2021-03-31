<template>
  <div class="editor">
    <!-- 头部按钮 -->
    <EditorToolbar :editor="editor" />
    <!-- 主体内容 -->
    <div class="content">
      <!-- 左侧内容 -->
      <div class="markdown" v-if="display.markdown">
        <textarea id="markdown-editor" v-model="value"> </textarea>
      </div>
      <div class="html" v-if="display.html">
        <VueMarkdown :source="value" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, Ref, ref } from 'vue'
import CodeMirror from 'codemirror' // CodeMirror，必要
import 'codemirror/lib/codemirror.css' // css，必要
import 'codemirror/mode/markdown/markdown' // markdown的语法高亮，自行替换为你需要的语言
import 'codemirror/mode/javascript/javascript' // markdown的语法高亮，自行替换为你需要的语言

import VueMarkdown from '@/components/page/vue-markdown/index'
import EditorToolbar from './toolbar/index.vue'

export default defineComponent({
  name: 'Editor',
  components: {
    VueMarkdown,
    EditorToolbar,
  },

  data() {
    // 编辑器的值
    const value = ref('# Hello World\n> goood')
    const display = reactive({
      markdown: true,
      html: true,
    })
    const editor: Ref<CodeMirror.Editor | null> = ref(null);

    onMounted(() => {
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
        })
      }
    })

    return {
      value,
      display,
      editor,
    }
  },
})
</script>