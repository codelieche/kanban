<template>
  <!-- 采用基础布局 -->
  <base-layout v-bind="layoutDisplay">
    <template v-slot:header>
      <Header001></Header001>
      <!-- <Header001></Header001> -->
    </template>

    <!-- 左侧内容 -->
    <template v-slot:left-sider>
      <LeftSider001 :items="data"></LeftSider001>
    </template>

    <!-- 主体内容 -->
    <template v-slot:right>
      <!-- <keep-alive> -->
      <div class="right">
        <!-- 路由各个区域重点编写的代码 -->
        <div class="header">
          <!-- 面包屑导航 -->
          <Breadcrumb />
        </div>
        <!-- 右侧主体内容 -->
        <div class="content">
          <router-view></router-view>
        </div>
        <!-- 路由各个区域重点编写的代码 -->
      </div>
      <!-- </keep-alive> -->
    </template>

    <!-- 底部内容 -->
    <template v-slot:footer>
      <Footer001></Footer001>
    </template>
  </base-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import BaseLayout from '@/components/layout/layout.vue'
import Header001 from '@/components/layout/header/001.vue'
import LeftSider001 from '@/components/layout/leftSider/001.vue'
import Footer001 from '@/components/layout/footer/001.vue'
import Breadcrumb from '@/components/base/breadcrumb.vue'
import { LeftSiderMenu } from '@/types/base/nav'
import useFetchData from '@/hooks/utils/useFetchData'

export default defineComponent({
  name: 'HomeIndex',
  components: {
    BaseLayout,
    Header001,
    LeftSider001,
    Footer001,
    Breadcrumb,
  },
  props: {
    layoutDisplay: {
      type: Object,
      default() {
        return {
          showHeader: true,
          showLeft: true,
          showMain: true,
          showRight: true,
          showFooter: false,
        }
      },
    },
    // navItems: {
    //   type: Array,
    //   default() {
    //     return []
    //   },
    // },
  },
  setup() {
    const navUrl = ref('/api/v1/account/user/nav/list')
    const { loading, data } = useFetchData<Array<LeftSiderMenu>>(navUrl)
    //  使用hooks，加载这个页面后，设置顶部的导航选中/, 组件卸载的时候，重新设置为/
    // useHeaderSlug('/', '/')

    return {
      loading,
      data,
    }
  },
})
</script>
<style lang="less">
body {
  height: 100vh;
}
</style>