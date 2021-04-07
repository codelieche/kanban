<template>
  <div class="namespace">
    <div class="current">
      <span :style="{ color: 'red' }">
        <Icon type="flag" />
      </span>
      <span class="name"  @mouseenter="() => (showGroups = true)">
        {{ globalGroup && globalGroup.name ? globalGroup.name : '' }}
        <Icon type="arrows-v" />
      </span>
    </div>
    <div
      :class="['groups-nav', { active: showGroups }]"
      @mouseleave="() => (showGroups = false)"
    >
      <!-- 左侧的全部分组 -->
      <div
        class="groups"
        v-if="!loading && dataSource.length > 0 && showGroups"
      >
        <ul>
          <li
            v-for="item in dataSource"
            :key="item.id"
            @mouseenter="() => (currentGroup = item)"
            @click.stop="handleGroupClick(item)"
          >
            {{ item.name }}
          </li>
        </ul>
      </div>

      <!-- 右侧选中的分组 -->
      <div
        class="current"
        v-if="
          currentGroup &&
          currentGroup?.id > 0 &&
          currentGroup.children?.length > 0
        "
      >
        <div class="header">
          <div class="title">{{ currentGroup.name }}</div>
        </div>
        <div
          class="content"
          v-if="currentGroup.children && currentGroup.children.length > 0"
        >
          <el-row :gutter="24">
            <CurrentGroupChildrenItem
              v-for="item in currentGroup.children"
              :key="`top-${item.id}`"
              :data="item"
              :level="1"
              :handleGroupClick="handleGroupClick"
            />
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

import {
  globalGroup,
  setGlobalGroup,
} from '@/hooks/store/useArticleLeftSiderData'
import { useFetchListData } from '@/hooks/utils/useFetchData'

import Icon from '@/components/base/icon.vue'
import CurrentGroupChildrenItem from './components/currentGroupChildren.vue'

export default defineComponent({
  name: 'ArticleGroups',
  components: {
    Icon,
    CurrentGroupChildrenItem,
  },
  setup() {
    // 获取分组列表
    const apiUrl = ref('/api/v1/docs/group/all?level=1')
    
    // 回调函数
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const callback = (groups: Array<Record<string, any>>) => {
      if (groups && groups.length > 0) {
        if (!(globalGroup.value && globalGroup.value['id'])) {
          // globalGroup.value = groups[0]
          setGlobalGroup(groups[0])
        }
      }
    }

    // 全部的一级分组数据
    const { loading, dataSource } = useFetchListData(
      apiUrl,
      ref(0),
      callback
    )

    // 当前分组
    const currentGroup = ref({})

    // 显示所有分组
    const showGroups = ref(false)

    // 分组点击事件
    const handleGroupClick = (data: object) => {
      setGlobalGroup(data)
      showGroups.value = false
    }

    return {
      globalGroup,
      loading,
      dataSource,
      showGroups,
      currentGroup,
      handleGroupClick,
    }
  },
})
</script>