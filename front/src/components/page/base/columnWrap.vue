<template>
  <div
    :class="[className, {border: border}]"
    :style="{ columnCount: columnNumber }"
    ref="columnRef"
  >
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, Ref, ref, watch } from 'vue'
export default defineComponent({
  name: 'ColumnWrap',
  props: {
    class: String,
    width: { type: Number, default: () => 0 },
    border: {
      type: Boolean,
      default: () => true,
    },
  },
  setup(props) {
    // 类名称
    const className = ref('column-wrap')
    // 列的div的Ref
    const columnRef: Ref<HTMLElement | null> = ref(null)
    // 列设置
    const columnNumber = ref(1)

    // 计算列
    const calculatecolumnNumber = () => {
      if (columnRef.value && props.width > 0) {
        // console.log(columnRef.value.clientWidth, columnRef.value.scrollWidth)
        // console.dir(columnRef.value)
        // const column = Math.ceil(
        // const column = Math.floor(
        const column = Math.round(
          (columnRef.value.scrollWidth - 60) / props.width
        )
        // console.log('column: ', column)
        columnNumber.value = column > 1 ? column : 1
      }
    }

    // 监控属性的变化
    watch(
      [props],
      () => {
        if (props.class) {
          if (props.class.indexOf('column-wrap') >= 0) {
            className.value = props.class
          } else {
            className.value = `column-wrap ${props.class}`
          }
        } else {
          className.value = 'column-wrap'
        }
      },
      { immediate: true }
    )

    // 监控columnRef的变化
    watch([columnRef], () => {
      if (columnRef.value) {
        calculatecolumnNumber()
      }
    })

    // 当div变化大小的时候，也是需要重新计算列的
    onMounted(() => {
      window.onresize = calculatecolumnNumber
    })

    return {
      columnRef,
      className,
      columnNumber,
    }
  },
})
</script>

<style lang="less" scoped>
.column-wrap {
  // column-count: 5; // 在代码中根据元素的宽度计算设置
  column-gap: 5px;
  padding: 10px 0;

  box-sizing: border-box;
  margin-bottom: 15px;

  &.border {
    // 设置边框
    border-top: 1px solid #d4d6d8;
    border-bottom: 1px solid #d4d6d8;
  }
  & > div, & > a, & > span {
    // 如果使用了margin可能会造成一个元素显示在两列，改用padding，break-inside为avoid才有效
    // 故在css里面再加一层：item-inner
    -webkit-column-break-inside: avoid;
    break-inside: avoid;
    width: 100%;
    box-sizing: border-box;
  }
}
</style>