<template>
  <component
    :is="tagName"
    :class="`resizable ${className}`"
    :style="!disabled && width > 0 ? { width: `${width}px` } : {}"
  >
    <span
      class="react-resizable-handle"
      ref="elementRef"
      :style="{ display: disabled ? 'none' : 'block' }"
    ></span>
    <slot></slot>
  </component>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, Ref, watch } from 'vue'
export default defineComponent({
  name: 'Resizable',
  props: {
    className: { type: String, default: () => '' },
    tagName: { type: String, default: () => 'div' },
    defaultWidth: { type: Number, default: () => 200 },
    minWidth: { type: Number, default: () => 0 },
    maxWidth: { type: Number, default: () => 0 },
    disabled: { type: Boolean, default: () => false },
    afterSizeChange: Function,
  },
  setup(props) {
    // Element Ref
    const elementRef: Ref<HTMLDivElement | null> = ref(null)

    const width = ref(props.defaultWidth)

    // 控制是否可拖拽的标志，当拖拽超出限制，就设置为不可拖拽了
    // 后续可调整为：当鼠标滑过边界的时候，又变成可拖拽的了
    const canResizable = ref(false)

    // 获取元素
    const getElement = () => {
      return elementRef.value
    }

    const addEvent = () => {
      const resizeElement = getElement()
      //   console.log('element', resizeElement)
      if (!resizeElement) {
        return
      }

      // 鼠标hover事件
      // resizeElement.onmouseover = function(){
      //   // 设置可以拖拽
      //   console.log('canResizable.value:', canResizable.value)
      //   canResizable.value = true
      // }

      // 绑定事件
      resizeElement.onmousedown = function (evt: MouseEvent) {
        // 设置可以拖拽
        canResizable.value = true

        // console.log(evt)
        // resizeElement.style.background = '#818181'
        let startX = evt.clientX
        
        // console.log('startX:', startX)
        // console.log(resizeElement.offsetLeft)

        // 设置鼠标移动事件
        document.onmousemove = function (e: MouseEvent) {
          // console.log('e:', e)
          if (!canResizable.value) {
            // 如果不可拖拽了，那直接返回
            return
          }
          const endX = e.clientX
          // console.log('endX - startX', endX - startX)
          width.value = width.value + endX - startX
          startX = e.clientX
          if (props.minWidth > 0 && width.value < props.minWidth) {
            width.value = props.minWidth
            // 设置不可拖动了
            canResizable.value = false
          }

          if (props.maxWidth > 0 && width.value > props.maxWidth) {
            width.value = props.maxWidth
            // 设置不可拖动了
            canResizable.value = false
          }
        }

        document.onmouseup = () => {
          // 恢复颜色
          // resizeElement.style.background = '#fff'
          document.onmousemove = null
          document.onmouseup = null
          resizeElement.releasePointerCapture
          if (props.afterSizeChange) {
            props.afterSizeChange(width.value)
          }
        }
        resizeElement.setPointerCapture
        return false
      }
    }

    // 组件加载完之后就给resizableElement添加点击函数
    onMounted(() => {
      addEvent()
    })

    // 监控defaultWidth的变化
    watch([props], () => {
      if (props.defaultWidth > 0 && !props.disabled) {
        width.value = props.defaultWidth
      }
    })

    return {
      elementRef,
      width,
    }
  },
})
</script>

<style lang="less" scoped>
.resizable {
  position: relative;
  height: 100%;
  // display: inline-block;
  .react-resizable-handle {
    // background-color: #444;
    position: absolute;
    width: 15px;
    height: 100%;
    bottom: 0;
    right: -15px;
    cursor: col-resize;
    z-index: 10;
  }
}
</style>