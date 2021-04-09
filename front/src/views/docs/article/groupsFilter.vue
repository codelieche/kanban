<template>
  <div class="groups" v-if="dataSource.length > 0">
    <div
      class="item"
      :class="{ active: currentGroupID == '' }"
      @click.stop="handleGroupOnChange('')"
    >
      全部
    </div>
    <div
      class="item"
      v-for="(item, index) in dataSource"
      :key="index"
      :class="{ active: currentGroupID == item.id }"
      @click.stop="handleGroupOnChange(item.id)"
    >
      {{ item.name }}
    </div>
  </div>
</template>

<script lang="ts">
import { useFetchListData } from '@/hooks/utils/useFetchData'
import { defineComponent, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
export default defineComponent({
  name: 'ArticleGroupFilter',
  props: {
    handleGroupChange: Function,
  },
  setup(props) {
    const url = '/api/v1/docs/group/all'
    const { dataSource } = useFetchListData(url)

    // 当前分组ID
    const currentGroupID = ref('')

    // 路由
    const router = useRouter()

    watch(
      [router.currentRoute],
      () => {
        const query = router.currentRoute.value.query
        if (query['group_id'] !== currentGroupID.value) {
          currentGroupID.value = query['group_id']
            ? (query['group_id'] as string)
            : ''
        }
      },
      { immediate: true }
    )

    // Group变更默认的处理函数
    const onGroupChange = (id: number | string) => {
      if (currentGroupID.value == id) {
        return
      } else {
        // 需要跳转
        // console.log(id)
        currentGroupID.value = id.toString()
        const query = router.currentRoute.value.query
        const newQuery = { 'group_id': currentGroupID.value }
        for (const key in query) {
          if (key !== 'page' && key !== 'group_id' && query[key]) {
            newQuery[key] = query[key]
          }
        }
        router.push({
          path: router.currentRoute.value.path,
          query: newQuery,
        })
      }
    }

    const handleGroupOnChange = (id: number | string) => {
      // 判断是否传递了handleGroupChange：
      if (props.handleGroupChange) {
        currentGroupID.value = id.toString()
        props.handleGroupChange(id)
      } else {
        onGroupChange(id)
      }
    }

    return {
      dataSource,
      currentGroupID,
      handleGroupOnChange,
    }
  },
})
</script>

<style lang="less" scoped>
.groups {
  margin: 15px 0 10px 0;
  .item {
    font-size: 13px;
    line-height: 1.4;
    color: rgba(0, 0, 0, 0.65);
    display: inline-block;
    padding: 3px 10px;
    border-radius: 3px;
    margin-right: 5px;
    margin-bottom: 2px;
    cursor: pointer;
    &:hover {
      color: #1890ff;
    }
    &.active {
      color: #fff;
      background-color: #1890ff;
      &:hover {
        color: #fff;
      }
    }
  }
}
</style>