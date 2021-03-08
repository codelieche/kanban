<template>
  <div class="search" @mouseleave="changeShowInput">
    <Icon type="search" @mouseover="changeShowInput" v-if="!showInput" />
    <el-input
      v-model="inputValue"
      placeholder="search"
      size="small"
      @change="handleSearch"
      v-else
    >
      <template #suffix>
        <Icon type="search" />
      </template>
    </el-input>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'

import Icon from '@/components/base/icon.vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'HeaderSearchButton',
  components: { Icon },
  setup() {
    //   是否显示input
    const showInput = ref(false)
    // 修改显示input
    const changeShowInput = () => {
      showInput.value = !showInput.value
    }
    // 路由
    const router = useRouter()

    // input输入的值
    const inputValue = ref('')

    // 当按回车键的时候跳转搜索页面
    const handleSearch = (value: string) => {
      // 搜索页面地址
      const searchPage = '/tools/search'

      // 搜索类型
      const searchType = router.currentRoute.value.query['searchType']

      //   跳转搜索页面
      if (value) {
        router.push({
          path: searchPage,
          query: {
            searchType: searchType ? searchType : 'article',
            search: value,
          },
        })
      } else {
        // 跳转搜索页
        router.push(searchPage)
      }
      //   输入框的值置空
      inputValue.value = ''
    }
    return {
      inputValue,
      showInput,
      changeShowInput,
      handleSearch,
    }
  },
})
</script>

<style lang="less" scoped>
.search {
  display: inline-block;
}
</style>