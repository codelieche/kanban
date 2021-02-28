<template>
  <div class="object-item">
    <div class="item-inner">
      <img
        v-if="data.category === 'image'"
        :src="data.fileurl ? data.fileurl : data.file"
        :alt="data.filename"
      />
      <div v-else class="info">
        <div class="info-item">
          <div class="config">类型:</div>
          <div class="value">
            {{ data.category }}
          </div>
        </div>
        <div class="info-item">
          <div class="config">名字:</div>
          <div class="value">
            {{ data.filename }}
          </div>
        </div>
        <div class="info-item">
          <div class="config">用户:</div>
          <div class="value">
            {{ data.user }}
          </div>
        </div>
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

<style lang="less" scoped>
.info {
  padding: 10px;
  // min-height: 100px;
  text-align: left;
  .info-item {
    display: flex;
    flex-direction: row;
    color: #999;
    border-bottom: 1px dashed #d4d6d8;
    margin-bottom: 5px;
    padding: 3px 5px;
    .config,
    .value {
      display: inline-block;
      flex: 3;
    }
    .config {
      flex: 1;
      text-align: right;
      margin-right: 10px;
    }
  }
}
.item {
  display: inline-block;
  max-width: 60px;
}
</style>