<template>
  <div>
    <div>我是测试组件</div>
    <div class="mermaid">
      {{ code }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'Test',
  props: {
    code: String,
  },
})
</script>