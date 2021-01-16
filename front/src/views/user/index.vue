<template>
  <router-view />
</template>

<script>
import { defineComponent } from 'vue'

import useHeaderSlug from '@/hooks/store/useHeaderSlug'

export default defineComponent({
  name: 'BaseIndex',
  components: {},
  props: {},
  setup() {
    //  使用hooks，加载这个页面后，设置顶部的导航选中/base, 组件卸载的时候，重新设置为/
    useHeaderSlug('/user', '/')
    return {}
  }
})
</script>

<style lang="less">
</style>