<template>
  <div class="info-property hover-buttons">
    <dl>
      <dt>ID:</dt>
      <dd>{{ data.id }}</dd>
    </dl>
    <dl>
      <dt>平台:</dt>
      <dd>{{ data.platform }}</dd>
    </dl>
    <dl>
      <dt>账号:</dt>
      <dd>{{ data.account }}</dd>
    </dl>
    <dl>
      <dt>Bucket:</dt>
      <dd>{{ data.bucket }}</dd>
    </dl>
    <dl>
      <dt>Access Key:</dt>
      <dd>{{ data.access_key }}</dd>
    </dl>
    <dl>
      <dt>添加时间:</dt>
      <dd>{{ data.time_added }}</dd>
    </dl>

    <!-- 按钮 -->
    <div class="buttons-wrap">
      <div class="buttons">
        <router-link :to="`/storage/account/${data.id}`" class="btn">
          <Icon type="link">查看详情</Icon>
        </router-link>

        <router-link
          :to="`/storage/account/${data.id}/editor`"
          v-if="canEditor"
          class="btn"
        >
          <Icon type="edit">编辑</Icon>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Icon from '@/components/base/icon.vue'

export default defineComponent({
  name: 'AccountItem',
  props: {
    data: Object,
    canEditor: { type: Boolean, default: () => false },
  },
  components: { Icon },
})
</script>