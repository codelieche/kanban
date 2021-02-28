<template>
  <div class="object-item">
    <div class="item-inner">
      <img v-if="data.category === 'image'" 
      :src="data.fileurl ? data.fileurl : data.file"
      :alt="data.filename"/>
      <div v-else class="info">
        {{ data.fileurl }}
      </div>

      <!-- 按钮 -->
      <div class="buttons">
        <el-button
          type="text"
          size="small"
          @click.stop.prevent="
            copyTextFunc('图片链接', data.fileurl ? data.fileurl : data.file)
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
              `![${data.filename}](${data.fileurl ? data.fileurl : data.file})`
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
  name: 'ObjectListItem',
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
.info {
  padding: 10px;

}
.item {
  display: inline-block;
  max-width: 400px;
}
</style>