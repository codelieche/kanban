<template>
  <div class="loading">
    <div>
      <div class="message">
        <Icon type="el-icon-loading">
          {{ message }}
        </Icon>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Icon from '@/components/base/icon.vue'
export default defineComponent({
  name: 'Loading',
  components: { Icon },
  props: {
    message: {
      type: String,
      default: () => '数据加载中...',
    },
  },
})
</script>