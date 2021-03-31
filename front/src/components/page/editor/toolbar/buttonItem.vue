<template>
  <div class="no-active" @click="handleButtonClick">
    <Icon :type="icon" v-if="!!icon" />
    <Icon v-else> {{ text }} </Icon>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import CodeMirror from 'codemirror'

import Icon from '@/components/base/icon.vue'

export default defineComponent({
  name: 'ButtonItem',
  components: { Icon },
  props: {
    type: String,
    icon: String,
    text: String,
    editor: Object as PropType<CodeMirror.Editor>,
  },
  setup(props) {
    const handleButtonClick = () => {
      if (!props.type || !props.editor) {
        return
      }
      //   console.log(props.editor)

      // 根据type来做不同的处理
      if (props.type === 'image') {
        // 显示图片上传Modal
        console.log('上传图片')
        return
      }

      // undo和redo
      if (['undo', 'redo'].indexOf(props.type) >= 0) {
        switch (props.type) {
          case 'undo':
            props.editor?.undo()
            return
          case 'redo':
            props.editor?.redo()
            return
          default:
            return false
        }
      }
      // 获取编辑器选择的文本
      const selections = props.editor.getSelections()
      const selectionsResults = selections.map((item) => {
        // console.log('item:', item)
        let result
        switch (props.type) {
          case 'link':
            return `[${item}]()`
          case 'image':
            return `![${item}]()`
          case 'italic':
            return `*${item}*`
          case 'bold':
            return `**${item}**`
          case 'strikethrough':
            return `~~${item}~~`
          case 'list-ul':
            result = item.replace('\n', '\n- ')
            result = '- ' + result
            return result
          case 'list-ol':
            result = item.replace('\n', '\n1. ')
            result = '1. ' + result
            return result
          case 'code':
            return '`' + item + '`'
          case 'quote':
            return '> ' + item
          case 'blockquote':
            // return '\n```\n' + item + '\n```\n'
            return '```' + item
//           case 'table':
//             // eslint-disable-next-line no-case-declarations
//             const tableStr = ` | Title1   | Title2 | Title3 | Title4 |
// | ---- | --- | --- | --- |
// | 1    | - | - | - |
// | 2    | - | - | - |\n`
//             return '\n\n' + tableStr
          default:
            return item
        }
      })
      // 替换结果
      props.editor?.replaceSelections(selectionsResults)

    }

    return {
      handleButtonClick,
    }
  },
})
</script>