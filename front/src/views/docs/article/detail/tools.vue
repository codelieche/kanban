<template>
  <!-- 右上角的菜单 -->
  <div class="tools" v-if="canEditor">
    <el-dropdown>
      <div class="toogle">
        <Icon type="ellipsis-h" />
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item 
            :disabled="!canEditor" 
            @click="handleEditorClick">编辑</el-dropdown-item
          >
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script lang="ts">
// 文章右上角的工具按钮

import { defineComponent, inject, Ref } from 'vue'
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
  setup(props) {
    const showArticleEditor: Ref<boolean> | undefined = inject(
      'showArticleEditor'
    )
    const handleEditorClick = () => {
      if (props.canEditor && showArticleEditor) {
        showArticleEditor.value = true
      }
    }
    return {
      handleEditorClick,
    }
  },
})
</script>