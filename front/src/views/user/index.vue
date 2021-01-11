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
  },

  data() {
    return {
      // 采用一个通用的布局，然后传参来显示各个区域
      layoutDisplay: {
        showHeader: true,
        showLeft: true,
        showRight: true,
        showFooter: false,
      },
    }
  },
  methods: {
    onClick() {
      console.log('on click' + new Date())
    },
    listenToChildEvent(data) {
      print(data)
      this.$router.push(data)
    },
  },
})
</script>

<style lang="less">
</style>