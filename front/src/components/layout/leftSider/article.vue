<template>
  <Resizable
    :maxWidth="460"
    :minWidth="150"
    :defaultWidth="defaultWidth"
    :afterSizeChange="afterSizeChange"
    class="left-sider article"
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
    <ArticleGroups />

    <!-- 分组文章导航 -->
    <div class="content">
      <LeftArticleNav />
    </div>

    <!-- 底部 -->
    <div class="footer">
      <div class="add" @click.stop="handleAddClick">
        <Icon type="plus" /> 新的文章
      </div>
    </div>
  </Resizable>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'

import {
  globalGroup,
  reFreshArticlesTimes,
  showLeftSider,
} from '@/hooks/store/useArticleLeftSiderData'
import Icon from '@/components/base/icon.vue'
import Resizable from '@/components/base/resizable.vue'
import ArticleGroups from './articleGroups.vue'
import LeftArticleNav from '@/components/layout/nav/leftArticleNav.vue'
import fetchApi from '@/plugins/fetchApi'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'LeftSiderArticle',
  props: {},
  components: {
    Icon,
    Resizable,
    ArticleGroups,
    LeftArticleNav,
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

    // 路由
    const router = useRouter()

    // 点击添加文章
    const handleAddClick = (e: MouseEvent) => {
      // 阻止冒泡和默认事件
      e.stopPropagation()
      e.preventDefault()
      // 发起文章
      const url = '/api/v1/docs/article/create'
      const data = {
        group: globalGroup.value['id'],
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

    return {
      showLeftSider,
      defaultWidth,
      afterSizeChange,
      toogleLeftSider,
      handleAddClick,
    }
  },
})
</script>

<style lang="less" scoped>
</style>