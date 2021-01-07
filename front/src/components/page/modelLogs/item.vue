<template>
  <div class="modellog-item">
    <div class="row info">
      <span class="config">用户:</span>
      <span class="value">{{ data.user }}</span>
    </div>
    <div class="row info">
      <span class="config">操作:</span>
      <span class="value">{{ actionText }}</span>
    </div>
    <div className="row info">
      <span className="config">信息:</span>
      <span className="value" v-if="Array.isArray(messages)">
        <!-- 遍历修改的信息 -->
        <div
          class="changed-message"
          v-for="(item, index) in messages"
          :key="index"
        >
          <div class="content">
            <div className="field">字段：{{ item.field }}</div>
            <div className="value-old">{{ item.value_old }}</div>
            <div className="value-new">{{ item.value_new }}</div>
          </div>
        </div>
      </span>
      <span className="value" v-else>
        {{ messages }}
      </span>
    </div>

    <div className="row info">
      <span className="config">时间:</span>
      <span className="value time">{{ data.time_added }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { ModelLog } from './types'
export default defineComponent({
  name: 'ModelLogItem',
  props: {
    data: Object as PropType<ModelLog>,
  },
  setup(props) {
    //   操作标题
    const actionText = computed(() => {
      if (props.data?.action_flag === 1) {
        return '添加'
      } else if (props.data?.action_flag === 2) {
        return '修改'
      } else if (props.data?.action_flag === 3) {
        return '删除'
      }
    })

    // 消息
    const messages = computed(() => {
      if (props.data?.action_flag === 1) {
        return '添加对象'
      } else if (props.data?.action_flag === 2) {
        if (Array.isArray(props.data.message)) {
          return props.data.message
        } else {
          return '修改对象'
        }
      } else if (props.data?.action_flag === 3) {
        return '删除对象'
      }
    })

    return {
      actionText,
      messages,
    }
  },
})
</script>