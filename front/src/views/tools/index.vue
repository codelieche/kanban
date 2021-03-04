<template>
  <router-view></router-view>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import useHeaderSlug from '@/hooks/store/useHeaderSlug'

export default defineComponent({
  name: 'ToolsIndex',
  props: {},
  setup() {
    // 使用hooks，加载这个页面后，设置顶部的导航选中/tools，组件卸载的时候，重新设置为/
    useHeaderSlug('/tools', '/')
    return {}
  },
})
</script>