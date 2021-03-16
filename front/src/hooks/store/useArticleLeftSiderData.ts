import { ref } from 'vue'

export const showLeftSider = ref(true)

export const globalGroup = ref({})
// 设置全局分组
export const setGlobalGroup = (data: object) => {
  globalGroup.value = data
}

// 控制获取刷新文章页数据的
export const reFreshArticlesTimes = ref(0)