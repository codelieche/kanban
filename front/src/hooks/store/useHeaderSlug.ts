import { onBeforeUnmount, onMounted, ref } from 'vue'

export const headerSlug = ref('/')

export default function(currentSlug: string, homeSlug = '/') {
  onMounted(() => {
      if(currentSlug !== ''){
        headerSlug.value = currentSlug
      }
    // console.log("加载完毕：", currentSlug, homeSlug, headerSlug.value)
  })

  onBeforeUnmount(() => {
    if (currentSlug !== homeSlug && homeSlug !=='') {
      headerSlug.value = homeSlug
    }
    // console.log("即将卸载：", currentSlug, homeSlug, headerSlug.value)
  })

  return {
    headerSlug: headerSlug
  }
}
