<template>
  <el-skeleton :loading="!data.id > 0">
    <div class="article-item" :key="data.id">
      <!-- 图片 -->
      <router-link :to="`/docs/article/${data.id}`" v-if="data.cover">
        <div class="cover">
          <img :src="data.cover" alt="封面" />
        </div>
      </router-link>

      <!-- 内容 -->
      <div class="content">
        <div class="title">
          <router-link :to="`/docs/article/${data.id}`">
            <h2>{{ data.title }}</h2>
          </router-link>
        </div>
        <div class="metadata">
          <span class="data item">时间: {{ data.time_added }}</span>
          <span class="data item">作者: {{ data.user }}</span>
          <!-- 显示文章标签 -->
          <div class="tags">
            <ObjectTags appLabel="docs" model="article" :objectID="data.id" filterUrl="/docs/article/list" />
          </div>
        </div>

        <!-- 描述 -->
        <div class="description" v-if="data.description">
          {{ data.description }}
        </div>
      </div>
    </div>
  </el-skeleton>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import ObjectTags from '@/components/page/objectTag/objectTags.vue'

export default defineComponent({
  name: 'ArticleItem',
  components: { ObjectTags },
  props: {
    data: Object,
  },
})
</script>