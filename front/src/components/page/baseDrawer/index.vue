<template>
  <el-drawer
    :title="title"
    :size="size"
    v-model="showDrawer"
    :with-header="true"
    custom-class="base-drawer"
    :destroy-on-close="true"
    :show-close="true"
    :before-close="handleDrawBeforeClose"
  >
    <slot></slot>
  </el-drawer>
</template>

<script lang="ts">
/**
 * 抽屉相关的基础组件：
 * props属性：
 * 1. visible： 控制显示抽屉
 * 2. size: 抽屉的宽度、默认720px
 * 3. title: 标题，默认为空
 * 4. handleDrawBeforeClose: 当抽屉关闭的时候需要操作的函数，一般是控制visible
 * 5. showNoContent: 无内容的时候是否显示
 */

import { defineComponent, ref, watch } from 'vue'

export default defineComponent({
  name: 'BaseDrawer',
  props: {
    visible: {  // 控制显示抽屉
      type: Boolean,
      deefault: () => false,
    },
    size: {  // 抽屉的宽度，可以是\dpx也可以是\d%
        type: String,
        default: () => "720px"
    },
    title: {  // 显示的标题
      type: String,
      default: () => '',
    },
    showNoContent: {  // 当没有内容的时候是否显示  
      type: Boolean,
      default: () => true,
    },
    handleDrawBeforeClose: {  // 当抽屉关闭的时候触发，一般是控制上级传递的visbile值
      type: Function,
      default: () => {
        () => null
      },
    },
  },
  setup(props) {
    // 是否显示抽屉
    const showDrawer = ref(false)

    watch(
      [props],
      () => {
        // 监控属性的变化，当父级组件传递过来visible的时候，修改showDrawer
        if (props.visible !== showDrawer.value) {
          showDrawer.value = props.visible
        }
      },
      { immediate: true }
    )

    return {
      showDrawer,
    }
  },
})
</script>
