<template>
  <el-dialog
    :title="title"
    :width="width"
    v-model="showDialog"
    custom-class="base-dialog"
    :show-close="true"
    @close="handleDialogClose"
    @props="props"
  >
    <slot></slot>
  </el-dialog>
</template>

<script lang="ts">
/**
 * 基础对话框相关的基础组件：
 * props属性：
 * 1. visible： 控制显示对话框
 * 2. width: 对话框的宽度、默认720px
 * 3. title: 标题，默认为空
 * 4. handleDialogClose: 当对话框关闭的时候需要操作的函数，一般是控制visible
 * 5. props: el-dialog的其它配置选项
 */

import { defineComponent, ref, watch } from 'vue'

export default defineComponent({
  name: 'BaseDialog',
  props: {
    visible: {  // 控制显示对话框
      type: Boolean,
      deefault: () => false,
    },
    width: {  // 对话框的宽度，可以是\dpx也可以是\d%
        type: String,
        default: () => "460px"
    },
    title: {  // 显示的标题
      type: String,
      default: () => '',
    },
    handleDialogClose: {  // 当对话框关闭的时候触发，一般是控制上级传递的visbile值
      type: Function,
      default: () => {
        () => null
      },
    },
    props: {
        type: Object,
        default: () => {
            return {
                'destroy-on-close': true,
            }
        }
    }
  },
  setup(props) {
    // 是否显示对话框
    const showDialog = ref(false)

    watch(
      [props],
      () => {
        // 监控属性的变化，当父级组件传递过来visible的时候，修改showDrawer
        if (props.visible !== showDialog.value) {
          showDialog.value = props.visible
        }
      },
      { immediate: true }
    )

    return {
      showDialog,
    }
  },
})
</script>
