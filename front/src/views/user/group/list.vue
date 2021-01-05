<template>
  <div class="top-bar">
    <div class="title">
      <h4>分组列表</h4>
    </div>
  </div>
  <BaseTable
    apiUrlPrefix="/api/v1/account/group/list"
    pageUrlPrefix="/user/group/list"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import BaseTable from '@/components/page/baseTable.vue'
// import { Group } from '@/types/models/account'
export default defineComponent({
  name: 'UserGroupList',
  components: {
    BaseTable,
  },
  setup() {
    // 获取分组数据
    // const apiUrl = ref<string>('')

    return {
    }
  },
})
</script>