<template>
  <div class="top-bar">
    <div class="title">
      <h4>{{ title }}</h4>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'TopBar',
  props: {
    title: {
      type: String,
      default: () => '标题',
    },
  },
})
</script>