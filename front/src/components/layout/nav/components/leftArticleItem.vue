<template>
  <div class="nav">
    <div
      class="item"
      v-if="data && data.id > 0"
      @click.stop="() => (isActive = !isActive)"
    >
      <router-link :to="`/docs/article/${data.id}`">
        <div class="title" :style="{ paddingLeft: `${12 * data.level}px` }">
          <!-- 如果有子元素，那么需要显示个icon -->
          <Icon
            :type="isActive ? 'caret-down' : 'caret-right'"
            v-if="data.children && data.children.length > 0"
          />
          {{ data.title ? data.title : '无标题' }}
          <!-- 如果能添加则需要显示添加按钮 -->
          <div class="add" v-if="canWhite" @click="handleAddClick">
            <Icon type="plus-square-o" />
          </div>
        </div>
      </router-link>
      <!-- 子元素 -->
      <div
        :class="['children', { active: isActive }]"
        v-if="data.children && data.children.length > 0"
      >
        <LeftArticleItem
          v-for="item in data.children"
          :key="`${data.id}-${item.id}`"
          :data="item"
          :canWhite="canWhite"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'

import Icon from '@/components/base/icon.vue'
import { useRouter } from 'vue-router'

import fetchApi from '@/api/fetchApi'
import {
  activeArticeIDs,
  reFreshArticlesTimes,
} from '@/hooks/store/useArticleLeftSiderData'

export default defineComponent({
  name: 'HelloPage',
  props: {
    data: Object,
    canWhite: { type: Boolean, default: () => false },
  },
  components: { Icon },
  setup(props) {
    // 是否是激活的，比如鼠标点击啊，它的child被显示了啊，都是active的状态
    const isActive = ref(false)

    watch([activeArticeIDs], () => {
      if (props.data) {
        if (
          activeArticeIDs.value &&
          activeArticeIDs.value.indexOf(props.data['id']) >= 0 &&
          !isActive.value
        ) {
          isActive.value = true
        }
      }
    }, {immediate: true})

    // 路由
    const router = useRouter()

    // 点击添加文章
    const handleAddClick = (e: MouseEvent) => {
      // 阻止冒泡和默认事件
      e.stopPropagation()
      e.preventDefault()
      // 发起文章
      if (props.data) {
        const url = '/api/v1/docs/article/create'
        const data = {
          parent: props.data['id'],
          group: props.data['group'],
        }
        // 发起创建文章请求
        // console.log(data)
        fetchApi
          .post(url, data)
          .then((response) => response.data)
          .then((responseData) => {
            if (responseData.id > 0) {
              // 创建文章成功
              // 刷新左侧导航
              reFreshArticlesTimes.value += 1

              // 跳转新的文章页面
              router.push(`/docs/article/${responseData.id}`)
            } else {
              // 创建文章失败
              console.log(responseData)
            }
          })
          .catch((err) => {
            console.log(err)
          })
      }
    }
    return {
      isActive,
      handleAddClick,
    }
  },
})
</script>