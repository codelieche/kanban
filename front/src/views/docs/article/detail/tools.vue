<template>
  <!-- 右上角的菜单 -->
  <div class="tools" v-if="canEditor">
    <el-dropdown>
      <div class="toogle">
        <Icon type="ellipsis-h" />
      </div>
    </el-dropdown>
  </div>
</template>

<script lang="ts">
// 文章右上角的工具按钮

import { defineComponent } from 'vue'
import Icon from '@/components/base/icon.vue'

export default defineComponent({
  name: 'ArticleDetailTools',
  props: {
    id: String,
    data: Object,
    canEditor: Boolean,
  },
  components: {
    Icon,
  },
})
</script>