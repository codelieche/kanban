<template>
  <!-- separator-class="el-icon-arrow-right" -->
  <el-breadcrumb class="navs" separator="/" v-if="breadcrumbItems.length > 0">
    <el-breadcrumb-item
      v-for="(item, index) in breadcrumbItems"
      :key="index"
      :to="{ path: item.link }"
    >
      <Icon type="home" v-if="item.icon">{{ item.title }}</Icon>
      <span v-else>{{ item.title }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Icon from '@/components/base/icon.vue'
import { breadcrumbItems } from '@/hooks/store/useBreadcrumbItems'

export default defineComponent({
  name: 'Breadcrumb',
  components: {
    Icon,
  },
  setup() {
    return {
      breadcrumbItems,
    }
  },
})
</script>