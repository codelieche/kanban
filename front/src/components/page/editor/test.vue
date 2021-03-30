<template>
  <div>
    ffff111
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import CodeMirror from 'codemirror' // CodeMirror，必要
import 'codemirror/lib/codemirror.css' // css，必要
import 'codemirror/mode/javascript/javascript' // js的语法高亮，自行替换为你需要的语言

export default defineComponent({
  name: 'Editor',
  data() {
    onMounted(() => {
      console.log(CodeMirror)
    })
    return {
      // 代码
      code: 'codes',
      cmOptions: {
        tabSize: 4, // tab的空格个数
        theme: 'dracula', //主题样式
        lineNumbers: true, //是否显示行数
        lineWrapping: true, //是否自动换行
        styleActiveLine: true, //line选择是是否加亮
        matchBrackets: true, //括号匹配
        mode: 'vue', //实现javascript代码高亮
        readOnly: false, //只读
      },
    }
  },
})
</script>