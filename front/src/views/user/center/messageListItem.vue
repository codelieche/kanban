<template>
  <li class="item" @click="handleClick">
    <el-badge is-dot :type="unread ? 'primary' : 'info'"></el-badge>
    {{ data.title }}
  </li>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { ElNotification } from 'element-plus'

import fetchApi from '@/plugins/fetchApi'

export default defineComponent({
  name: 'MessageListItem',
  props: {
    data: Object,
  },
  setup(props) {
    // 是否未读
    const unread = ref(false)

    // 组件加载的时候判断unread的值
    onMounted(() => {
      if (props.data && props.data?.unread !== undefined) {
        unread.value = props.data.unread
      }
    })

    // 消息点击事件
    const handleClick = () => {
      console.log(props.data)
      if (!props.data) {
        return
      } else {
        // 跳转的a连接
        let linkElement = ''
        if (props.data.link) {
          linkElement = `<a href="${props.data.link}">查看详情</a>`
        }
        // 消息内容
        const content = `
        <div class="message">
          <div class="meta">
            <span class="meta-item">消息类型:${props.data.scope}</span>
            <span class="meta-item">发送时间:${props.data.time_added}</span>
          </div>
          <div class="content">
            ${props.data.content} ${linkElement}
          </div>
        </div>`
        // 弹出消息
        ElNotification({
          title: props.data.title,
          // message: props.data.content,
          dangerouslyUseHTMLString: true,
          message: content,
          offset: 40,
          duration: 0,
        })

        // 修改unread的值
        if (unread.value) {
          unread.value = false
          // 发起读取消息的请求，从而触发后台把未读变成已读
          fetchApi
            .get(`/api/v1/account/message/${props.data.id}`)
            .then((response) => response.data)
            .catch((err) => console.log(err))
        }
      }
    }

    return {
      unread,
      handleClick,
    }
  },
})
</script>