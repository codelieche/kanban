<template>
  <Resizable
    :maxWidth="460"
    :minWidth="150"
    :defaultWidth="defaultWidth"
    :afterSizeChange="afterSizeChange"
    class="left-sider"
    v-if="showLeftSider"
  >
    <div class="header">
      <!-- 头部Logo -->
      <div class="logo">
        <router-link to="/">
          <img
            alt="log"
            src="http://127.0.0.1:9000/static/image/logo-kanban.svg"
          />
        </router-link>
      </div>

      <!-- 隐藏左侧的开关 -->
      <div class="toogle" @click="toogleLeftSider">
        <Icon type="angle-double-left" />
      </div>
    </div>
    <!-- Header结束 -->
    <!-- 文章分组 -->
    <div class="namespace">namespace</div>

    <!-- 分组文章导航 -->
    <div class="content">
      <!-- <div :style="{ height: '2000px', width: '400px' }">ddd</div> -->
    </div>
    <!-- 底部 -->
    <div class="footer">Hello</div>
  </Resizable>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'

import { showLeftSider } from '@/hooks/store/useArticleLeftSiderData'
import Icon from '@/components/base/icon.vue'
import Resizable from '@/components/base/resizable.vue'

export default defineComponent({
  name: 'LeftSiderArticle',
  props: {},
  components: {
    Icon,
    Resizable,
  },
  setup() {
    // 是否显示左侧
    // const showLeftSider = ref(true)

    // 默认的宽度
    const defaultWidth = ref(200)
    // 左侧开关的显示按钮
    const toogleLeftSider = () => {
      showLeftSider.value = !showLeftSider.value
    }
    // 从localstorage中获取数据
    onMounted(() => {
      // 从localStorage中获取宽度
      const widthValue = localStorage.getItem('articleLeftSiderWidth')
      if (widthValue) {
        const result = parseInt(widthValue)
        // console.log(widthValue, isNaN(widthValue), typeof widthValue, result);
        if (result) {
          defaultWidth.value = result >= 156 && result <= 460 ? result : 200
        } else {
          defaultWidth.value = 200
        }
      }
    })

    // 修改defaultWidth的值
    const afterSizeChange = (width: number) => {
      defaultWidth.value = width
      localStorage.setItem('articleLeftSiderWidth', width.toString())
    }

    return {
      showLeftSider,
      defaultWidth,
      afterSizeChange,
      toogleLeftSider,
    }
  },
})
</script>

<style lang="less" scoped>
// 导航背景色
@left-sider-backgroud: #eee;
@left-sider-header-background: #333744;
@left-sider-header-logo-background: #333744;
@left-sider-header-color: #fff;
@left-sider-collapsed-toogle-background: #4a5064;

.left-sider {
  overflow: hidden !important;
  box-sizing: content-box;
  height: 100%;
  max-height: 100%;
  background: @left-sider-backgroud;
  transition: left 0.6s ease;
  -webkit-transition: left 0.6s ease;
  display: flex;
  flex-direction: column;

  .header {
    background: @left-sider-header-background;
    flex-grow: 0;
    flex-shrink: 0;
    transition: box-shadown 300ms easee 0s;
    position: relative;
    color: @left-sider-header-color;

    // logo开始
    .logo {
      box-sizing: border-box;
      height: 50px;
      background-color: @left-sider-header-logo-background;
      padding: 7px 10px;
      img {
        max-width: 100%;
        height: 36px;
      }
    }
    &:hover {
      .toogle {
        visibility: visible;
      }
    }
    // 开关
    .toogle {
      position: absolute;
      right: 0;
      top: 0;
      text-align: center;
      width: 40px;
      font-size: 30px;
      line-height: 50px;
      cursor: pointer;
      visibility: hidden;
      z-index: 2;
    }
  }

  // 分组
  .namespace {
    background-color: #eee;
    color: #595959;
    line-height: 24px;
  }

  // 导航的内容
  .content {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
  }
  // 底部
  .footer {
    border-top: 1px solid #000;
  }
}
</style>