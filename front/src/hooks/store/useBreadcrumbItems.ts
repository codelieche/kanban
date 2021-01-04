import { onMounted, ref } from 'vue'
import { NavBreadcrumbItem } from '@/types/base/nav'

export const breadcrumbItems = ref<Array<NavBreadcrumbItem>>([])

export default function(items: Array<NavBreadcrumbItem>) {
  onMounted(() => {
    breadcrumbItems.value = items
  })

  return {
    breadcrumbItems
  }
}
