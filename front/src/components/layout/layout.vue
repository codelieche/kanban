<template>
  <div class="container">
    <!-- 头部区域开始 -->
    <slot name="header" v-if="showHeader"> </slot>
    <!-- 头部区域结束 -->

    <!-- 页面主体内容 -->
    <slot name="main" v-if="showMain">
      <div class="main">
        <slot name="left-sider" v-if="showLeft">
          <!-- 左侧内容 -->
        </slot>
        <slot name="right" v-if="showRight">
          <router-view></router-view>
        </slot>
      </div>
    </slot>
    <!-- 页面主体内容结束 -->

    <!-- 底部内容开始 -->
    <slot name="footer" v-if="showFooter">
      <!-- <div class="footer">
            底部内容
        </div> -->
    </slot>
    <!-- 底部内容结束 -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "BaseLayout",
  props: {
    showHeader: {
      type: Boolean,
      default: true,
    },
    showMain: {
      type: Boolean,
      default: true,
    },
    showLeft: {
      type: Boolean,
      default: false,
    },
    showRight: {
      type: Boolean,
      default: true,
    },
    showFooter: {
      type: Boolean,
      default: false,
    },
  },
});
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;
  background-color: #f9f9f9;
  display: flex;
  flex-direction: column;

  .main {
    flex: 1 1;
    background: #ffffff;
    display: flex;
    overflow: auto;

    .left-sider {
      height: 100%;
      overflow: auto;
    }

    .right,
    .content {
      flex: 1;
      background-color: #fff;
      overflow: auto;
    }
  }
}
</style>