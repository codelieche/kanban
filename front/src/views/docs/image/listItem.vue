<template>
  <div class="image-item">
    <div class="item-inner">
      <img :src="data.qiniu" :alt="data.filename" v-if="data.qiniu" />
      <img :src="data.file" :alt="data.filename" v-else />
      <!-- 按钮 -->
      <div class="buttons">
        <el-button
          type="text"
          size="small"
          @click.stop.prevent="
            copyTextFunc('图片链接', data.qiniu ? data.qiniu : data.file)
          "
        >
          <Icon type="copy">链接</Icon>
        </el-button>
        <el-button
          type="text"
          size="small"
          @click.stop.prevent="
            copyTextFunc(
              'Markdown',
              `![${data.filename}](${data.qiniu ? data.qiniu : data.file})`
            )
          "
        >
          <Icon type="copy">Markdown</Icon>
        </el-button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import Icon from '@/components/base/icon.vue'
import { copyTextFunc } from '@/utils/copy'
export default defineComponent({
  name: 'ImageListItem',
  components: { Icon },
  props: {
    data: Object,
  },
  setup() {
    return {
      copyTextFunc,
    }
  },
})
</script>

<style scoped>
.item {
  display: inline-block;
  max-width: 400px;
}
</style>