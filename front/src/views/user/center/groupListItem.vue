<template>
  <el-col :xs="24" :sm="12" :md="12" :lg="8" class="info-item">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>{{ data.name }}</span>
        </div>
      </template>
      <div class="info">
        <div class="row">
          <div class="config">名称:</div>
          <div class="value">
            <router-link :to="`/docs/group/${data.id}`">{{
              data.name
            }}</router-link>
          </div>
        </div>
      </div>
      <div class="info">
        <div class="row">
          <div class="config">代码:</div>
          <div class="value">
            {{ data.code }}
          </div>
        </div>
      </div>
      <div class="buttons">
        <div class="button">
          <router-link :to="`/docs/group/${data.id}`">查看详情</router-link>
        </div>
        <div class="button">
          <router-link :to="`/docs/group/${data.id}`">查看文章</router-link>
        </div>
      </div>
    </el-card>
  </el-col>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'GroupListItem',
  props: {
    data: Object,
  },
})
</script>