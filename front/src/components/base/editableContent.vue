<template>
  <component
    :is="tagName"
    ref="elementRef"
    :contentEditable="!disabled"
    :suppressContentEditableWarning="true"
    :spellCheck="spellCheck"
    :onInput="onInput || emitChange"
    :onBlur="onBlur || emitChange"
    :onKeyUp="onKeyUp || emitChange"
    :onKeyDown="onKeyDown || emitChange"
    :onMouseLeave="onMouseLeave || handleContentUpdateFunc"
    :style="{'white-space': 'pre-wrap'}"
  >
    {{ content }}
  </component>
</template>

<script lang="ts">
/**
 * EditableContent: 可编辑的组件
 * 好像升级了vue之后有点问题，后续注意一下
 */
import { defineComponent, onMounted, onUnmounted, Ref, ref } from 'vue'
export default defineComponent({
  name: 'EditableContent',
  props: {
    tagName: { type: String, default: () => 'div' },
    content: { type: String, default: () => '无内容' },
    disabled: { type: Boolean, default: () => false },
    spellCheck: { type: Boolean, default: () => false },
    onChange: Function,
    onInput: Function,
    onBlur: Function,
    onMouseLeave: Function,
    onKeyUp: Function,
    onKeyDown: Function,
    onKeyDownEnter: Function,
    handleContentUpdated: Function,
    // 回车的时候是否提交更新
    enterCommitUpdate: {type: Boolean, default: ()=> false}
  },

  setup(props) {
    // 初始化的内容: 这个是为了，开始修改了，后面又删除还原成原来的了，那么是不需要发起更新请求的
    const initialContent = ref('')
    // 最新的innerrHtml值
    const latestHtml = ref('')
    //   如果组件中的内容被变更了，那么就设置contentUpdated为true
    const contentUpdated = ref(false)
    // Element Ref
    const elementRef: Ref<HTMLDivElement | null> = ref(null)

    // 获取元素
    const getElement = () => {
      return elementRef.value
    }

    onMounted(() => {
      initialContent.value = props.content
    })

    const handleContentUpdateFunc = () => {
      // console.log('handleContentUpdateFunc')
      // 处理组件内容变更后续的操作
      // 当组件鼠标移开，失去焦点的时候，组件卸载的时候，都需要执行一下
      // 当组页面要跳转到其它爷儿们的时候，也会触发 onBlur 事件的
      try {
        if (contentUpdated.value) {
          const element = getElement()
          // console.log('element', element?.innerText)
          const html = element?.innerHTML
          const text = element?.innerText

          // 处理变更事件
          if (props.handleContentUpdated) {
            props.handleContentUpdated(html, text)
            // 操作完了之后，记得重新设置为未更新
            contentUpdated.value = false
            initialContent.value = text as string
          }
        }
      } catch (err) {
        console.log('err', err)
      }
    }

    const emitChange = (originEvt: MouseEvent) => {
      // console.log('emitChange:', originEvt)
      // 获取当前元素
      const element = getElement()
      if (!element) {
        return
      }

      // 获取当前元素中的html
      const html = element.innerHTML
      if(contentUpdated.value && initialContent.value == html){
        contentUpdated.value = false
      }
      if (initialContent.value != html && html !== latestHtml.value && !contentUpdated.value) {
        contentUpdated.value = true
      }

      if (props.onChange && html !== latestHtml.value) {
        const event = Object.assign({}, originEvt, {
          target: {
            value: html,
            text: element.innerText,
          },
        })
        props.onChange(event)
      }
      // 设置最新的html
      latestHtml.value = html

      if(originEvt['key'] == 'Enter' && props.enterCommitUpdate){
        originEvt.preventDefault()
        handleContentUpdateFunc()
      }
    }

    // onMounted(() => {
    //   console.log('onMounted')
    // })

    onUnmounted(() => {
      // 组件卸载的时候，也需要处理判断内容是否更新了
      handleContentUpdateFunc()
    })

    return {
      latestHtml,
      contentUpdated,
      elementRef,
      emitChange,
      handleContentUpdateFunc,
    }
  },
})
</script>

<style lang="less">
// h1 div p span出现编辑时
[contenteditable='true'] {
  // background-color: #eee;
  outline: none;
  // white-space: pre-wrap;
  padding: 2px 5px;
}
</style>