<template>
  <el-col :sm="8" :lg="6" class="item" v-if="data && level == 1">
    <div class="title" @click.stop="handleGroupClick(data)">
      {{ data.name }}
    </div>
    <div class="children" v-if="data.children && data.children.length > 0">
      <CurrentGroupChildrenItem
        v-for="item in data.children"
        :key="`${data.id}-${item.id}`"
        :data="item"
        :level="level + 1"
        :handleGroupClick="handleGroupClick"
      />
    </div>
  </el-col>

  <!-- 不是一级分组 -->
  <div class="item" v-else-if="data && level > 1">
    <div class="title" :style="{ 'padding-left': `${10 * level}px` }" @click.stop="handleGroupClick(data)">
      {{ data.name }}
    </div>
    <div class="children" v-if="data.children && data.children.length > 0">
      <CurrentGroupChildrenItem
        v-for="item in data.children"
        :key="`${data.id}-${item.id}`"
        :data="item"
        :level="level + 1"
        :handleGroupClick="handleGroupClick"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

import { setGlobalGroup } from '@/hooks/store/useArticleLeftSiderData'
export default defineComponent({
  name: 'CurrentGroupChildrenItem',
  props: {
    data: Object,
    level: { type: Number, default: () => 1 },
    handleGroupClick: Function
  },
  setup() {
    return {
      setGlobalGroup,
    }
  },
})
</script>