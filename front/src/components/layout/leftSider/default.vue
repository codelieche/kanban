<template>
  <Resizable
    :maxWidth="360"
    :defaultWidth="defaultWidth"
    :minWidth="collapsed ? 65 : 156"
    :disabled="collapsed"
    :afterSizeChange="afterSizeChange"
  >
    <div class="left-sider" :class="{ collapsed: collapsed }" key="left-sider">
      <div class="header" @click="handleCollapseedToogle">
        <div class="collapsed-toogle">
          <span
            :class="collapsed ? 'el-icon-s-unfold' : 'el-icon-s-fold'"
          ></span>
        </div>
      </div>
      <div class="content">
        <LeftNavItem
          v-for="(item, index) in items"
          :item="item"
          :index="index"
          :key="index"
          :collapsed="collapsed"
        ></LeftNavItem>
      </div>
      <!-- <div class="footer"></div> -->
    </div>
  </Resizable>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
// import navData from '../nav/NavData.js'
import LeftNavItem from '../nav/leftNav.vue'
import Resizable from '@/components/base/resizable.vue'

export default defineComponent({
  name: 'LeftSiderDefault',
  components: { Resizable, LeftNavItem },
  props: {
    items: {
      type: Array,
      default() {
        return []
      },
    },
  },

  setup() {
    // 是否折叠
    const collapsed = ref(false)
    // 默认的宽度
    const defaultWidth = ref(240)

    // 从localstorage中获取数据
    onMounted(() => {
      // 从localStorage中获取宽度
      const widthValue = localStorage.getItem('leftSiderWidth')
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
      localStorage.setItem('leftSiderWidth', width.toString())
    }

    // 折叠
    const handleCollapseedToogle = () => {
      collapsed.value = !collapsed.value
    }

    return {
      collapsed,
      handleCollapseedToogle,
      defaultWidth,
      afterSizeChange
    }
  },
})
</script>

<style lang="less" scoped>
// 导航的背景色
@left-sider-backgroud: #333744;
@left-sider-collapsed-toogle-background: #4a5064;
@left-sider-collapsed-toogle-height: 35px;

.left-sider {
  overflow: auto;
  // width: 200px;
  &.collapsed {
    width: 65px;
  }
  height: 100%;
  max-height: 100%;
  background: @left-sider-backgroud;
  color: #f8f8f8;
  display: flex;
  flex-direction: column;
  .header {
    // height: 50px;
    min-height: 35px;
    .collapsed-toogle {
      height: 35px;
      background: @left-sider-collapsed-toogle-background;
      line-height: @left-sider-collapsed-toogle-height;
      cursor: pointer;
      text-align: center;
      span {
        font-size: 20px;
        font-weight: normal;
        line-height: @left-sider-collapsed-toogle-height;
      }
    }
  }

  // 左侧导航的主体内容
  .content {
    flex: 1;
    // 当导航超过高度的时候，这里滑动
    overflow: hidden auto;
  }
}

// 默认的滑块样式
::-webkit-scrollbar {
  // width: 8px;
  // height: 8px;
  width: 0px;
  height: 0px;
}
::-webkit-scrollbar-track {
  border-radius: 10px;
  // background: @left-sider-collapsed-toogle-background;
  background: rgba(255, 255, 255, 0.1);
  // -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.1);
}
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  // -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.8);
}
</style>