<template>
  <span :class="[className, { danger: danger }]">
    <span :style="{ display: 'inline-block', padding: '0 3px' }">
      <i :class="iconClasses"> </i>
    </span>
    <slot></slot>
  </span>
</template>

<script lang="ts">
/**
 * Icon组件：属性有：
 * 1. type：icon的类型，从element-plus的Icon中取值或者font-awesome中获取
 * 2. danger：是否是危险的类型，是danger就显示为红色
 * 3. spin: 是否旋转，旋转动画，其实也就加入 fa-spin的class
 * 4. className：传递给外层图形的class
 * 5. slot: 当使用<Icon type="home">首页</Icon>会把Icon包裹的内容显示出来
 * 示例：<Icon type="cog" :spin="true" :danger="true" className="large">用户</Icon>
 */
import { computed, defineComponent } from 'vue'
export default defineComponent({
  name: 'Icon',
  props: {
    type: String,
    spin: {
      type: Boolean,
      default: () => false,
    },
    danger: {
      type: Boolean,
      default: () => false,
    },
    className: String,
  },
  setup(props) {
    const iconClasses = computed(() => {
      // icon的type只从element-plus或者font-awesome中获取
      // 如果是el-开头的，那么就是element-plus的，如果不是那么就是fa的，需要我们自己加fa-的前缀
      let name = 'home'
      if (props.type?.startsWith('el-')) {
        name = props.type
      } else {
        name = `fa fa-${props.type}`
      }

      //  是否旋转
      if (props.spin) {
        name += ' fa-spin'
      }

      //  判断是否danger
      if (props.danger) {
        name += ' danger'
      }
      return name
    })

    return {
      iconClasses,
    }
  },
})
</script>