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
        {{ messages ? messages : data.content }}
      </span>
    </div>
    <div className="row info">
      <span className="config">IP:</span>
      <span className="value time">{{
        data.address ? data.address : '---'
      }}</span>
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
      const action = props.data?.action
      if (typeof action === 'number') {
        if (action === 0) {
          return '日志'
        } else if (action === 1) {
          return '查看'
        } else if (action === 2) {
          return '添加'
        } else if (action === 3) {
          return '修改'
        } else if (action === 4) {
          return '删除'
        }
      }
    })

    // 消息
    const messages = computed(() => {
      const action = props.data?.action
      if (typeof action === 'number') {
        if (action === 2) {
          return '添加对象'
        } else if (action === 3) {
          // console.log(props.data?.content)
          if (props.data && Array.isArray(props.data?.content)) {
            return props.data?.content
          } else {
            return '修改对象'
          }
        } else if (action === 4) {
          return '删除对象'
        }
      }
    })

    return {
      actionText,
      messages,
    }
  },
})
</script>