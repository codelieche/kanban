<template>
  <div class="main">
    <router-view></router-view>
  </div>
</template>
<script type="ts">
import { defineComponent } from 'vue'

import useHeaderSlug from '@/hooks/store/useHeaderSlug'

export default defineComponent({
  name: 'TestIndex',
  components: {},
  props: {},
  setup() {
    //  使用hooks，加载这个页面后，设置顶部的导航选中/base, 组件卸载的时候，重新设置为/
    useHeaderSlug('/test', '/')
    return {}
  },
})
</script>

<style lang="less">
</style>